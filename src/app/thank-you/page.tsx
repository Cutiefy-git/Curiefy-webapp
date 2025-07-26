// src/app/thank-you/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

export default function ThankYouPage() {
  const router = useRouter();
  const clearCart = useCartStore(state => state.clearCart);

  useEffect(() => {
    // Clear the cart after successful order
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Animation */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Thank You Message */}
          <h1 className="text-4xl font-cursive text-gold mb-4">
            Thank You for Your Order!
          </h1>
          
          <div className="bg-cream p-8 rounded-lg shadow-lg mb-8">
            <p className="text-charcoal text-lg mb-4">
              We've received your order and sent a confirmation email to you.
            </p>
            <p className="text-charcoal mb-6">
              Our team will contact you shortly with payment details and delivery information.
            </p>
            
            {/* Order Details Card */}
            <div className="bg-white p-6 rounded-lg border border-gold/20">
              <h2 className="text-xl font-semibold text-charcoal mb-3">
                What happens next?
              </h2>
              <ol className="text-left text-charcoal space-y-2">
                <li className="flex items-start">
                  <span className="text-gold font-bold mr-2">1.</span>
                  <span>You'll receive an order confirmation email</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold font-bold mr-2">2.</span>
                  <span>Our team will contact you for payment arrangements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold font-bold mr-2">3.</span>
                  <span>Once payment is confirmed, we'll prepare your order</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold font-bold mr-2">4.</span>
                  <span>You'll receive tracking information when dispatched</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 bg-rose text-white rounded-full hover:bg-rose/90 transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/shop"
              className="px-8 py-3 border-2 border-gold text-gold rounded-full hover:bg-gold hover:text-white transition-colors"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Contact Information */}
          <div className="mt-12 text-charcoal">
            <p className="text-sm">
              Have questions? Contact us at{' '}
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@cutiefy.com'}`}
                className="text-gold hover:underline"
              >
                {process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@cutiefy.com'}
              </a>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes checkmark {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        svg path {
          stroke-dasharray: 100;
          animation: checkmark 0.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}