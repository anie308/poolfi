'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import JoinPoolModal from '@/components/modals/JoinPoolModal'
import PageHeader from '@/components/PageHeader'

export default function JoinPoolPage() {
  const params = useParams()
  const router = useRouter()
  const poolCode = params.code as string
  const [showModal, setShowModal] = useState(true)

  // Auto-open the modal when page loads
  useEffect(() => {
    setShowModal(true)
  }, [])

  const handleClose = () => {
    setShowModal(false)
    // Redirect to dashboard after closing
    router.push('/app')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />
      <JoinPoolModal 
        isOpen={showModal}
        onClose={handleClose}
        poolCode={poolCode}
      />
    </div>
  )
}

