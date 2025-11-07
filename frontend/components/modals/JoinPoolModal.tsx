'use client'

import { useState, useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { formatUnits } from 'viem'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { usePool, useContribute, useApproveToken, useTokenAllowance } from '@/hooks/usePoolManager'
import { USDC_DECIMALS } from '@/lib/contracts/contractConfig'
import toast from 'react-hot-toast'

interface JoinPoolModalProps {
  isOpen: boolean
  onClose: () => void
  poolCode?: string // Optional pool code from URL (pool ID)
}

export default function JoinPoolModal({ isOpen, onClose, poolCode }: JoinPoolModalProps) {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const [poolIdInput, setPoolIdInput] = useState('')
  const [parsedPoolId, setParsedPoolId] = useState<number | null>(null)
  const [pendingContribution, setPendingContribution] = useState(false)
  const { contribute, isLoading: isContributing, isSuccess } = useContribute()
  const { approveToken, isLoading: isApproving, isSuccess: isApprovalSuccess } = useApproveToken()
  const { allowance } = useTokenAllowance()
  const hasTriggeredContribution = useRef(false)

  // Parse pool code from URL or input
  useEffect(() => {
    if (poolCode) {
      // Extract pool ID from URL format: "pool/join/123" or just "123"
      const match = poolCode.match(/(\d+)/)
      if (match) {
        const id = parseInt(match[1])
        setParsedPoolId(id)
        setPoolIdInput(id.toString())
      }
    }
  }, [poolCode])

  // Fetch pool data if we have a valid pool ID
  const { pool, loading: poolLoading } = usePool(parsedPoolId || 0)

  // Handle successful contribution
  useEffect(() => {
    if (isSuccess && parsedPoolId) {
      toast.success('Successfully joined the pool!')
      // Redirect to pool page
      setTimeout(() => {
        router.push(`/pool/${parsedPoolId}`)
        onClose()
      }, 1500)
    }
  }, [isSuccess, parsedPoolId, router, onClose])

  // Handle successful approval - automatically contribute
  useEffect(() => {
    if (isApprovalSuccess && parsedPoolId && pool && pendingContribution && !hasTriggeredContribution.current) {
      hasTriggeredContribution.current = true
      
      // Wait for allowance to update, then verify and contribute
      const checkAndContribute = () => {
        const requiredAmount = pool.contributionAmount
        const currentAllowance = allowance || BigInt(0)
        
        if (currentAllowance >= requiredAmount) {
          contribute(parsedPoolId, BigInt(0))
          toast.success('Approval successful! Contributing to pool...')
          setPendingContribution(false)
        } else {
          // Allowance not updated yet, check again in 500ms
          setTimeout(checkAndContribute, 500)
        }
      }
      
      // Start checking after a short delay
      setTimeout(checkAndContribute, 1000)
    }
  }, [isApprovalSuccess, parsedPoolId, pool, pendingContribution, contribute, allowance])

  // Reset contribution trigger when approval starts
  useEffect(() => {
    if (isApproving) {
      hasTriggeredContribution.current = false
    }
  }, [isApproving])

  // Reset pending contribution on success
  useEffect(() => {
    if (isSuccess) {
      setPendingContribution(false)
      hasTriggeredContribution.current = false
    }
  }, [isSuccess])

  const parsePoolId = (input: string): number | null => {
    // Try to extract pool ID from various formats:
    // - "123" (just the ID)
    // - "pool/join/123" (full URL path)
    // - "pool/join/123/" (with trailing slash)
    const match = input.trim().match(/(\d+)/)
    if (match) {
      const id = parseInt(match[1])
      return id > 0 ? id : null
    }
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPoolIdInput(value)
    const id = parsePoolId(value)
    setParsedPoolId(id)
  }

  const handleJoinPool = () => {
    if (!isConnected) {
      // This will be handled by ConnectButton
      return
    }

    if (!parsedPoolId) {
      toast.error('Please enter a valid pool ID')
      return
    }

    if (!pool) {
      toast.error('Pool not found. Please check the pool ID.')
      return
    }

    if (pool.isCompleted) {
      toast.error('This pool is already completed')
      return
    }

    if (pool.isRefundable) {
      toast.error('This pool has failed and is refundable')
      return
    }

    if (!pool.isActive) {
      toast.error('This pool is not active')
      return
    }

    if (pool.hasContributed) {
      toast.error('You have already contributed to this pool')
      return
    }

    if (pool.currentMembers >= pool.maxMembers) {
      toast.error('This pool is full')
      return
    }

    // Check if user needs to approve tokens
    const requiredAmount = pool.contributionAmount
    const currentAllowance = allowance || BigInt(0)

    if (currentAllowance < requiredAmount) {
      // Approve first - approve 2x for buffer
      setPendingContribution(true)
      approveToken(requiredAmount * BigInt(2))
      toast.success('Please approve the transaction in your wallet')
      return
    }

    // Contribute directly if already approved
    contribute(parsedPoolId, BigInt(0))
    toast.success('Please confirm the transaction in your wallet')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    handleJoinPool()
  }

  if (!isOpen) return null

  const formatAmount = (amount: bigint) => {
    return parseFloat(formatUnits(amount, USDC_DECIMALS)).toFixed(2)
  }

  const needsApproval = pool ? (allowance < pool.contributionAmount) : false

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Join a Pool</h2>
          <button
            onClick={onClose}
              className="text-2xl text-gray-500 hover:text-gray-700 transition-colors"
          >
            ×
          </button>
        </div>
        
          {!isConnected && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Please connect your wallet to join a pool
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Pool ID or Invite Link
            </label>
            <input
              type="text"
                placeholder="Enter pool ID (e.g., 1) or link (e.g., pool/join/1)"
                value={poolIdInput}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {parsedPoolId && (
                <p className="mt-1 text-xs text-gray-500">
                  Pool ID: {parsedPoolId}
                </p>
              )}
          </div>

            {/* Pool Information */}
            {poolLoading && parsedPoolId && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Loading pool information...</p>
              </div>
            )}

            {pool && !poolLoading && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                <h3 className="font-semibold text-gray-900">{pool.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contribution Amount:</span>
                    <span className="font-medium text-gray-900">
                      {formatAmount(pool.contributionAmount)} USDC
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Members:</span>
                    <span className="font-medium text-gray-900">
                      {pool.currentMembers} / {pool.maxMembers}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Progress:</span>
                    <span className="font-medium text-gray-900">
                      {pool.progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      pool.isActive ? 'text-green-600' : 
                      pool.isCompleted ? 'text-blue-600' : 
                      'text-red-600'
                    }`}>
                      {pool.isCompleted ? 'Completed' : 
                       pool.isRefundable ? 'Failed' : 
                       pool.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {parsedPoolId && !pool && !poolLoading && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  Pool not found. Please check the pool ID.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                disabled={isContributing || isApproving}
              >
                Cancel
              </button>
              <ConnectButton.Custom>
                {({ openConnectModal, account }) => {
                  const canJoin = isConnected && 
                    parsedPoolId && 
                    pool && 
                    !poolLoading && 
                    !isContributing && 
                    !isApproving &&
                    !pool.hasContributed &&
                    pool.isActive &&
                    !pool.isCompleted &&
                    !pool.isRefundable &&
                    pool.currentMembers < pool.maxMembers

                  if (!account) {
                    return (
                      <button
                        type="button"
                        onClick={openConnectModal}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Connect Wallet
                      </button>
                    )
                  }

                  return (
                    <button
                      type="button"
                      onClick={handleJoinPool}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!canJoin}
                    >
                      {isApproving 
                        ? 'Approving...' 
                        : needsApproval 
                          ? 'Approve & Join' 
                          : isContributing 
                            ? 'Joining...' 
                            : 'Join Pool'}
                    </button>
                  )
                }}
              </ConnectButton.Custom>
            </div>
        </form>
        </div>
      </div>
    </div>
  )
}
