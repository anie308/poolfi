'use client'

import Image from 'next/image'

interface WhyPoolFiProps {
  onGetStarted: () => void
}

export default function WhyPoolFi({ onGetStarted }: WhyPoolFiProps) {
  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Why PoolFi */}
        <div className="flex justify-center mb-8">
          <span 
            className="text-xs font-medium px-3 py-1 rounded-full"
            style={{ backgroundColor: '#e5ecfb', color: '#000000' }}
          >
            Why PoolFi
          </span>
        </div>
        
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-black px-4">
            What does PoolFi offer
          </h2>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Left side - Features List */}
          <div className="flex-1 space-y-6 sm:space-y-8 order-2 lg:order-1">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <Image
                  src="/why_1.png"
                  alt="Secure & Transparent"
                  width={50}
                  height={50}
                  className="rounded-lg w-12 h-12 sm:w-14 sm:h-14"
                />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                  Secure & Transparent
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  BlockChain ensures no tampering or
                  <br className="hidden sm:block" />
                  <span className="sm:hidden"> </span>hidden fees
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <Image
                  src="/why_2.png"
                  alt="Low Fees"
                  width={50}
                  height={50}
                  className="rounded-lg w-12 h-12 sm:w-14 sm:h-14"
                />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                  Low Fees
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Keep more of your money in the circle
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <Image
                  src="/why_3.png"
                  alt="Automated Payout"
                  width={50}
                  height={50}
                  className="rounded-lg w-12 h-12 sm:w-14 sm:h-14"
                />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                  Automated Payout
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Smart contracts handles who gets paid,
                  <br className="hidden sm:block" />
                  <span className="sm:hidden"> </span>when
                </p>
              </div>
            </div>
            
            {/* Get Started Button */}
            <div className="pt-2 sm:pt-4 flex justify-center lg:justify-start">
              <button 
                onClick={onGetStarted}
                className="bg-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold text-base sm:text-lg flex items-center gap-2"
              >
                Get Started
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Right side - Phone Image */}
          <div className="flex-shrink-0 order-1 lg:order-2">
            <Image
              src="/why_phone.png"
              alt="PoolFi Mobile App"
              width={500}
              height={667}
              className="max-w-full h-auto w-64 sm:w-80 md:w-96 lg:w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
