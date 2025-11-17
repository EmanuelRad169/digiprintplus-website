import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import { getPageBySlug } from '@/lib/sanity/fetchers'
import { generateSEO } from '@/lib/seo'
import { PortableText } from '@portabletext/react'
import { Metadata } from 'next'

export const revalidate = 60

// Custom components for PortableText
const portableTextComponents = {
  block: {
    // Define custom styles for different heading levels
    h1: ({ children }: any) => <h1 className="text-4xl font-bold text-gray-900 mt-8 mb-6">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-3">{children}</h3>,
    h4: ({ children }: any) => <h4 className="text-xl font-semibold text-gray-900 mt-4 mb-2">{children}</h4>,
    normal: ({ children }: any) => <p className="text-gray-700 leading-relaxed mb-4">{children}</p>,
    blockquote: ({ children }: any) => <blockquote className="border-l-4 border-magenta-500 pl-4 italic text-gray-600 my-4">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="text-gray-700">{children}</li>,
    number: ({ children }: any) => <li className="text-gray-700">{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold text-gray-900">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    code: ({ children }: any) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>,
    link: ({ children, value }: any) => (
      <a href={value.href} className="text-magenta-600 hover:text-magenta-700 hover:underline">
        {children}
      </a>
    ),
  },
}

export default async function PrivacyPage() {
  const { isEnabled } = await draftMode()
  const page = await getPageBySlug('privacy', isEnabled)

  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left text-white max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              {page.title}
            </h1>
            {page.subtitle && (
              <p className="text-xl md:text-2xl text-gray-100 leading-relaxed">
                {page.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="p-4 lg:p-8">
          <div className="max-w-none">
            {page.content && <PortableText value={page.content} components={portableTextComponents} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('privacy')
  
  if (!page) {
    return {
      title: 'Privacy Policy',
      description: 'Privacy policy for DigiPrintPlus'
    }
  }

  return generateSEO({
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription || page.subtitle || 'Privacy policy for DigiPrintPlus',
    canonical: '/privacy'
  })
}