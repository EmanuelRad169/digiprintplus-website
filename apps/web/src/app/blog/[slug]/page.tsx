import { Metadata } from 'next'
import { getAllBlogSlugs, getBlogPostBySlug, getAllBlogPosts } from '@/lib/sanity/fetchers'
import { PortableTextRenderer } from '@/components/portable-text'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ShareButton } from '@/components/share-button'

export const revalidate = 60

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const posts = await getAllBlogPosts()
    
    return posts
      .filter((post) => post.slug?.current)
      .map((post) => ({
        slug: post.slug!.current,
      }))
  } catch (error) {
    console.error('Error generating static params for blog posts:', error)
    return []
  }
}

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { isEnabled } = await draftMode()
  const post = await getBlogPostBySlug(params.slug, isEnabled)

  if (!post) {
    notFound()
  }

  // Get related posts (excluding current post)
  const allPosts = await getAllBlogPosts(isEnabled)
  const relatedPosts = allPosts
    .filter(p => p._id !== post._id)
    .slice(0, 3)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatReadingTime = (content: any[]) => {
    // Rough estimate: 200 words per minute
    const wordsPerMinute = 200
    const contentString = JSON.stringify(content)
    const wordCount = contentString.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readingTime} min read`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt || post.seo?.metaDescription,
            image: post.coverImage?.asset.url || post.seo?.ogImage?.asset.url,
            author: {
              '@type': 'Person',
              name: post.author.name,
              image: post.author.image?.asset.url,
            },
            publisher: {
              '@type': 'Organization',
              name: 'DigiPrintPlus',
              logo: {
                '@type': 'ImageObject',
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`,
              },
            },
            datePublished: post.publishedAt,
            dateModified: post.publishedAt,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug.current}`,
            },
            keywords: [
              ...(post.categories?.map(cat => cat.title) || []),
              ...(post.seo?.keywords || []),
            ].join(', '),
            articleSection: post.categories?.[0]?.title || 'Blog',
            wordCount: JSON.stringify(post.content).split(/\s+/).length,
            inLanguage: 'en-US',
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug.current}`,
          }),
        }}
      />

      {/* Simple Header */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#ea088c] transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Article Header */}
          <header className="mb-4">
            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((category) => (
                  <span key={category._id} className="text-xs font-medium text-[#ea088c] bg-[#ea088c]/5 px-3 py-1 rounded-full">
                    {category.title}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
              <div className="flex items-center gap-2">
                {post.author.image && (
                  <Image
                    src={post.author.image.asset.url}
                    alt={post.author.image.alt || post.author.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="font-medium text-gray-700">{post.author.name}</span>
              </div>
              <span>{formatDate(post.publishedAt)}</span>
              <span>{formatReadingTime(post.content)}</span>
            </div>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8">
                <Image
                  src={post.coverImage.asset.url}
                  alt={post.coverImage.alt || post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <PortableTextRenderer content={post.content} />
          </div>
          
          {/* Share */}
          <div className="flex items-center justify-between py-8 border-t border-gray-100">
            <span className="text-sm font-medium text-gray-700">Share this article</span>
            <ShareButton title={post.title} excerpt={post.excerpt} />
          </div>

          {/* Author Bio */}
          {post.author.bio && (
            <div className="bg-gray-50 rounded-lg p-6 mt-8">
              <div className="flex items-start gap-4">
                {post.author.image && (
                  <Image
                    src={post.author.image.asset.url}
                    alt={post.author.image.alt || post.author.name}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">About {post.author.name}</h3>
                  <div className="prose prose-sm text-gray-600">
                    <PortableTextRenderer content={post.author.bio} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Related Posts - Simplified */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
              
              <div className="space-y-6">
                {relatedPosts.map((relatedPost) => (
                  <article key={relatedPost._id} className="bg-white rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex gap-6">
                      {relatedPost.coverImage && (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={relatedPost.coverImage.asset.url}
                            alt={relatedPost.coverImage.alt || relatedPost.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          <Link href={`/blog/${relatedPost.slug.current}`} className="hover:text-[#ea088c] transition-colors">
                            {relatedPost.title}
                          </Link>
                        </h3>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          <span>{relatedPost.author.name}</span>
                          <span>{formatDate(relatedPost.publishedAt)}</span>
                        </div>
                        
                        {relatedPost.excerpt && (
                          <p className="text-gray-600 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Simple CTA */}
      <div className="container bg-magenta-500 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/5 bg-[length:20px_20px]"></div>
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Ready to start your next print project?</h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xlxl mx-auto">
                Contact us today to discuss how our printing services can help bring your ideas to life.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  href="/quote" 
                    className="inline-flex items-center justify-center bg-black text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Get a Quote
                </Link>
                <Link 
                  href="/contact" 
                    className="inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
    </div>
  )
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs()
  
  return slugs.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  // SEO data with fallbacks
  const seoTitle = post.seo?.metaTitle || post.title
  const seoDescription = post.seo?.metaDescription || post.excerpt || `Read ${post.title} on the DigiPrintPlus blog`
  const ogTitle = post.seo?.ogTitle || seoTitle
  const ogDescription = post.seo?.ogDescription || seoDescription
  const ogImage = post.seo?.ogImage || post.coverImage
  const canonicalUrl = post.seo?.canonicalUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug.current}`
  
  // Keywords from categories and SEO field
  const categoryKeywords = post.categories?.map(cat => cat.title.toLowerCase()) || []
  const seoKeywords = post.seo?.keywords || []
  const allKeywords = [...new Set([...categoryKeywords, ...seoKeywords, 'printing', 'blog', 'digiprintplus'])]

  return {
    title: `${seoTitle} | DigiPrintPlus Blog`,
    description: seoDescription,
    keywords: allKeywords.join(', '),
    authors: [{ name: post.author.name }],
    creator: post.author.name,
    publisher: 'DigiPrintPlus',
    robots: post.seo?.noIndex ? 'noindex,nofollow' : 'index,follow',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: 'article',
      url: canonicalUrl,
      siteName: 'DigiPrintPlus Blog',
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
      authors: [post.author.name],
      section: post.categories?.[0]?.title || 'Blog',
      tags: allKeywords,
      images: ogImage ? [
        {
          url: ogImage.asset.url,
          width: 1200,
          height: 630,
          alt: ogImage.alt || post.title,
          type: 'image/jpeg',
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@digiprintplus',
      creator: `@${post.author.name.toLowerCase().replace(/\s+/g, '')}`,
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [
        {
          url: ogImage.asset.url,
          alt: ogImage.alt || post.title,
        }
      ] : [],
    },
    other: {
      'article:author': post.author.name,
      'article:published_time': post.publishedAt,
      'article:section': post.categories?.[0]?.title || 'Blog',
      'article:tag': allKeywords.join(','),
    },
  }
}