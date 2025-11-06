'use client'

import { useState } from 'react'
import PageHeader from '@/components/PageHeader'
import WalletCard from '@/components/WalletCard'
import ActionButtons from '@/components/ActionButtons'
import PortfolioCard from '@/components/PortfolioCard'
import PoolOptions from '@/components/PoolOptions'
import PoolsGrid from '@/components/PoolsGrid'
import RecentActivities from '@/components/RecentActivities'
import CreatePoolModal from '@/components/modals/CreatePoolModal'
import JoinPoolModal from '@/components/modals/JoinPoolModal'
import FundWalletModal from '@/components/modals/FundWalletModal'
import WithdrawFundsModal from '@/components/modals/WithdrawFundsModal'
import SendCryptoModal from '@/components/modals/SendCryptoModal'
import SendCryptoAmountModal from '@/components/modals/SendCryptoAmountModal'
import CeloInfo from '@/components/CeloInfo'
import { usePoolManager } from '@/hooks/usePoolManager'

export default function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showFundModal, setShowFundModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showSendCryptoModal, setShowSendCryptoModal] = useState(false)
  const [showSendCryptoAmountModal, setShowSendCryptoAmountModal] = useState(false)
  const [cryptoAddress, setCryptoAddress] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Use real data from smart contract
  const { pools, poolCount, isContractDeployed } = usePoolManager()

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
      <PageHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <aside className={`
          fixed md:static inset-y-0 left-0 z-40
          w-64 bg-white border-r border-gray-200 p-6
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          h-[calc(100vh-80px)] overflow-y-auto
        `}>
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Navigation</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <button
              onClick={() => {
                setShowCreateModal(true)
                setSidebarOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Pool
            </button>

            <button
              onClick={() => {
                setShowJoinModal(true)
                setSidebarOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Join Pool
            </button>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowFundModal(true)
                  setSidebarOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Fund Wallet
              </button>

              <button
                onClick={() => {
                  setShowWithdrawModal(true)
                  setSidebarOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors mt-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Withdraw
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              <WalletCard onFundWallet={() => setShowFundModal(true)} isDesktop={true} />
              <PortfolioCard />
              <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
                <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-2">Total Pools</h3>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">{poolCount}</p>
              </div>
            </div>

        {/* Action Buttons */}
            <div className="mb-6 md:mb-8">
        <ActionButtons 
          onWithdraw={() => setShowWithdrawModal(true)}
          onSwap={() => alert('Swap functionality coming soon!')}
          onCreatePool={() => setShowCreateModal(true)}
          onJoinPool={() => setShowJoinModal(true)}
                isDesktop={true}
              />
            </div>

            {/* Pools Grid */}
            <div className="mb-6 md:mb-8">
        <PoolsGrid />
            </div>

        {/* Recent Activities */}
            <div>
        <RecentActivities />
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <CreatePoolModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      
      <JoinPoolModal 
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
      />

      <FundWalletModal
        isOpen={showFundModal}
        onClose={() => setShowFundModal(false)}
        onCrypto={() => {
          setShowFundModal(false)
          alert('Crypto funding coming soon!')
        }}
        onFiat={() => {
          setShowFundModal(false)
          alert('Fiat funding coming soon!')
        }}
      />

      <WithdrawFundsModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onCrypto={() => {
          setShowWithdrawModal(false)
          setShowSendCryptoModal(true)
        }}
        onFiat={() => {
          setShowWithdrawModal(false)
          alert('Fiat withdrawal coming soon!')
        }}
      />

      <SendCryptoModal
        isOpen={showSendCryptoModal}
        onClose={() => setShowSendCryptoModal(false)}
        onNext={(address) => {
          setCryptoAddress(address)
          setShowSendCryptoModal(false)
          setShowSendCryptoAmountModal(true)
        }}
      />

      <SendCryptoAmountModal
        isOpen={showSendCryptoAmountModal}
        onClose={() => setShowSendCryptoAmountModal(false)}
        address={cryptoAddress}
        onSend={(amount) => {
          alert(`Sending $${amount} to ${cryptoAddress}`)
          setShowSendCryptoAmountModal(false)
        }}
      />
    </div>
  )
}
