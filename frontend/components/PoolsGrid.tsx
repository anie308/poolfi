'use client'

import { useRouter } from 'next/navigation'
import { usePoolManager } from '@/hooks/usePoolManager'

export default function PoolsGrid() {
  const router = useRouter()
  const { pools, poolCount, isContractDeployed } = usePoolManager()
  
  // Format pools for display
  const formatPools = (pools: any[]) => {
    return pools.map(pool => ({
      id: pool.id.toString(),
      name: pool.name,
      participants: `${pool.currentMembers}/${pool.maxMembers}`,
      progress: `${pool.currentMembers}/${pool.maxMembers}`,
      payoutDate: new Date(pool.deadline * 1000).toLocaleDateString('en-GB'),
      isClosed: !pool.isActive,
      isUserCreated: pool.isUserCreated,
      targetAmount: pool.targetAmount,
      contributionAmount: pool.contributionAmount,
      description: pool.description
    }))
  }
  
  const formattedPools = formatPools(pools)

  return (
    <div className="mx-5">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Your Pools ({poolCount})</h2>
      {formattedPools.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No pools created yet</p>
          <p className="text-sm text-gray-400">Create your first pool to get started!</p>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {formattedPools.map((pool, index) => (
          <div
            key={index}
            onClick={() => router.push(`/pool/${pool.id}`)}
            className="rounded-2xl p-4 hover:opacity-80 transition-opacity flex-shrink-0 w-72 cursor-pointer"
            style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #d9e3f6'
            }}
          >
            {/* Header with pool name and circular progress */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold" style={{ fontSize: '16px', color: '#141b34' }}>{pool.name}</h3>
                  {pool.isUserCreated && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      Your Pool
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-2">{pool.description}</p>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-amber-400 rounded-full border-2 border-white shadow-md"></div>
                  <div className="w-8 h-8 bg-emerald-500 rounded-full border-2 border-white shadow-md"></div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
                  <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-600">+{pool.participants.split('/')[0]}</span>
                  </div>
                </div>
              </div>
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-500"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${(5/8) * 100}, 100`}
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">{pool.progress}</span>
                </div>
              </div>
            </div>
            
            {/* Pool details */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold" style={{ fontSize: '8px', color: '#7fd1b9' }}>Contribute</span>
                <span className="font-semibold" style={{ fontSize: '8px', color: '#7fd1b9' }}>{pool.contributionAmount} CELO/month</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-semibold" style={{ fontSize: '8px', color: '#eac382' }}>Target</span>
                <span className="font-semibold" style={{ fontSize: '8px', color: '#eac382' }}>{pool.targetAmount} CELO</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-semibold" style={{ fontSize: '8px', color: '#eac382' }}>Payout Date</span>
                <span className="font-semibold" style={{ fontSize: '8px', color: '#eac382' }}>{pool.payoutDate}</span>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  )
}
