'use client'

import { useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

interface PageHeaderProps {
  title?: string
  onMenuClick?: () => void
}

export default function PageHeader({ title, onMenuClick }: PageHeaderProps) {
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
      
      <div className="relative flex items-center gap-2">
        {/* Wallet Connect Button - Mobile */}
        <div className="md:hidden">
          <ConnectButton.Custom>
            {({ openConnectModal, openAccountModal, account }) => {
              if (!account) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold"
                  >
                    Connect
                  </button>
                )
              }
              return (
                <button
                  onClick={openAccountModal}
                  className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold"
                >
                  {formatAddress(account.address)}
                </button>
              )
            }}
          </ConnectButton.Custom>
        </div>

        {/* Desktop Menu Button */}
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="hidden md:flex w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 items-center justify-center transition-all duration-200 hover:shadow-md"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {showMenu && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden">
            {isConnected ? (
              <>
                <div className="px-4 py-3 border-b border-gray-100 bg-blue-50">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Wallet Connected</p>
                  <p className="text-xs text-gray-600 font-mono">{formatAddress(address || '')}</p>
                </div>
                <button
                  onClick={() => {
                    copyToClipboard(address || '')
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Address
                </button>
                <button
                  onClick={() => {
                    disconnect()
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
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
                      className="w-full text-left px-4 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
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
