'use client'

interface FundWalletModalProps {
  isOpen: boolean
  onClose: () => void
  onCrypto: () => void
  onFiat: () => void
}

export default function FundWalletModal({ isOpen, onClose, onCrypto, onFiat }: FundWalletModalProps) {
  if (!isOpen) return null

  const options = [
    {
      icon: (
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
      ),
      title: 'Crypto',
      subtitle: 'Deposit Crypto',
      onClick: onCrypto
    },
    {
      icon: (
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      ),
      title: 'Fiat (NGN/USD/EUR)',
      subtitle: 'Create virtual bank accounts',
      onClick: onFiat
    }
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-xs mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Fund Wallet</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        
        <p className="text-gray-600 text-sm mb-6">Choose the asset you want to deposit to your wallet</p>

        <div className="space-y-3">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={option.onClick}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {option.icon}
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{option.title}</div>
                <div className="text-sm text-gray-600">{option.subtitle}</div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
