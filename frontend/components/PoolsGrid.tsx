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
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
        <span>Your Pools</span>
        <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs md:text-sm font-semibold">
          {poolCount}
        </span>
      </h2>
      {formattedPools.length === 0 ? (
        <div className="text-center py-8 md:py-12 bg-white rounded-lg border border-gray-200">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-lg bg-blue-100 flex items-center justify-center">
            <svg className="w-8 h-8 md:w-10 md:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-gray-700 font-semibold mb-2 text-sm md:text-base">No pools created yet</p>
          <p className="text-xs md:text-sm text-gray-500">Create your first pool to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {formattedPools.map((pool, index) => (
          <div
            key={index}
            onClick={() => router.push(`/pool/${pool.id}`)}
            className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all duration-200"
          >
            {/* Header with pool name and circular progress */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold" style={{ fontSize: '16px', color: '#141b34' }}>{pool.name}</h3>
                  {pool.isUserCreated && (
                    <span className="text-xs px-2.5 py-1 bg-green-500 text-white rounded-full font-semibold">
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
            <div className="space-y-2.5 mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">Contribute</span>
                <span className="text-xs font-bold text-blue-600">{pool.contributionAmount} CELO/month</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">Target</span>
                <span className="text-xs font-bold text-indigo-600">{pool.targetAmount} CELO</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">Payout Date</span>
                <span className="text-xs font-semibold text-gray-700">{pool.payoutDate}</span>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  )
}
