'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getItems, getSubcategories, getItemImages, getItemPrimaryImage } from '../../../lib/firestore'
import { useCartStore } from '../../../store/cartStore'
import type { Item, Subcategory } from '../../../types'

export default function CategoryPage() {
  const params = useParams()
  const categoryId = params.categoryId as string
  
  const [items, setItems] = useState<Item[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState<{[key: string]: number}>({})
  const [modalImageIndex, setModalImageIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  
  const { addItem, getTotalItems } = useCartStore()
  const [cartItemCount, setCartItemCount] = useState(0)

  // Fix hydration mismatch for cart count
  useEffect(() => {
    setMounted(true)
    setCartItemCount(getTotalItems())
  }, [getTotalItems])

  // Image carousel component for item cards with auto-scroll
  const ItemImageCarousel = ({ item }: { item: Item }) => {
    const images = getItemImages(item)
    const currentIndex = selectedImageIndex[item.id] || 0
    const [isPaused, setIsPaused] = useState(false)
    
    // Auto-scroll effect - simplified and more reliable
    useEffect(() => {
      // Don't auto-scroll if only one image or if paused
      if (images.length <= 1 || isPaused) {
        return
      }
      
      // Set up interval for auto-scrolling
      const interval = setInterval(() => {
        setSelectedImageIndex(prev => {
          const currentIdx = prev[item.id] || 0
          const nextIdx = (currentIdx + 1) % images.length
          return {
            ...prev,
            [item.id]: nextIdx
          }
        })
      }, 2000) // Change image every 2 seconds (faster for testing)
      
      // Cleanup interval on unmount or when dependencies change
      return () => clearInterval(interval)
      
    }, [item.id, images.length, isPaused]) // Remove currentIndex from dependencies
    
    const nextImage = (e: React.MouseEvent) => {
      e.stopPropagation()
      setSelectedImageIndex(prev => ({
        ...prev,
        [item.id]: (currentIndex + 1) % images.length
      }))
    }
    
    const prevImage = (e: React.MouseEvent) => {
      e.stopPropagation()
      setSelectedImageIndex(prev => ({
        ...prev,
        [item.id]: currentIndex === 0 ? images.length - 1 : currentIndex - 1
      }))
    }
    
    const goToImage = (index: number, e: React.MouseEvent) => {
      e.stopPropagation()
      setSelectedImageIndex(prev => ({
        ...prev,
        [item.id]: index
      }))
    }
    
    return (
      <div 
        className="relative group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Main Image */}
        <Image
          src={images[currentIndex]}
          alt={`${item.name} - Image ${currentIndex + 1}`}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Show controls only if multiple images */}
        {images.length > 1 && (
          <>
            {/* Navigation arrows - visible on hover */}
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
            >
              ‹
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
            >
              ›
            </button>
            
            {/* Dots indicator - always visible */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => goToImage(index, e)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-white shadow-lg' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
            
            {/* Image count badge */}
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
              {currentIndex + 1}/{images.length}
            </div>
            
            {/* Auto-scroll status indicator */}
            <div className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded transition-colors z-10 ${
              isPaused ? 'bg-red-500/80' : 'bg-green-500/80'
            }`}>
              {isPaused ? 'PAUSED' : 'AUTO'}
            </div>
          </>
        )}
        
        {/* Out of stock overlay */}
        {!item.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <span className="text-white font-elegant text-lg">Out of Stock</span>
          </div>
        )}
      </div>
    )
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Fetch all items, then filter by category
        const allItems = await getItems()
        
        // Filter items that belong to this category (using subcategoryId as categoryId)
        const categoryItems = allItems.filter(item => item.subcategoryId === categoryId)
        setItems(categoryItems)
        
        // For now, we won't use subcategories - just show all items for the category
        setSubcategories([])
        
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [categoryId])

  const filteredItems = items // Show all items for this category since we're not using subcategories now

  const handleAddToCart = (item: Item) => {
    const primaryImage = getItemPrimaryImage(item)
    
    addItem({
      itemId: item.id,
      name: item.name,
      price: item.price,
      imageUrl: primaryImage
    })
    
    // Update cart count after adding item
    setCartItemCount(getTotalItems())
    
    // Show success feedback (you can replace with a toast notification)
    alert(`${item.name} added to cart!`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cutie-bg">
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
                {mounted ? cartItemCount : 0}
              </span>
            </Link>
          </div>
        </header>

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-4xl font-elegant mb-4">🔄</div>
            <p className="text-xl font-elegant text-cutie-charcoal">Loading beautiful items...</p>
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
          
          <div className="flex items-center space-x-4">
            <Link href="/shop" className="font-elegant text-cutie-charcoal hover:text-cutie-gold transition-colors">
              ← Back to Shop
            </Link>
            <Link href="/cart" className="relative cursor-pointer group">
              <svg className="w-8 h-8 text-cutie-charcoal group-hover:text-cutie-gold transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-cutie-rose text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {mounted ? cartItemCount : 0}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Main Content - showing items directly for this category */}

        {filteredItems.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="text-6xl mb-6">😸</div>
            <h2 className="text-3xl font-elegant text-cutie-charcoal mb-4">
              Hold tight—restocking soon!
            </h2>
            <p className="text-lg font-elegant text-cutie-charcoal/70 mb-8">
              Our artisans are crafting new beautiful pieces for this collection
            </p>
            <Link href="/shop" className="btn-primary inline-block text-lg font-elegant px-8 py-3 no-underline">
              Browse Other Collections
            </Link>
          </div>
        ) : (
          // Items Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="card bg-white group cursor-pointer" onClick={() => setSelectedItem(item)}>
                {/* Item Image */}
                <div className="relative overflow-hidden rounded-lg mb-4 aspect-square">
                  <Image
                    src={getItemPrimaryImage(item)}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-elegant text-lg">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Item Info */}
                <h3 className="font-elegant text-xl text-cutie-charcoal mb-2 group-hover:text-cutie-gold transition-colors">
                  {item.name}
                </h3>
                <p className="text-2xl font-elegant text-cutie-gold font-semibold mb-4">
                  ₹{item.price.toLocaleString()}
                </p>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddToCart(item)
                  }}
                  disabled={!item.inStock}
                  className={`w-full py-3 rounded-lg font-elegant transition-all duration-200 ${
                    item.inStock
                      ? 'bg-cutie-rose text-white hover:bg-cutie-gold shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Item Modal with Image Gallery */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedItem(null)}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="float-right text-cutie-charcoal hover:text-cutie-gold transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="clear-both grid md:grid-cols-2 gap-6">
                {/* Image Gallery */}
                <div>
                  {(() => {
                    const images = getItemImages(selectedItem)
                    
                    return (
                      <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square rounded-lg overflow-hidden">
                          <Image
                            src={images[modalImageIndex]}
                            alt={`${selectedItem.name} - Image ${modalImageIndex + 1}`}
                            fill
                            className="object-cover"
                          />
                          
                          {/* Navigation arrows for main image */}
                          {images.length > 1 && (
                            <>
                              <button
                                onClick={() => setModalImageIndex(modalImageIndex === 0 ? images.length - 1 : modalImageIndex - 1)}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
                              >
                                ‹
                              </button>
                              <button
                                onClick={() => setModalImageIndex((modalImageIndex + 1) % images.length)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
                              >
                                ›
                              </button>
                            </>
                          )}
                        </div>
                        
                        {/* Thumbnail Gallery */}
                        {images.length > 1 && (
                          <div className="grid grid-cols-4 gap-2">
                            {images.map((image, index) => (
                              <button
                                key={index}
                                onClick={() => setModalImageIndex(index)}
                                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                                  index === modalImageIndex 
                                    ? 'border-cutie-gold' 
                                    : 'border-gray-200 hover:border-cutie-gold/50'
                                }`}
                              >
                                <Image
                                  src={image}
                                  alt={`${selectedItem.name} thumbnail ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {/* Image counter */}
                        <p className="text-center text-sm text-cutie-charcoal/70 font-elegant">
                          Image {modalImageIndex + 1} of {images.length}
                        </p>
                      </div>
                    )
                  })()}
                </div>

                {/* Details */}
                <div>
                  <h2 className="text-3xl font-elegant text-cutie-charcoal mb-4">{selectedItem.name}</h2>
                  <p className="text-3xl font-elegant text-cutie-gold font-semibold mb-6">
                    ₹{selectedItem.price.toLocaleString()}
                  </p>
                  <p className="text-lg font-elegant text-cutie-charcoal/80 mb-6 leading-relaxed">
                    {selectedItem.description}
                  </p>
                  
                  <button
                    onClick={() => {
                      handleAddToCart(selectedItem)
                      setSelectedItem(null)
                    }}
                    disabled={!selectedItem.inStock}
                    className={`w-full py-4 rounded-lg font-elegant text-lg transition-all duration-200 ${
                      selectedItem.inStock
                        ? 'bg-cutie-rose text-white hover:bg-cutie-gold shadow-lg hover:shadow-xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {selectedItem.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}