'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { formatUnits } from 'viem'
import PageHeader from '@/components/PageHeader'
import { usePool, useContribute, useWithdraw, useRefund, useApproveToken, useTokenAllowance, useMarkPoolAsFailed } from '@/hooks/usePoolManager'
import { USDC_DECIMALS } from '@/lib/contracts/contractConfig'
import toast from 'react-hot-toast'
import InviteMembersModal from '@/components/modals/InviteMembersModal'

export default function PoolDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const poolId = typeof params.id === 'string' ? parseInt(params.id) : 0
  
  const { pool, loading, members, isCreator } = usePool(poolId)
  const { contribute, isLoading: isContributing } = useContribute()
  const { withdraw, isLoading: isWithdrawing } = useWithdraw()
  const { refund, isLoading: isRefunding } = useRefund()
  const { approveToken, isLoading: isApproving } = useApproveToken()
  const { allowance } = useTokenAllowance()
  const { markPoolAsFailed, isLoading: isMarkingFailed } = useMarkPoolAsFailed()

  const [showInviteModal, setShowInviteModal] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRemaining, setTimeRemaining] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null)

  // Calculate time remaining until deadline
  useEffect(() => {
    if (!pool?.deadline) return

    const updateTimeRemaining = () => {
      const now = Math.floor(Date.now() / 1000)
      const remaining = pool.deadline - now

      if (remaining <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const days = Math.floor(remaining / 86400)
      const hours = Math.floor((remaining % 86400) / 3600)
      const minutes = Math.floor((remaining % 3600) / 60)
      const seconds = remaining % 60

      setTimeRemaining({ days, hours, minutes, seconds })
    }

    updateTimeRemaining()
    const interval = setInterval(updateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [pool?.deadline])

  const handleContribute = () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet')
      return
    }

    if (!pool) {
      toast.error('Pool not found')
      return
    }

    // Contribute (approval should already be done if needed)
    contribute(poolId, BigInt(0)) // 0 minAmountOut for USDC
    toast.success('Please confirm the transaction in your wallet')
  }

  const handleWithdraw = () => {
    if (!pool) return
    withdraw(poolId, BigInt(0))
    toast.success('Withdrawal submitted!')
  }

  const handleRefund = () => {
    if (!pool) return
    refund(poolId, BigInt(0))
    toast.success('Refund submitted!')
  }

  const handleMarkAsFailed = () => {
    if (!pool) return
    if (confirm('Are you sure you want to mark this pool as failed? This will enable refunds for all contributors.')) {
      markPoolAsFailed(poolId)
      toast.success('Pool marked as failed')
    }
  }

  const formatAddress = (addr: string) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatAmount = (amount: bigint) => {
    return parseFloat(formatUnits(amount, USDC_DECIMALS)).toFixed(2)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading pool data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!pool) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Pool not found</p>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const progressPercentage = pool?.progress || 0
  const canContribute = pool?.isActive && !pool?.isCompleted && !pool?.isRefundable && !pool?.hasContributed
  const canWithdraw = pool?.isCompleted && pool?.hasContributed
  const canRefund = pool?.isRefundable && pool?.hasContributed
  const needsApproval = pool ? (allowance < pool.contributionAmount) : false

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <PageHeader />
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="text-2xl text-gray-500 hover:text-gray-700 mb-4"
        >
          ‹ Back
        </button>

        {/* Pool Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {pool.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{pool.name}</h1>
                <p className="text-sm text-gray-600">Created by {formatAddress(pool.creator)}</p>
                {isCreator && (
                  <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                    You are the creator
                  </span>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              {canContribute && (
                <>
                  {needsApproval ? (
                    <button
                      onClick={() => {
                        if (!pool) return
                        approveToken(pool.contributionAmount * BigInt(2))
                        toast.success('Please approve the transaction in your wallet')
                      }}
                      disabled={isApproving}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isApproving ? 'Approving...' : 'Approve USDC'}
                    </button>
                  ) : null}
                  <button
                    onClick={handleContribute}
                    disabled={isContributing || needsApproval}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isContributing ? 'Contributing...' : 'Contribute'}
                  </button>
                </>
              )}
              {canWithdraw && (
                <button
                  onClick={handleWithdraw}
                  disabled={isWithdrawing}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
                </button>
              )}
              {canRefund && (
                <button
                  onClick={handleRefund}
                  disabled={isRefunding}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
                >
                  {isRefunding ? 'Processing...' : 'Get Refund'}
                </button>
              )}
              {isCreator && pool.isActive && !pool.isCompleted && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
                >
                  Invite
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Progress Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">Progress</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{progressPercentage}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {formatAmount(pool.currentAmount)} / {formatAmount(pool.targetAmount)} USDC
            </div>
          </div>

          {/* Members Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">Members</div>
            <div className="text-3xl font-bold text-gray-900">
              {pool.currentMembers} / {pool.maxMembers}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {pool.maxMembers - pool.currentMembers} spots remaining
            </div>
          </div>

          {/* Contribution Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">Contribution</div>
            <div className="text-3xl font-bold text-gray-900">
              {formatAmount(pool.contributionAmount)} USDC
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Per member
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">Status</div>
            <div className="text-lg font-bold mb-2">
              {pool.isCompleted ? (
                <span className="text-green-600">Completed</span>
              ) : pool.isRefundable ? (
                <span className="text-orange-600">Failed</span>
              ) : pool.isActive ? (
                <span className="text-blue-600">Active</span>
              ) : (
                <span className="text-gray-600">Inactive</span>
              )}
            </div>
            {pool.hasContributed && (
              <div className="text-xs text-gray-500">
                You contributed: {pool.userContribution} USDC
              </div>
            )}
          </div>
        </div>

        {/* Deadline Card */}
        {timeRemaining && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-sm p-6 mb-6 text-white">
            <div className="text-sm opacity-90 mb-4">Time Remaining</div>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{timeRemaining.days}</div>
                <div className="text-xs opacity-90">Days</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{timeRemaining.hours}</div>
                <div className="text-xs opacity-90">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{timeRemaining.minutes}</div>
                <div className="text-xs opacity-90">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{timeRemaining.seconds}</div>
                <div className="text-xs opacity-90">Seconds</div>
              </div>
            </div>
            {pool.deadline * 1000 < Date.now() && !pool.isCompleted && !pool.isRefundable && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleMarkAsFailed}
                  disabled={isMarkingFailed}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 disabled:opacity-50"
                >
                  {isMarkingFailed ? 'Processing...' : 'Mark Pool as Failed'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-4 px-6 text-center font-medium border-b-2 transition-colors ${
                activeTab === 'overview' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('members')}
              className={`flex-1 py-4 px-6 text-center font-medium border-b-2 transition-colors ${
                activeTab === 'members' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Members ({pool.currentMembers})
            </button>
            <button 
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-4 px-6 text-center font-medium border-b-2 transition-colors ${
                activeTab === 'details' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Details
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Pool Progress */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pool Progress</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-600">Target Amount</span>
                      <span className="text-lg font-bold text-gray-900">{formatAmount(pool.targetAmount)} USDC</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-600">Current Amount</span>
                      <span className="text-lg font-bold text-blue-600">{formatAmount(pool.currentAmount)} USDC</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                      <div 
                        className="bg-blue-600 h-4 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                        style={{ width: `${progressPercentage}%` }}
                      >
                        {progressPercentage > 10 && (
                          <span className="text-xs text-white font-semibold">{progressPercentage}%</span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatAmount(BigInt(pool.targetAmount) - BigInt(pool.currentAmount))} USDC remaining
                    </div>
                  </div>
                </div>

                {/* Your Contribution */}
                {pool.hasContributed && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Contribution</h3>
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {pool.userContribution} USDC
                      </div>
                      <p className="text-sm text-gray-600">
                        You have contributed to this pool
                      </p>
                    </div>
                  </div>
                )}

                {/* Pool Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pool Information</h3>
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pool ID</span>
                      <span className="text-sm font-medium text-gray-900">#{pool.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Creator</span>
                      <span className="text-sm font-medium text-gray-900 font-mono">{formatAddress(pool.creator)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Contribution Amount</span>
                      <span className="text-sm font-medium text-gray-900">{formatAmount(pool.contributionAmount)} USDC</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Max Members</span>
                      <span className="text-sm font-medium text-gray-900">{pool.maxMembers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Deadline</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(pool.deadline * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'members' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pool Members</h3>
                {members.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>No members yet</p>
                    {canContribute && (
                      <p className="text-sm mt-2">Be the first to contribute!</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {members.map((memberAddress, index) => (
                      <div 
                        key={memberAddress} 
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {memberAddress.slice(2, 4).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 font-mono text-sm">
                              {formatAddress(memberAddress)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {memberAddress.toLowerCase() === address?.toLowerCase() ? 'You' : 'Member'}
                              {memberAddress.toLowerCase() === pool.creator.toLowerCase() && ' • Creator'}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatAmount(pool.contributionAmount)} USDC
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pool Status</h3>
                  <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active</span>
                      <span className={`text-sm font-medium ${pool.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                        {pool.isActive ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completed</span>
                      <span className={`text-sm font-medium ${pool.isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                        {pool.isCompleted ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Refundable</span>
                      <span className={`text-sm font-medium ${pool.isRefundable ? 'text-orange-600' : 'text-gray-600'}`}>
                        {pool.isRefundable ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                {pool.hasContributed && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Participation</h3>
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Your Contribution</span>
                          <span className="text-sm font-bold text-blue-600">{pool.userContribution} USDC</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Status</span>
                          <span className="text-sm font-medium text-gray-900">
                            {pool.isCompleted ? 'Eligible for withdrawal' : 'Contributed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <InviteMembersModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        poolId={poolId}
      />
    </div>
  )
}






