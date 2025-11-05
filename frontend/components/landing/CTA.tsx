'use client'

interface CTAProps {
  onGetStarted: () => void
}

export default function CTA({ onGetStarted }: CTAProps) {
  return (
    <section className="py-12 sm:py-16 md:py-20 text-center">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-black px-4">
          Ready to Pool
          <br />
          Smarter?
        </h2>
        <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto text-gray-600 px-4">
        Take the leap into stress free savings with friends and family
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
      </div>
    </section>
  )
}
