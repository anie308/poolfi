'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import PageHeader from '@/components/PageHeader'

export default function PoolDetailPage() {
  const params = useParams()
  const router = useRouter()
  const poolId = params.id

  const [showInviteModal, setShowInviteModal] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const poolData = {
    id: poolId,
    name: 'Growth Circle',
    totalMembers: 8,
    contributionAmount: 100
  }

  const members = [
    { id: 1, name: 'John Doe', role: 'Admin', status: 'Active', avatar: 'JD' },
    { id: 2, name: 'Jane Smith', role: 'Member', status: 'Active', avatar: 'JS' },
    { id: 3, name: 'Mike Johnson', role: 'Member', status: 'Pending', avatar: 'MJ' },
    { id: 4, name: 'Sarah Wilson', role: 'Member', status: 'Active', avatar: 'SW' }
  ]

  const activities = [
    { id: 1, type: 'contribution', user: 'John Doe', amount: '$100', date: '2 hours ago' },
    { id: 2, type: 'joined', user: 'Mike Johnson', amount: null, date: '1 day ago' },
    { id: 3, type: 'payout', user: 'Jane Smith', amount: '$800', date: '3 days ago' },
    { id: 4, type: 'contribution', user: 'Sarah Wilson', amount: '$100', date: '1 week ago' }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#eff6ff' }}>
      <div className="max-w-sm mx-auto min-h-screen">
        <PageHeader />
        
        <div className="px-5">
          <button 
            onClick={() => router.back()}
            className="text-2xl text-gray-500 mt-1"
          >
            ‹
          </button>
        </div>

        <div className="mx-5 mt-5">
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <div>
                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-2">
                  <img
                    src="/pool profile.png"
                    alt="Pool Profile"
                    className="w-24 h-24 rounded-full object-cover"
                    onError={(e) => {
                      console.error('Pool profile image failed to load:', e);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <h2 className="font-semibold text-gray-900 mb-1 text-center whitespace-nowrap" style={{ fontSize: '16px' }}>{poolData.name}</h2>
              </div>
              <div className="flex items-center gap-6 -mt-2">
                <div className="flex flex-col text-center">
                  <div className="font-medium text-gray-900" style={{ fontSize: '24px' }}>
                    {poolData.totalMembers}
                  </div>
                  <div className="font-medium text-gray-600" style={{ fontSize: '12px' }}>
                    members
                  </div>
                </div>
                <div className="flex flex-col text-center">
                  <div className="font-medium text-gray-900" style={{ fontSize: '24px' }}>
                    ${poolData.contributionAmount}
                  </div>
                  <div className="font-medium text-gray-600" style={{ fontSize: '12px' }}>
                    contribution
                  </div>
                </div>
                <div className="flex flex-col text-center">
                  <div className="font-medium text-gray-900" style={{ fontSize: '24px' }}>
                    {poolData.totalMembers}
                  </div>
                  <div className="font-medium text-gray-600" style={{ fontSize: '12px' }}>
                    payouts
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mx-5 mt-6">
          <div 
            className="rounded-xl p-4"
            style={{
              backgroundColor: '#ffffff'
            }}
          >
            <div className="text-center font-medium text-gray-900 mb-4" style={{ fontSize: '16px' }}>
              Next payout
            </div>
            <div 
              className="rounded-xl p-4 text-center text-white"
              style={{
                backgroundColor: '#4264e5',
                border: '4px solid #aec2ed'
              }}
            >
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div>
                  <div className="font-semibold">2</div>
                  <div className="text-xs opacity-90">Months</div>
                </div>
                <div>
                  <div className="font-semibold">15</div>
                  <div className="text-xs opacity-90">Days</div>
                </div>
                <div>
                  <div className="font-semibold">8</div>
                  <div className="text-xs opacity-90">Hours</div>
                </div>
                <div>
                  <div className="font-semibold">32</div>
                  <div className="text-xs opacity-90">Minutes</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-5 mt-6">
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-3 px-4 text-center font-medium border-b-2 ${
                activeTab === 'overview' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent'
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('members')}
              className={`flex-1 py-3 px-4 text-center font-medium border-b-2 ${
                activeTab === 'members' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent'
              }`}
            >
              Members
            </button>
            <button 
              onClick={() => setActiveTab('activities')}
              className={`flex-1 py-3 px-4 text-center font-medium border-b-2 ${
                activeTab === 'activities' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent'
              }`}
            >
              Activities
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="mx-5 mt-4">
            <div 
              className="rounded-xl p-4"
              style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #d9e3f6'
              }}
            >
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Pool Admin</h3>
                  <p className="text-sm text-gray-600">You</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Pool Description</h3>
                  <p className="text-sm text-gray-600">Plant Now, Harvest Later</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Pool Info</h3>
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Contribution</span>
                      <span className="text-sm font-medium text-gray-900">$100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Payout Frequency:</span>
                      <span className="text-sm font-medium text-gray-900">Monthly</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Next Payout:</span>
                      <span className="text-sm font-medium text-gray-900">October 1, 2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="mx-5 mt-4">
            <div 
              className="rounded-xl p-4"
              style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #d9e3f6'
              }}
            >
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{member.avatar}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-600">{member.role}</div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      member.status === 'Active' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {member.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="mx-5 mt-4">
            <div 
              className="rounded-xl p-4"
              style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #d9e3f6'
              }}
            >
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'contribution' ? 'bg-blue-100' :
                        activity.type === 'joined' ? 'bg-green-100' : 'bg-purple-100'
                      }`}>
                        <span className={`text-xs ${
                          activity.type === 'contribution' ? 'text-blue-600' :
                          activity.type === 'joined' ? 'text-green-600' : 'text-purple-600'
                        }`}>
                          {activity.type === 'contribution' ? '💵' :
                           activity.type === 'joined' ? '👤' : '💰'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {activity.type === 'contribution' && `${activity.user} contributed`}
                          {activity.type === 'joined' && `${activity.user} joined the pool`}
                          {activity.type === 'payout' && `${activity.user} received payout`}
                        </div>
                        <div className="text-sm text-gray-600">{activity.date}</div>
                      </div>
                    </div>
                    {activity.amount && (
                      <div className="font-medium text-gray-900">{activity.amount}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-xl w-full max-w-sm">
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Invite Members</h3>
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="text-2xl text-gray-500"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invite Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={`pool/join/${poolId}`}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    />
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">
                      Copy
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

