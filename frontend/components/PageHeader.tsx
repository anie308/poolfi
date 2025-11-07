'use client'

import { useAccount, useDisconnect } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import toast from 'react-hot-toast'

interface PageHeaderProps {
  title?: string
  onMenuClick?: () => void
}

export default function PageHeader({ title, onMenuClick }: PageHeaderProps) {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const formatAddress = (addr: string) => {
    if (!addr) return 'Not Connected'
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Address copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy: ', err)
      toast.error('Failed to copy address')
    }
  }

  return (
    <div className="flex justify-between items-center p-4 md:p-6 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2 md:gap-3">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick}
          className="md:hidden w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <img
            src="/logo.png"
            alt="PoolFi Logo"
            className="w-6 h-6 md:w-8 md:h-8 rounded"
            onError={(e) => {
              console.error('Logo failed to load:', e);
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">PoolFi Dashboard</h1>
        {title && (
          <h2 className="hidden md:block ml-4 text-xl font-semibold text-gray-600">{title}</h2>
        )}
      </div>
      
      {/* Wallet Controls - Flexed to the right */}
      <div className="flex items-center gap-2 md:gap-3">
        <ConnectButton.Custom>
          {({ openConnectModal, account, chain, openChainModal }) => {
            if (!account) {
              return (
                <button
                  onClick={openConnectModal}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm md:text-base font-semibold hover:bg-blue-700 transition-colors"
                >
                  Connect Wallet
                </button>
              )
            }

            if (chain?.unsupported) {
              return (
                <button
                  onClick={openChainModal}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm md:text-base font-semibold hover:bg-red-700 transition-colors"
                >
                  Wrong Network
                </button>
              )
            }

            return (
              <div className="flex items-center gap-2 md:gap-3">
                {/* Wallet Address */}
                <button
                  onClick={() => copyToClipboard(account.address)}
                  className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm md:text-base font-medium transition-colors font-mono"
                  title="Click to copy address"
                >
                  {formatAddress(account.address)}
                </button>
                
                {/* Disconnect Button */}
                <button
                  onClick={() => {
                    disconnect()
                    toast.success('Wallet disconnected')
                  }}
                  className="px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-sm md:text-base font-semibold transition-colors border border-red-200"
                >
                  Disconnect
                </button>
              </div>
            )
          }}
        </ConnectButton.Custom>
      </div>
    </div>
  )
}
