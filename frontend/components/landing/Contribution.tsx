'use client'

import Image from 'next/image'

export default function Contribution() {
  return (
    <section className="py-12 sm:py-16 md:py-20" style={{ backgroundColor: '#f7f9fc' }}>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* How PoolFi Operates */}
        <div className="flex justify-center mb-8">
          <span 
            className="text-xs font-medium px-3 py-1 rounded-full"
            style={{ backgroundColor: '#e5ecfb', color: '#000000' }}
          >
            How PoolFi Operates
          </span>
        </div>
        
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 px-4">
            <span className="text-black">From </span>
            <span className="text-white px-2 sm:px-3 py-1 rounded-lg text-sm sm:text-base" style={{ backgroundColor: '#2563eb' }}>Contribution</span>
            <span className="text-black"> to</span>
            <br />
            <span className="text-blue-600">Cashout</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-lg text-left">
              <div className="mb-4 sm:mb-6">
                <Image
                  src="/Contribution_1.png"
                  alt="Contribution 1"
                  width={200}
                  height={150}
                  className="mx-auto w-32 h-24 sm:w-40 sm:h-30 md:w-48 md:h-36"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                Create or Join a Pool
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Form your own trusted savings circle or join an existing one in seconds
              </p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-lg text-left">
              <div className="mb-4 sm:mb-6">
                <Image
                  src="/Contribution_2.png"
                  alt="Contribution 2"
                  width={200}
                  height={150}
                  className="mx-auto w-32 h-24 sm:w-40 sm:h-30 md:w-48 md:h-36"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                Contribute Seamlessly
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Deposit easily with Naira-to-stablecoin conversion, making global finance accessible locally
              </p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-lg text-left">
              <div className="mb-4 sm:mb-6">
                <Image
                  src="/Contribution_3.png"
                  alt="Contribution 3"
                  width={200}
                  height={150}
                  className="mx-auto w-32 h-24 sm:w-40 sm:h-30 md:w-48 md:h-36"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                Automated Payouts
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Smart contracts handle the rotation and payout schedule—no delays, no disputes
              </p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-lg text-left">
              <div className="mb-4 sm:mb-6">
                <Image
                  src="/Contribution_4.png"
                  alt="Contribution 4"
                  width={200}
                  height={150}
                  className="mx-auto w-32 h-24 sm:w-40 sm:h-30 md:w-48 md:h-36"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                Track & Grow
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Monitor your contributions, payouts, and group progress transparently on the dashboard
              </p>
            </div>
        </div>
      </div>
    </section>
  )
}
