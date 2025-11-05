import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { createBlockchainService, formatEventData } from '../lib/blockchainService'

// Activity types
export interface Activity {
  id: string
  type: 'contribution' | 'withdrawal' | 'join' | 'create' | 'complete' | 'cancel'
  title: string
  description: string
  amount?: string
  poolId?: number
  poolName?: string
  timestamp: number
  transactionHash: string
  status: 'success' | 'pending' | 'failed'
  icon: string
  iconBg: string
  iconColor: string
}

export function useRecentActivities() {
  const { address, isConnected } = useAccount()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if contract is deployed
  const isContractDeployed = process.env.NEXT_PUBLIC_POOL_MANAGER_ADDRESS && 
    process.env.NEXT_PUBLIC_POOL_MANAGER_ADDRESS !== '0x0000000000000000000000000000000000000000'


  // Fetch activities from blockchain events
  useEffect(() => {
    if (!isConnected || !address) {
      setActivities([])
      setLoading(false)
      return
    }

    const fetchActivities = async () => {
      setLoading(true)
      setError(null)

      try {
        const blockchainService = createBlockchainService()
        
        if (!blockchainService) {
          // Contract not deployed, show empty state
          setActivities([])
          return
        }

        // Fetch real blockchain events
        const events = await blockchainService.getUserEvents(address, 10)
        
        // Transform events into activities
        const activitiesFromEvents: Activity[] = events.map((event, index) => {
          const eventData = formatEventData(event)
          const iconData = getActivityIcon(eventData.type)
          
          return {
            id: `event-${event.transactionHash}-${index}`,
            type: eventData.type,
            title: eventData.title,
            description: eventData.description,
            amount: eventData.amount,
            poolId: eventData.poolId,
            poolName: eventData.poolName,
            timestamp: eventData.timestamp,
            transactionHash: eventData.transactionHash,
            status: 'success',
            ...iconData
          }
        })

        setActivities(activitiesFromEvents)
      } catch (err) {
        console.error('Error fetching activities:', err)
        setError('Failed to load recent activities')
        setActivities([]) // Show empty state on error
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [isConnected, address])

  // Helper function to get activity icon and styling
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'contribution':
        return {
          icon: '/recent activities.png',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600'
        }
      case 'withdrawal':
        return {
          icon: '/recent activities.png',
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-600'
        }
      case 'join':
        return {
          icon: '/recent activities.png',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600'
        }
      case 'create':
        return {
          icon: '/recent activities.png',
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600'
        }
      case 'complete':
        return {
          icon: '/recent activities.png',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600'
        }
      case 'cancel':
        return {
          icon: '/recent activities.png',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600'
        }
      default:
        return {
          icon: '/recent activities.png',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600'
        }
    }
  }

  return {
    activities,
    loading,
    error,
    isContractDeployed
  }
}

// Helper function to format timestamp
export function formatActivityDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  } else if (diffInHours < 48) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
}