'use client'

import { useState } from 'react'

interface InviteMembersModalProps {
  isOpen: boolean
  onClose: () => void
  poolName: string
}

export default function InviteMembersModal({ isOpen, onClose, poolName }: InviteMembersModalProps) {
  const [inviteLink] = useState('pool/join/FSE7N3')

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '/' + inviteLink)
    alert('Link copied to clipboard!')
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-xs mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Invite Members</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">Add members to your pool</p>

        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="font-bold text-gray-900 mb-2">&quot;{poolName}&quot; is Ready!</div>
          <div className="text-sm text-gray-600">Wish to onboard Poolers?</div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invite with a link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-3">
          <button
            onClick={onClose}
            className="btn-primary flex-1"
          >
            Done!
          </button>
        </div>
      </div>
    </div>
  )
}
