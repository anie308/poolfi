'use client'

import { useState } from 'react'

interface WaitlistUser {
  id: string
  name: string
  email: string
  country?: string | null
  ipAddress?: string | null
  userAgent?: string | null
  createdAt: Date
  updatedAt: Date
}

interface AdminData {
  success: boolean
  data: WaitlistUser[]
  count: number
  message?: string
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [waitlistData, setWaitlistData] = useState<WaitlistUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/waitlist', {
        headers: {
          'x-admin-password': password
        }
      })

      if (response.ok) {
        const data: AdminData = await response.json()
        
        // Convert date strings to Date objects
        const processedData = data.data.map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt)
        }))
        
        setWaitlistData(processedData)
        setIsAuthenticated(true)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Authentication failed')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Failed to authenticate. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString()
  }

  const getCountryFlag = (country: string | null | undefined) => {
    if (!country) return '🌍'
    // Simple flag mapping for common countries
    const flags: { [key: string]: string } = {
      'US': '🇺🇸', 'UK': '🇬🇧', 'CA': '🇨🇦', 'AU': '🇦🇺',
      'DE': '🇩🇪', 'FR': '🇫🇷', 'ES': '🇪🇸', 'IT': '🇮🇹',
      'JP': '🇯🇵', 'KR': '🇰🇷', 'CN': '🇨🇳', 'IN': '🇮🇳',
      'BR': '🇧🇷', 'MX': '🇲🇽', 'AR': '🇦🇷', 'NG': '🇳🇬',
      'ZA': '🇿🇦', 'EG': '🇪🇬', 'KE': '🇰🇪', 'GH': '🇬🇭'
    }
    return flags[country.toUpperCase()] || '🌍'
  }


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="text-center mb-6">
            <img 
              src="/logo.png" 
              alt="PoolFi Logo" 
              className="h-10 sm:h-12 w-auto mx-auto mb-4"
            />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              PoolFi Admin
            </h1>
            <p className="text-gray-600 text-sm">
              Access the waitlist dashboard
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                placeholder="Enter admin password"
                required
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-base"
            >
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <img 
                  src="/logo.png" 
                  alt="PoolFi Logo" 
                  className="h-8 sm:h-10 w-auto"
                />
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                    PoolFi Waitlist Dashboard
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Real-time user registration data
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-sm text-gray-500">
                  Total Users: {waitlistData.length}
                </div>
                <div className="text-xs text-gray-400">
                  Last updated: {new Date().toLocaleTimeString()} (v2.1)
                </div>
              </div>
            </div>
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {waitlistData.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <span className="mr-2">
                          {getCountryFlag(user.country)}
                        </span>
                        {user.country || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.ipAddress || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {user.userAgent || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            <div className="space-y-4 p-4">
              {waitlistData.map((user, index) => (
                <div key={user.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="mr-1">{getCountryFlag(user.country)}</span>
                      <span className="text-gray-600">{user.country || 'Unknown'}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-medium text-gray-700">IP:</span>
                      <span className="ml-1 text-gray-600">{user.ipAddress || 'Unknown'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Created:</span>
                      <span className="ml-1 text-gray-600">{formatDate(user.createdAt)}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-medium text-gray-700">Device:</span>
                      <span className="ml-1 text-gray-600 text-xs break-all">
                        {user.userAgent ? user.userAgent.substring(0, 60) + '...' : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {waitlistData.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No waitlist entries found</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
