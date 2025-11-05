'use client'

import Image from 'next/image'

interface HeroProps {
  onGetStarted: () => void
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <section 
      className="py-16 sm:py-24 md:py-32 text-center relative overflow-hidden"
      style={{ 
        backgroundColor: '#f7f9fc',
        backgroundImage: `
          linear-gradient(#e6ebf6 1px, transparent 1px),
          linear-gradient(90deg, #e6ebf6 1px, transparent 1px)
        `,
        backgroundSize: '150px 80px'
      }}
    >
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="inline-block mb-6">
          <span 
            className="text-xs font-medium px-3 py-1 rounded-full"
            style={{ backgroundColor: '#e5ecfb', color: '#000000' }}
          >
            Welcome to PoolFi
          </span>
        </div>
        
        <div className="flex items-start justify-center gap-1 sm:gap-2 mb-6">
          <div className="flex-shrink-0 hidden sm:block">
            <Image
              src="/hero_top_right.png"
              alt="Hero Top Right"
              width={60}
              height={45}
              className="rounded-lg sm:w-16 sm:h-12 md:w-20 md:h-15"
            />
          </div>
          <div className="flex-1 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight sm:leading-relaxed text-gray-800">
              Save Together <span className="text-blue-600">
                <br />
              Grow Together</span>
            </h1>
          </div>
          <div className="flex-shrink-0 hidden sm:block">
            <Image
              src="/hero_top_left.png"
              alt="Hero Top Left"
              width={60}
              height={45}
              className="rounded-lg sm:w-16 sm:h-12 md:w-20 md:h-15"
            />
          </div>
        </div>
        <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4" style={{ color: '#000000' }}>
          Join Trusted Digital Collective savings Pools (Ajo/Esusu) with friends, family and communities.
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>Built on Celo Chain for fast, transparent and secure transactions.
        </p>
        <div className="flex justify-center">
          <button 
            onClick={onGetStarted}
            className="bg-blue-600 text-white px-6 lg:px-8 py-2.5 lg:py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold text-base lg:text-lg flex items-center gap-2"
          >
            Get Started
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="mt-8 sm:mt-12">
          {/* Main Hero Illustration with Side Images */}
          <div className="flex items-center justify-center gap-1 sm:gap-3 mb-6">
            <div className="flex-shrink-0 hidden sm:block">
              <Image
                src="/hero_botton_left.png"
                alt="Hero Bottom Left"
                width={60}
                height={45}
                className="rounded-lg sm:w-16 sm:h-12 md:w-20 md:h-15"
              />
            </div>
            <div className="flex-1 flex justify-center px-2 sm:px-0">
              <Image
                src="/Hero_illustration.png"
                alt="PoolFi Hero Illustration"
                width={700}
                height={448}
                className="max-w-full h-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
              />
            </div>
            <div className="flex-shrink-0 hidden sm:block">
              <Image
                src="/hero_bottom_right.png"
                alt="Hero Bottom Right"
                width={60}
                height={45}
                className="rounded-lg sm:w-16 sm:h-12 md:w-20 md:h-15"
              />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
