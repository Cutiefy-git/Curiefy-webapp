'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getCategories } from '../../lib/firestore'
import type { Category } from '../../types'

export default function ShopPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function fetchCategories() {
      const debug: string[] = []
      try {
        debug.push('🔄 Starting to fetch categories...')
        setDebugInfo([...debug])
        
        const cats = await getCategories()
        debug.push(`📊 Fetched ${cats.length} categories`)
        debug.push(`📝 Categories: ${JSON.stringify(cats)}`)
        
        setCategories(cats)
        setDebugInfo([...debug])
      } catch (error: any) {
        debug.push(`❌ Error: ${error.message}`)
        setError(error.message)
        setDebugInfo([...debug])
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-cutie-bg">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-cutie-gold/30">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-6xl">
            <Link href="/" className="logo-3d cursor-pointer">
              <Image
                src="https://i.ibb.co/h1ZWHFbP/Untitled-design-1.png"
                alt="Cutiefy Logo"
                width={150}
                height={60}
                className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-300"
                priority
              />
            </Link>
            
            <div className="relative cursor-pointer group">
              <svg className="w-8 h-8 text-cutie-charcoal group-hover:text-cutie-gold transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-cutie-rose text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">0</span>
            </div>
          </div>
        </header>

        {/* Loading State */}
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-4xl font-elegant mb-4">🔄</div>
            <p className="text-xl font-elegant text-cutie-charcoal">Loading our beautiful collections...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cutie-bg">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-cutie-gold/30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-6xl">
          <Link href="/" className="logo-3d cursor-pointer">
            <Image
              src="https://i.ibb.co/h1ZWHFbP/Untitled-design-1.png"
              alt="Cutiefy Logo"
              width={150}
              height={60}
              className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-300"
              priority
            />
          </Link>
          
          <Link href="/cart" className="relative cursor-pointer group">
            <svg className="w-8 h-8 text-cutie-charcoal group-hover:text-cutie-gold transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-cutie-rose text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {mounted ? '0' : '0'}
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-elegant text-cutie-charcoal mb-4">
            Our Collections
          </h1>
          <p className="text-xl font-elegant text-cutie-charcoal/80">
            Discover handcrafted pieces that tell your story
          </p>
        </div>

        {categories.length === 0 ? (
          // Empty State with Debug Info
          <div className="text-center py-16">
            <div className="text-6xl mb-6">😸</div>
            <h2 className="text-3xl font-elegant text-cutie-charcoal mb-4">
              Hold tight—restocking soon!
            </h2>
            <p className="text-lg font-elegant text-cutie-charcoal/70 mb-8">
              Our artisans are crafting new beautiful pieces for you
            </p>
            
            {/* Debug Information */}
            {debugInfo.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto mb-8">
                <h3 className="text-xl font-elegant text-cutie-charcoal mb-4">Debug Info:</h3>
                <div className="text-left space-y-2">
                  {debugInfo.map((info, index) => (
                    <div key={index} className="bg-cutie-bg p-3 rounded-lg font-mono text-sm">
                      {info}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-2xl mx-auto">
                <strong>Error:</strong> {error}
              </div>
            )}
            
            <Link href="/" className="btn-primary inline-block text-lg font-elegant px-8 py-3 no-underline">
              Back to Home
            </Link>
          </div>
        ) : (
          // Categories Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/shop/${category.id}`}
                className="group block"
              >
                <div className="card text-center group-hover:scale-105 transition-all duration-300 bg-white">
                  {/* Category Icon/Image Placeholder */}
                  <div className="w-24 h-24 bg-gradient-to-br from-cutie-rose to-cutie-peach rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <span className="text-4xl">💎</span>
                  </div>
                  
                  <h3 className="text-2xl font-elegant text-cutie-charcoal mb-3 group-hover:text-cutie-gold transition-colors duration-200">
                    {category.name}
                  </h3>
                  
                  <p className="text-cutie-charcoal/70 font-elegant text-lg mb-4">
                    Explore our beautiful {category.name.toLowerCase()} collection
                  </p>
                  
                  <div className="inline-flex items-center text-cutie-gold font-elegant font-medium group-hover:translate-x-2 transition-transform duration-200">
                    Shop Now 
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-cutie-charcoal text-cutie-cream py-12 mt-16">
        <div className="container mx-auto px-4 text-center max-w-6xl">
          <div className="logo-3d mb-6 flex justify-center">
            <Image
              src="https://i.ibb.co/h1ZWHFbP/Untitled-design-1.png"
              alt="Cutiefy Logo"
              width={200}
              height={80}
              className="h-16 w-auto object-contain hover:scale-105 transition-transform duration-300 brightness-0 invert"
            />
          </div>
          <p className="mb-6 text-xl font-elegant">Beautiful jewelry and gifts, crafted with love</p>
          <p className="text-sm text-cutie-cream/70 font-elegant">
            © 2025 Cutiefy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}