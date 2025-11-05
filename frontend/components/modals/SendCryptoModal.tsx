'use client'

import { useState } from 'react'

interface SendCryptoModalProps {
  isOpen: boolean
  onClose: () => void
  onNext: (address: string) => void
}

export default function SendCryptoModal({ isOpen, onClose, onNext }: SendCryptoModalProps) {
  const [address, setAddress] = useState('')

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setAddress(text)
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err)
    }
  }

  const handleNext = () => {
    if (address.trim()) {
      onNext(address.trim())
    } else {
      alert('Please enter a valid address')
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-xs mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Send via Crypto</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">Destination Address</p>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Select or Paste address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <button
              onClick={handlePaste}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
            >
              Paste
            </button>
          </div>
          
          <p className="text-xs text-gray-500">
            For your security, verify the complete address before confirming a withdrawal.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleNext}
            className="btn-primary flex-1"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
