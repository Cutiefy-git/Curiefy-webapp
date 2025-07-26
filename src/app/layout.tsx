import type { Metadata, Viewport } from 'next'
import { Poppins, Great_Vibes, Dancing_Script } from 'next/font/google'
import './globals.css'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins'
})

const greatVibes = Great_Vibes({ 
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-great-vibes'
})

const dancingScript = Dancing_Script({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dancing-script'
})

export const metadata: Metadata = {
  title: 'Cutiefy - Boutique Jewelry & Gifts',
  description: 'Beautiful handcrafted jewelry and unique gift items. Discover the perfect piece to express your style.',
  keywords: 'jewelry, gifts, boutique, handcrafted, accessories',
  authors: [{ name: 'Cutiefy Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F8D4DC',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${greatVibes.variable} ${dancingScript.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`min-h-screen bg-cutie-bg text-cutie-charcoal font-sans antialiased ${dancingScript.className}`}>
        {children}
      </body>
    </html>
  )
}