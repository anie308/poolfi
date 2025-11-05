'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useBalance, useChainId } from 'wagmi'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { isCeloChain, getCeloChainInfo } from '@/lib/celo-config'

interface WalletCardProps {
  isDesktop?: boolean
  onFundWallet?: () => void
}

export default function WalletCard({ isDesktop = false, onFundWallet }: WalletCardProps) {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { data: balance } = useBalance({
    address: address,
  })
  const [copied, setCopied] = useState(false)
  
  const formatAddress = (addr: string) => {
    if (!addr) return 'Not Connected'
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Address copied to clipboard!', {
        duration: 2000,
        position: 'top-center',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
      toast.error('Failed to copy address', {
        duration: 2000,
        position: 'top-center',
      })
    }
  }

  const formatBalance = (balance: bigint | undefined, decimals: number = 18) => {
    if (!balance) return '0.00'
    const formatted = (Number(balance) / Math.pow(10, decimals)).toFixed(4)
    return formatted
  }

  const getChainInfo = (chainId: number) => {
    if (isCeloChain(chainId)) {
      const celoInfo = getCeloChainInfo(chainId)
      return { 
        name: celoInfo?.name || `Celo Chain ${chainId}`, 
        color: '#FCFF52', 
        isCelo: true,
        isTestnet: celoInfo?.id === 44787 // Celo Alfajores Testnet
      }
    }
    
    switch (chainId) {
      case 1:
        return { name: 'Ethereum', color: '#627EEA', isCelo: false, isTestnet: false }
      case 137:
        return { name: 'Polygon', color: '#8247E5', isCelo: false, isTestnet: false }
      case 10:
        return { name: 'Optimism', color: '#FF0420', isCelo: false, isTestnet: false }
      case 42161:
        return { name: 'Arbitrum', color: '#28A0F0', isCelo: false, isTestnet: false }
      case 8453:
        return { name: 'Base', color: '#0052FF', isCelo: false, isTestnet: false }
      case 11155111:
        return { name: 'Sepolia', color: '#627EEA', isCelo: false, isTestnet: true }
      default:
        return { name: `Chain ${chainId}`, color: '#666666', isCelo: false, isTestnet: false }
    }
  }

  return (
    <div 
      className={`rounded-2xl p-3 text-white ${
        isDesktop ? 'mb-8' : 'mx-5 my-5'
      }`}
      style={{ 
        backgroundColor: '#7daaf0',
        border: '2px solid #005ae2'
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm opacity-90">Pool Wallet</div>
        <div className="flex gap-2">
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
                    className="px-2 py-1 rounded-lg hover:opacity-80 transition-opacity font-semibold"
                    style={{
                      backgroundColor: '#90b7f1',
                      border: '2px solid #005ae2',
                      color: '#005ae2',
                      fontSize: '12px'
                    }}
                  >
                    Connect
                  </button>
                )
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className="px-2 py-1 rounded-lg hover:opacity-80 transition-opacity font-semibold"
                    style={{
                      backgroundColor: '#ff6b6b',
                      border: '2px solid #e53e3e',
                      color: 'white',
                      fontSize: '12px'
                    }}
                  >
                    Wrong Network
                  </button>
                )
              }

              return (
                <div className="flex gap-2">
                  {onFundWallet && (
                    <button 
                      onClick={onFundWallet}
                      className="px-2 py-1 rounded-lg hover:opacity-80 transition-opacity font-semibold"
                      style={{
                        backgroundColor: '#90b7f1',
                        border: '2px solid #005ae2',
                        color: '#005ae2',
                        fontSize: '12px'
                      }}
                    >
                      + Fund
                    </button>
                  )}
                </div>
              )
            }}
          </ConnectButton.Custom>
        </div>
      </div>
      
      <div className="text-2xl font-medium mb-1">
        {isConnected && balance ? (
          <div className="flex items-center gap-2">
            <span>{formatBalance(balance.value)} CELO</span>
          </div>
        ) : (
          '0.00 CELO'
        )}
      </div>
      
      <div className="flex justify-between items-end">
        <div className="text-xs opacity-80 flex items-center gap-2" style={{ fontSize: '10px' }}>
          {isConnected && address ? (
            <>
              <span>Wallet: {formatAddress(address)}</span>
              <button
                onClick={() => copyToClipboard(address)}
                className="hover:opacity-70 transition-opacity"
                title="Copy address"
              >
                {copied ? (
                  <svg className="w-3 h-3" fill="none" stroke="#4ade80" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" stroke="#005ae2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </>
          ) : (
            <span>Connect wallet to view address</span>
          )}
        </div>
        <div className="text-xs opacity-90 text-right">
          {isConnected ? (
            <div className="flex items-center gap-1">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getChainInfo(chainId).color }}
              ></div>
              <span>{getChainInfo(chainId).name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Connect to see balance
            </div>
          )}
        </div>
      </div>
    </div>
  )
}