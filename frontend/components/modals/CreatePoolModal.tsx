'use client'

import { useState, useEffect } from 'react'
import { useCreatePool } from '@/hooks/usePoolManager'
import toast from 'react-hot-toast'
import PoolDetailsModal from './PoolDetailsModal'
import InviteMembersModal from './InviteMembersModal'

interface CreatePoolModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreatePoolModal({ isOpen, onClose }: CreatePoolModalProps) {
  const [formData, setFormData] = useState({
    mode: 'safe',
    totalPool: '',
    contributionAmount: '',
    contributionInterval: 'monthly',
    memberCount: 8
  })
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [poolDetails, setPoolDetails] = useState({
    poolName: '',
    description: '',
    startDate: '',
    payoutDate: ''
  })

  const { createPool, isLoading, isSuccess, error } = useCreatePool()

  // Handle successful pool creation
  useEffect(() => {
    if (isSuccess) {
      toast.success('Pool created successfully!')
      setShowDetailsModal(false)
      // Show invite modal after a short delay
      setTimeout(() => {
        setShowInviteModal(true)
      }, 500)
    }
  }, [isSuccess])

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(`Failed to create pool: ${error.message}`)
      console.error('Pool creation error:', error)
    }
  }, [error])

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    setShowDetailsModal(true)
  }

  const handleCreatePool = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!poolDetails.poolName) {
      toast.error('Please fill in pool name')
      return
    }

    if (!formData.totalPool || parseFloat(formData.totalPool) <= 0) {
      toast.error('Please enter a valid total pool amount')
      return
    }

    if (!formData.contributionAmount || parseFloat(formData.contributionAmount) <= 0) {
      toast.error('Please enter a valid contribution amount')
      return
    }

    if (parseFloat(formData.contributionAmount) >= parseFloat(formData.totalPool)) {
      toast.error('Contribution amount must be less than total pool amount')
      return
    }

    // Calculate deadline (30 days from now)
    const deadline = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)

    console.log('Attempting to create pool...')
    createPool({
      name: poolDetails.poolName,
      description: poolDetails.description || `Pool created by ${poolDetails.poolName}`,
      targetAmount: formData.totalPool,
      contributionAmount: formData.contributionAmount,
      maxMembers: formData.memberCount,
      deadline: deadline
    })
  }

  const handleClose = () => {
    setShowDetailsModal(false)
    setShowInviteModal(false)
    onClose()
  }

  const handleInviteClose = () => {
    setShowInviteModal(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-xs mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Create a Pool</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">Create your own trusted pool</p>

        <form onSubmit={handleNext} className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose a Mode
            </label>
            <select
              value={formData.mode}
              onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
              className="input-field"
            >
              <option value="safe">Safe Mode</option>
              <option value="balanced">Balanced Mode</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Pool (USDC)
            </label>
            <input
              type="number"
              placeholder="100"
              min="0"
              step="0.01"
              value={formData.totalPool}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  setFormData({ ...formData, totalPool: value });
                }
              }}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contribution Amount (USDC)
            </label>
            <input
              type="number"
              placeholder="10"
              min="0"
              step="0.01"
              value={formData.contributionAmount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  setFormData({ ...formData, contributionAmount: value });
                }
              }}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contribution Interval
            </label>
            <select
              value={formData.contributionInterval}
              onChange={(e) => setFormData({ ...formData, contributionInterval: e.target.value })}
              className="input-field"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-700">
                Number of Members
              </label>
              <span className="text-sm text-primary-600 font-medium">Max: 12</span>
            </div>
            <input
              type="range"
              min="2"
              max="12"
              value={formData.memberCount}
              onChange={(e) => setFormData({ ...formData, memberCount: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-center mt-2 text-sm text-gray-600">
              {formData.memberCount} members
            </div>
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              Next
            </button>
          </div>
        </form>
      </div>
      
      {/* Pool Details Modal */}
      <PoolDetailsModal
        isOpen={showDetailsModal}
        onClose={handleClose}
        poolData={formData}
        poolDetails={poolDetails}
        setPoolDetails={setPoolDetails}
        onSubmit={handleCreatePool}
        isLoading={isLoading}
      />

      {/* Invite Members Modal */}
      <InviteMembersModal
        isOpen={showInviteModal}
        onClose={handleInviteClose}
        poolName={poolDetails.poolName || 'New Pool'}
      />
    </div>
  )
}
