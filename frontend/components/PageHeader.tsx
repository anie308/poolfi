'use client'

import { useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

interface PageHeaderProps {
  title?: string
}

export default function PageHeader({ title }: PageHeaderProps) {
  const [showMenu, setShowMenu] = useState(false)
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const formatAddress = (addr: string) => {
    if (!addr) return 'Not Connected'
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Address copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className="flex justify-between items-center p-5" style={{ backgroundColor: '#eff6ff' }}>
      <div className="flex items-center">
        <img
          src="/logo.png"
          alt="PoolFi Logo"
          width={100}
          height={100}
          className="rounded-lg"
          onError={(e) => {
            console.error('Logo failed to load:', e);
            e.currentTarget.style.display = 'none';
          }}
        />
        {title && (
          <h1 className="ml-4 text-lg font-semibold text-gray-900">{title}</h1>
        )}
      </div>
      
      <div className="relative">
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="text-4xl text-gray-500 hover:text-gray-700"
        >
          ≡
        </button>
        
        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            {isConnected ? (
              <>
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Wallet Connected</p>
                  <p className="text-xs text-gray-500">{formatAddress(address || '')}</p>
                </div>
                <button
                  onClick={() => {
                    copyToClipboard(address || '')
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Copy Address
                </button>
                <button
                  onClick={() => {
                    disconnect()
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  Disconnect Wallet
                </button>
              </>
            ) : (
              <div className="px-4 py-2">
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <button
                      onClick={() => {
                        openConnectModal()
                        setShowMenu(false)
                      }}
                      className="w-full text-left text-sm text-blue-600 hover:bg-gray-50"
                    >
                      Connect Wallet
                    </button>
                  )}
                </ConnectButton.Custom>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
