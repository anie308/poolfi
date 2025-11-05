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
  
  // Use real data from smart contract
  const { pools, poolCount, isContractDeployed } = usePoolManager()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#eff6ff' }}>
      <div className="max-w-sm mx-auto min-h-screen">
        {/* Header */}
        <PageHeader />

        {/* Celo Chain Info */}
        <CeloInfo />

        {/* Wallet Card */}
        <WalletCard onFundWallet={() => setShowFundModal(true)} />

        {/* Action Buttons */}
        <ActionButtons 
          onWithdraw={() => setShowWithdrawModal(true)}
          onSwap={() => alert('Swap functionality coming soon!')}
          onCreatePool={() => setShowCreateModal(true)}
          onJoinPool={() => setShowJoinModal(true)}
          isDesktop={false}
        />

        {/* Portfolio Card */}
        <PortfolioCard />

        {/* Pool Options */}
        <PoolOptions 
          onCreatePool={() => setShowCreateModal(true)}
          onJoinPool={() => setShowJoinModal(true)}
        />

        {/* Your Pools */}
        <PoolsGrid />

        {/* Recent Activities */}
        <RecentActivities />
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
