'use client'

import { useState } from 'react'

interface JoinPoolModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function JoinPoolModal({ isOpen, onClose }: JoinPoolModalProps) {
  const [inviteLink, setInviteLink] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inviteLink.trim()) {
      console.log('Joining pool with link:', inviteLink)
      alert('Successfully joined the pool!')
      onClose()
    } else {
      alert('Please enter a valid invite link')
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-xs mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Join a Pool</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">Enter an invite link to join a pool</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invite Link
            </label>
            <input
              type="text"
              placeholder="pool.join/FSE7N3"
              value={inviteLink}
              onChange={(e) => setInviteLink(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="flex gap-3 pt-4">
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
              Join Pool
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
