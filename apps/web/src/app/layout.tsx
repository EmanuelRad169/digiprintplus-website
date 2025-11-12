import './globals.css'
import { Inter } from 'next/font/google'
import Providers from './providers'
import Navigation from '@/components/navigation'
import { Footer } from '@/components/footer'
import { HeaderTop } from '@/components/header-top'
import { VisualEditing } from '@/components/visual-editing'
import { generateSEO, generateOrganizationSchema } from '@/lib/seo'

// Initialize the Inter font with SWC
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata = generateSEO({
  title: 'Professional Print Solutions',
  description: 'Your trusted partner for high-quality printing services. Get instant quotes for business cards, brochures, banners, and more.',
  keywords: ['printing', 'business cards', 'brochures', 'banners', 'professional printing', 'custom printing', 'print services'],
  canonical: '/',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema()

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA4_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="font-sans">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <HeaderTop />
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <VisualEditing />
        </Providers>
      </body>
    </html>
  )
}