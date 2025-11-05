'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="text-white py-6 sm:py-8" style={{ backgroundColor: '#005ae2' }}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <Image
              src="/logo_white.png"
              alt="PoolFi Logo"
              width={160}
              height={53}
              className="max-w-full h-auto mb-4 w-40 sm:w-44 md:w-48"
            />
            <div className="flex flex-wrap justify-center md:justify-start space-x-4 sm:space-x-6 mb-4">
              <Link href="#home" className="text-white hover:text-gray-300 transition-colors text-sm sm:text-base">
                Home
              </Link>
              <Link href="#features" className="text-white hover:text-gray-300 transition-colors text-sm sm:text-base">
                Features
              </Link>
              <Link href="#contact" className="text-white hover:text-gray-300 transition-colors text-sm sm:text-base">
                Contact
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Image
              src="/celo_logo.png"
              alt="Celo Logo"
              width={160}
              height={53}
              className="max-w-full h-auto w-40 sm:w-44 md:w-48"
            />
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-4 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-white/80 text-xs sm:text-sm">
                © 2025 PoolFi. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end space-x-3 sm:space-x-4">
              <Link href="#" className="text-white/80 text-xs sm:text-sm hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-white/80 text-xs sm:text-sm hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-white/80 text-xs sm:text-sm hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
