'use client'

import { useState } from 'react'

interface SendCryptoAmountModalProps {
  isOpen: boolean
  onClose: () => void
  address: string
  onSend: (amount: number) => void
}

export default function SendCryptoAmountModal({ isOpen, onClose, address, onSend }: SendCryptoAmountModalProps) {
  const [amount, setAmount] = useState('')
  const availableBalance = 12000

  const handlePercentage = (percentage: number) => {
    const calculatedAmount = (availableBalance * percentage / 100).toFixed(0)
    setAmount(calculatedAmount)
  }

  const handleSend = () => {
    const numAmount = parseFloat(amount)
    if (numAmount > 0 && numAmount <= availableBalance) {
      onSend(numAmount)
    } else {
      alert('Please enter a valid amount')
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-xs mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Sending to {address.slice(0, 8)}...</h2>
            <p className="text-gray-600 text-sm">Destination Address</p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-600 mb-2">Available Balance</div>
            <div className="text-2xl font-semibold text-gray-900">${availableBalance.toLocaleString()}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount to send
            </label>
            <input
              type="text"
              placeholder="$ 0"
              value={amount ? `$ ${parseInt(amount).toLocaleString()}` : ''}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '')
                setAmount(value)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handlePercentage(25)}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              25%
            </button>
            <button
              onClick={() => handlePercentage(50)}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              50%
            </button>
            <button
              onClick={() => handlePercentage(100)}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              100%
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSend}
            className="btn-primary flex-1"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
