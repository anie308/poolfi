'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface NavbarProps {
  onGetStarted: () => void
}

export default function Navbar({ onGetStarted }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-gray-200" style={{ backgroundColor: '#f7f9fc' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={100}
                height={100}
                className="rounded-lg h-12 w-auto sm:h-16 md:h-20"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Perfectly Centered */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center space-x-12">
              <Link href="#home" className="text-black hover:text-blue-600 px-3 py-2 text-lg font-medium transition-colors">
                Home
              </Link>
              <Link href="#features" className="text-black hover:text-blue-600 px-3 py-2 text-lg font-medium transition-colors">
                Features
              </Link>
              <Link href="#contact" className="text-black hover:text-blue-600 px-3 py-2 text-lg font-medium transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Get Started Button */}
          <div className="hidden md:block ml-auto">
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

          {/* Mobile menu button */}
          <div className="md:hidden ml-auto">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-black focus:outline-none focus:text-black"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 backdrop-blur-md rounded-lg mt-2 border border-gray-200" style={{ backgroundColor: '#f7f9fc' }}>
              <Link 
                href="#home" 
                className="text-black hover:text-blue-600 block px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="#features" 
                className="text-black hover:text-blue-600 block px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="#contact" 
                className="text-black hover:text-blue-600 block px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="px-3 py-2">
                <button 
                  onClick={() => {
                    onGetStarted()
                    setIsMenuOpen(false)
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 w-full font-semibold flex items-center justify-center gap-2"
                >
                  Get Started
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
