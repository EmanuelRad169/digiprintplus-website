import './globals.css'
import { Inter } from 'next/font/google'
import Providers from './providers'
import Navigation from '../components/navigation'
import { Footer } from '../components/footer'
import { HeaderTop } from '../components/header-top'

// Initialize the Inter font with SWC
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata = {
  title: 'DigiPrintPlus - Professional Print Solutions',
  description: 'Your trusted partner for high-quality printing services. Get instant quotes for business cards, brochures, banners, and more.',
  keywords: 'printing, business cards, brochures, banners, professional printing, custom printing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="font-sans">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <HeaderTop />
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}