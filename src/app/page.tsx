import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cutie-cream via-cutie-pink/30 to-cutie-peach/50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-cutie-gold/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-6xl">
          {/* Logo */}
          <div className="logo-3d cursor-pointer">
            <Image
              src="https://i.ibb.co/Vpk0dCfx/Untitled-design.png"
              alt="Cutiefy Logo"
              width={150}
              height={60}
              className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
          
          {/* Cart Icon */}
          <div className="relative cursor-pointer group">
            <svg 
              className="w-8 h-8 text-cutie-charcoal group-hover:text-cutie-gold transition-colors duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0h9" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-cutie-rose text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              0
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center max-w-6xl">
        <div className="max-w-4xl mx-auto">
          {/* 3D Logo Effect */}
          <div className="logo-3d mb-12 flex justify-center">
            <Image
              src="https://i.ibb.co/Vpk0dCfx/Untitled-design.png"
              alt="Cutiefy Logo"
              width={500}
              height={200}
              className="h-32 md:h-48 w-auto object-contain hover:scale-110 transition-transform duration-500 drop-shadow-2xl"
              priority
            />
          </div>
          
          <h2 className="text-3xl md:text-5xl text-cutie-charcoal mb-8 font-light leading-tight">
            Discover beautiful handcrafted jewelry and unique gifts
          </h2>
          
          {/* Why Choose Us */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="card text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-cutie-gold text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">✨</div>
              <h3 className="font-semibold text-xl mb-3 text-cutie-charcoal">Handcrafted Quality</h3>
              <p className="text-cutie-charcoal/70 leading-relaxed">Each piece is carefully crafted with attention to detail and love</p>
            </div>
            <div className="card text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-cutie-gold text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">💝</div>
              <h3 className="font-semibold text-xl mb-3 text-cutie-charcoal">Unique Designs</h3>
              <p className="text-cutie-charcoal/70 leading-relaxed">Find one-of-a-kind pieces that express your unique personality</p>
            </div>
            <div className="card text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-cutie-gold text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🚚</div>
              <h3 className="font-semibold text-xl mb-3 text-cutie-charcoal">Fast Delivery</h3>
              <p className="text-cutie-charcoal/70 leading-relaxed">Quick and secure shipping directly to your doorstep</p>
            </div>
          </div>
          
          {/* Shop CTA */}
          <Link href="/shop" className="btn-primary inline-block text-xl px-12 py-4 no-underline font-semibold">
            Shop with Cutiefy
          </Link>
        </div>
      </section>

      {/* Founders Section */}
      <section className="bg-white/80 py-20 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-cursive text-center text-cutie-charcoal mb-16">
            Meet Our Founders
          </h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="card text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-32 h-32 bg-gradient-to-br from-cutie-rose to-cutie-peach rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-5xl text-white">👩‍💼</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-cutie-charcoal">Sarah Johnson</h3>
              <p className="text-cutie-gold font-medium mb-4 text-lg">Co-Founder & Creative Director</p>
              <p className="text-cutie-charcoal/70 leading-relaxed">Passionate about bringing unique designs to life with over 10 years of experience in jewelry crafting and design.</p>
            </div>
            <div className="card text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-32 h-32 bg-gradient-to-br from-cutie-rose to-cutie-peach rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <span className="text-5xl text-white">👨‍💼</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-cutie-charcoal">Michael Chen</h3>
              <p className="text-cutie-gold font-medium mb-4 text-lg">Co-Founder & Operations Director</p>
              <p className="text-cutie-charcoal/70 leading-relaxed">Dedicated to ensuring every customer receives exceptional service and the highest quality products.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cutie-charcoal text-cutie-cream py-12">
        <div className="container mx-auto px-4 text-center max-w-6xl">
          <div className="logo-3d mb-6 flex justify-center">
            <Image
              src="https://i.ibb.co/Vpk0dCfx/Untitled-design.png"
              alt="Cutiefy Logo"
              width={200}
              height={80}
              className="h-16 w-auto object-contain hover:scale-105 transition-transform duration-300 brightness-0 invert"
            />
          </div>
          <p className="mb-6 text-lg">Beautiful jewelry and gifts, crafted with love</p>
          <div className="flex justify-center space-x-8 mb-6">
            <a href="#" className="hover:text-cutie-gold transition-colors duration-200 font-medium">Privacy Policy</a>
            <a href="#" className="hover:text-cutie-gold transition-colors duration-200 font-medium">Terms of Service</a>
            <a href="#" className="hover:text-cutie-gold transition-colors duration-200 font-medium">Contact Us</a>
          </div>
          <p className="text-sm text-cutie-cream/70">
            © 2025 Cutiefy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}