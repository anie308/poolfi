'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'

interface ConnectWalletModalProps {
  isOpen: boolean
  onClose: () => void
  onWalletConnected: () => void
}

export default function ConnectWalletModal({ isOpen, onClose, onWalletConnected }: ConnectWalletModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-xs w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Connect Your Wallet</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-4">
            Connect your wallet to start using PoolFi and join savings pools with friends and family.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-800 mb-2">Why connect your wallet?</h3>
            <ul className="text-sm text-blue-700 text-left space-y-1">
              <li>• Create and join savings pools</li>
              <li>• Make secure contributions</li>
              <li>• Track your savings progress</li>
              <li>• Receive automated payouts</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading'
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === 'authenticated')

              if (!ready) {
                return null
              }

              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Connect Wallet
                  </button>
                )
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all duration-300 font-semibold"
                  >
                    Wrong network
                  </button>
                )
              }

              return (
                <div className="space-y-3 w-full">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800 mb-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-semibold">Wallet Connected!</span>
                    </div>
                    <p className="text-sm text-green-700">
                      {account.displayName}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onWalletConnected()
                        onClose()
                      }}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold"
                    >
                      Continue to App
                    </button>
                    <button
                      onClick={openAccountModal}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
                    >
                      Account
                    </button>
                  </div>
                </div>
              )
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </div>
  )
}
