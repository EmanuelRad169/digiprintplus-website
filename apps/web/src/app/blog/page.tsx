import { Metadata } from 'next'
import { getAllBlogPosts, getFeaturedBlogPosts, getBlogCategories } from '@/lib/sanity/fetchers'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar, User, Tag, TrendingUp } from 'lucide-react'

export const revalidate = 60

export default async function BlogPage() {
  const { isEnabled } = draftMode()
  const [posts, featuredPosts, categories] = await Promise.all([
    getAllBlogPosts(isEnabled),
    getFeaturedBlogPosts(3, isEnabled),
    getBlogCategories(isEnabled)
  ])

  const regularPosts = posts.filter(post => !post.featured)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-slate-900 overflow-hidden min-h-[20vh] flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/60"></div>
        </div>
        
        <div className="container mx-auto px-4 py-14 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Print Industry Insights
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 max-w-2xl">
              Stay updated with the latest trends, tips, and best practices in professional printing and design.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#featured" className="bg-gradient-to-r from-[#ea088c] to-pink-500 hover:from-pink-600 hover:to-[#ea088c] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-[#ea088c]/20 hover:shadow-[#ea088c]/30 flex items-center gap-2">
                Explore Articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          
          {/* Featured Posts Section */}
          {featuredPosts.length > 0 && (
            <section id="featured" className="mb-10">
              <div className="flex items-center gap-3 mb-8">
                <TrendingUp className="w-6 h-6 text-[#ea088c]" />
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Featured Articles</h2>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-8">
                {featuredPosts.map((post) => (
                  <article key={post._id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    {post.coverImage && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={post.coverImage.asset.url}
                          alt={post.coverImage.alt || post.title}
                          fill
                          className="object-cover"
                          priority
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-[#ea088c] text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Featured
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{post.author.name}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        <Link href={`/blog/${post.slug.current}`} className="hover:text-[#ea088c] transition-colors">
                          {post.title}
                        </Link>
                      </h3>
                      
                      {post.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                      )}
                      
                      {post.categories && post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.categories.slice(0, 2).map((category) => (
                            <span key={category._id} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                              <Tag className="w-3 h-3" />
                              {category.title}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <Link 
                        href={`/blog/${post.slug.current}`}
                        className="inline-flex items-center gap-2 text-[#ea088c] font-semibold hover:gap-3 transition-all"
                      >
                        Read More <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Categories Section */}
          {categories.length > 0 && (
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h3>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/blog/category/${category.slug.current}`}
                    className="bg-white border border-gray-200 hover:border-[#ea088c] px-4 py-2 rounded-lg text-gray-700 hover:text-[#ea088c] transition-all font-medium"
                  >
                    {category.title}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* All Posts Section */}
          <section>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">Latest Articles</h2>
            
            {regularPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post) => (
                  <article key={post._id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    {post.coverImage && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={post.coverImage.asset.url}
                          alt={post.coverImage.alt || post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{post.author.name}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        <Link href={`/blog/${post.slug.current}`} className="hover:text-[#ea088c] transition-colors">
                          {post.title}
                        </Link>
                      </h3>
                      
                      {post.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                      )}
                      
                      {post.categories && post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.categories.slice(0, 2).map((category) => (
                            <span key={category._id} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                              <Tag className="w-3 h-3" />
                              {category.title}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <Link 
                        href={`/blog/${post.slug.current}`}
                        className="inline-flex items-center gap-2 text-[#ea088c] font-semibold hover:gap-3 transition-all"
                      >
                        Read More <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No articles available yet. Check back soon!</p>
              </div>
            )}
          </section>

          {/* Bottom CTA */}
          <div className="bg-magenta-500 rounded-2xl p-8 md:p-12 relative overflow-hidden mt-12">
            <div className="absolute inset-0 bg-grid-white/5 bg-[length:20px_20px]"></div>
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Ready to start your next print project?</h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
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
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getAllBlogPosts()
  const totalPosts = posts.length
  
  return {
    title: 'Blog - Print Industry Insights | DigiPrintPlus',
    description: 'Stay updated with the latest trends, tips, and best practices in professional printing and design. Expert insights from the DigiPrintPlus team.',
    keywords: 'printing blog, print industry, design tips, printing trends, business printing, custom printing, print solutions, DigiPrintPlus insights',
    authors: [{ name: 'DigiPrintPlus Team' }],
    creator: 'DigiPrintPlus',
    publisher: 'DigiPrintPlus',
    robots: 'index,follow',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
    },
    openGraph: {
      title: 'Blog - Print Industry Insights | DigiPrintPlus',
      description: 'Stay updated with the latest trends, tips, and best practices in professional printing and design. Expert insights from the DigiPrintPlus team.',
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
      siteName: 'DigiPrintPlus',
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/blog-og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'DigiPrintPlus Blog - Print Industry Insights',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@digiprintplus',
      title: 'Blog - Print Industry Insights | DigiPrintPlus',
      description: 'Stay updated with the latest trends, tips, and best practices in professional printing and design.',
      images: [`${process.env.NEXT_PUBLIC_SITE_URL}/images/blog-og-image.jpg`],
    },
    other: {
      'blog:total_posts': totalPosts.toString(),
      'blog:updated': new Date().toISOString(),
    },
  }
}