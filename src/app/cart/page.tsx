'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '../../store/cartStore'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore()
  const [isClearing, setIsClearing] = useState(false)

  const handleClearCart = () => {
    setIsClearing(true)
    setTimeout(() => {
      clearCart()
      setIsClearing(false)
    }, 300)
  }

  const subtotal = getTotalPrice()
  const deliveryCharges = subtotal > 2000 ? 0 : 150 // Free delivery over ₹2000
  const total = subtotal + deliveryCharges

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
          
          <Link href="/shop" className="font-elegant text-cutie-charcoal hover:text-cutie-gold transition-colors">
            Continue Shopping
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-elegant text-cutie-charcoal mb-4">
            Your Cart
          </h1>
          <p className="text-lg font-elegant text-cutie-charcoal/80">
            Review your beautiful selections
          </p>
        </div>

        {items.length === 0 ? (
          // Empty Cart
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🛍️</div>
            <h2 className="text-3xl font-elegant text-cutie-charcoal mb-4">
              Your cart is empty
            </h2>
            <p className="text-lg font-elegant text-cutie-charcoal/70 mb-8">
              Discover our beautiful collections and add items to your cart
            </p>
            <Link href="/shop" className="btn-primary inline-block text-lg font-elegant px-8 py-3 no-underline">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg">
                <div className="p-6 border-b border-cutie-gold/20">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-elegant text-cutie-charcoal">
                      Cart Items ({items.length})
                    </h2>
                    {items.length > 0 && (
                      <button
                        onClick={handleClearCart}
                        disabled={isClearing}
                        className="text-cutie-charcoal/60 hover:text-red-500 font-elegant transition-colors"
                      >
                        {isClearing ? 'Clearing...' : 'Clear All'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="divide-y divide-cutie-gold/10">
                  {items.map((item) => (
                    <div key={item.itemId} className="p-6 flex items-center space-x-4">
                      {/* Item Image */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-grow">
                        <h3 className="font-elegant text-lg text-cutie-charcoal mb-1">
                          {item.name}
                        </h3>
                        <p className="text-cutie-gold font-elegant font-semibold">
                          ₹{item.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-cutie-bg text-cutie-charcoal hover:bg-cutie-gold hover:text-white transition-colors duration-200 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-elegant font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-cutie-bg text-cutie-charcoal hover:bg-cutie-gold hover:text-white transition-colors duration-200 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right min-w-[80px]">
                        <p className="font-elegant font-semibold text-cutie-charcoal">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.itemId)}
                        className="text-cutie-charcoal/60 hover:text-red-500 transition-colors p-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-elegant text-cutie-charcoal mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between font-elegant">
                    <span className="text-cutie-charcoal">Subtotal</span>
                    <span className="text-cutie-charcoal">₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between font-elegant">
                    <span className="text-cutie-charcoal">Delivery</span>
                    <span className={deliveryCharges === 0 ? "text-green-600" : "text-cutie-charcoal"}>
                      {deliveryCharges === 0 ? 'Free' : `₹${deliveryCharges}`}
                    </span>
                  </div>

                  {subtotal < 2000 && deliveryCharges > 0 && (
                    <p className="text-sm text-cutie-charcoal/70 font-elegant">
                      Add ₹{(2000 - subtotal).toLocaleString()} more for free delivery
                    </p>
                  )}
                  
                  <hr className="border-cutie-gold/20" />
                  
                  <div className="flex justify-between font-elegant text-lg font-semibold">
                    <span className="text-cutie-charcoal">Total</span>
                    <span className="text-cutie-gold">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <Link 
                  href="/checkout"
                  className="btn-primary w-full text-center block text-lg font-elegant py-4 no-underline"
                >
                  Proceed to Checkout
                </Link>

                <div className="mt-4 text-center">
                  <Link 
                    href="/shop"
                    className="text-cutie-charcoal/70 hover:text-cutie-gold font-elegant transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}