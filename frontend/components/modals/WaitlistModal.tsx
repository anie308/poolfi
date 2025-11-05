'use client'

import { useState, useEffect } from 'react'

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isDetectingCountry, setIsDetectingCountry] = useState(false)

  // Auto-detect country when modal opens
  useEffect(() => {
    if (isOpen && !formData.country) {
      detectCountry()
    }
  }, [isOpen, formData.country])

  const detectCountry = async () => {
    setIsDetectingCountry(true)
    try {
      // Try to get country from IP geolocation
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()
      
      if (data.country_code) {
        // Map country codes to our option values
        const countryCode = data.country_code.toUpperCase()
        setFormData(prev => ({
          ...prev,
          country: countryCode
        }))
      }
    } catch (error) {
      console.log('Country detection failed, user can select manually')
    } finally {
      setIsDetectingCountry(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          country: formData.country,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist')
      }

      setIsSubmitting(false)
      setIsSubmitted(true)
      
      // Close modal after 2 seconds
      setTimeout(() => {
        handleClose()
      }, 2000)

    } catch (error) {
      console.error('Waitlist signup error:', error)
      setIsSubmitting(false)
      
      // You could add error state handling here
      alert(error instanceof Error ? error.message : 'Failed to join waitlist. Please try again.')
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handleClose = () => {
    // Reset form when closing
    setFormData({ name: '', email: '', country: '' })
    setIsSubmitted(false)
    onClose()
  }

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      style={{ zIndex: 9999 }}
      onClick={handleOverlayClick}
    >
      <div 
        className="rounded-lg p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto"
        style={{ 
          backgroundColor: '#F7F9FC',
          border: '1px solid #AEC2ED'
        }}
      >
        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="text-left mb-6 sm:mb-8">
              <h2 
                className="text-black mb-2"
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 600,
                  fontSize: 'clamp(28px, 8vw, 48px)',
                  lineHeight: 'clamp(36px, 10vw, 80px)',
                  letterSpacing: '-4%'
                }}
              >
                Join the waitlist
              </h2>
              <p 
                className="text-black"
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 600,
                  fontSize: 'clamp(16px, 4vw, 19px)',
                  lineHeight: 'clamp(20px, 5vw, 23px)',
                  letterSpacing: '-2%'
                }}
              >
                Get notified when we launch
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm text-gray-500 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter Your Name"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #AEC2ED',
                    fontFamily: 'Space Grotesk',
                    fontWeight: 400,
                    fontSize: 'clamp(16px, 4vw, 23.25px)',
                    lineHeight: '100%',
                    letterSpacing: '0px',
                    textAlign: 'left'
                  }}
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm text-gray-500 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g janedoerr@mail.com"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #AEC2ED',
                    fontFamily: 'Space Grotesk',
                    fontWeight: 400,
                    fontSize: 'clamp(16px, 4vw, 23.25px)',
                    lineHeight: '100%',
                    letterSpacing: '0px',
                    textAlign: 'left'
                  }}
                  required
                />
              </div>

              {/* Country Field */}
              <div>
                <label htmlFor="country" className="block text-sm text-gray-500 mb-2">
                  Country
                </label>
                <div className="relative">
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black appearance-none"
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #AEC2ED',
                      fontFamily: 'Space Grotesk',
                      fontWeight: 400,
                      fontSize: 'clamp(16px, 4vw, 23.25px)',
                      lineHeight: '100%',
                      letterSpacing: '0px',
                      textAlign: 'left'
                    }}
                    required
                    disabled={isDetectingCountry}
                  >
                    <option value="">
                      {isDetectingCountry ? 'Detecting your location...' : 'Select your country'}
                    </option>
                    <option value="DZ">Algeria</option>
                    <option value="AU">Australia</option>
                    <option value="BW">Botswana</option>
                    <option value="BR">Brazil</option>
                    <option value="CM">Cameroon</option>
                    <option value="CA">Canada</option>
                    <option value="CN">China</option>
                    <option value="CI">Côte d&apos;Ivoire</option>
                    <option value="EG">Egypt</option>
                    <option value="ET">Ethiopia</option>
                    <option value="FR">France</option>
                    <option value="DE">Germany</option>
                    <option value="GH">Ghana</option>
                    <option value="IN">India</option>
                    <option value="IT">Italy</option>
                    <option value="JP">Japan</option>
                    <option value="KE">Kenya</option>
                    <option value="MG">Madagascar</option>
                    <option value="MW">Malawi</option>
                    <option value="MU">Mauritius</option>
                    <option value="MA">Morocco</option>
                    <option value="MZ">Mozambique</option>
                    <option value="NA">Namibia</option>
                    <option value="NG">Nigeria</option>
                    <option value="RW">Rwanda</option>
                    <option value="SN">Senegal</option>
                    <option value="SC">Seychelles</option>
                    <option value="ZA">South Africa</option>
                    <option value="ES">Spain</option>
                    <option value="TZ">Tanzania</option>
                    <option value="TN">Tunisia</option>
                    <option value="UG">Uganda</option>
                    <option value="GB">United Kingdom</option>
                    <option value="US">United States</option>
                    <option value="ZM">Zambia</option>
                    <option value="ZW">Zimbabwe</option>
                    <option value="Other">Other</option>
                  </select>
                  {/* Dropdown arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white font-bold py-2.5 sm:py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </>
        ) : (
          /* Success Message */
          <div className="text-center py-6 sm:py-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-black mb-2">Thank you!</h3>
            <p className="text-gray-600 text-sm sm:text-base px-2">You&apos;ve been added to our waitlist. We&apos;ll notify you when we launch!</p>
          </div>
        )}
      </div>
    </div>
  )
}
