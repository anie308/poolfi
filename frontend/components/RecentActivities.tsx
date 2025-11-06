import { useRecentActivities, formatActivityDate } from '../hooks/useRecentActivities'

export default function RecentActivities() {
  const { activities, loading, error, isContractDeployed } = useRecentActivities()

  if (loading) {
    return (
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Recent Activities</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 py-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-20"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Recent Activities</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <div className="text-center py-6 md:py-8">
          <div className="text-red-600 mb-2">⚠️ {error}</div>
          <div className="text-sm text-gray-500">
            Unable to load activities from blockchain
          </div>
        </div>
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Recent Activities</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <div className="text-center py-6 md:py-8">
          <div className="text-gray-500 mb-2">No recent activities</div>
          <div className="text-sm text-gray-400">
            {isContractDeployed 
              ? 'Your pool activities will appear here' 
              : 'Connect your wallet and join pools to see activities'
            }
          </div>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Recent Activities</h2>
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
      {activities.map((activity, index) => (
        <div key={activity.id}>
          <div className="flex items-center gap-2 md:gap-3 py-3 md:py-4">
            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center flex-shrink-0 ${activity.iconBg}`}>
              <img 
                src={activity.icon} 
                alt="Activity" 
                className="w-8 h-8 md:w-12 md:h-12"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 mb-1 text-sm md:text-base truncate">
                {activity.title}
              </div>
              <div className="text-xs text-gray-600 mb-1 line-clamp-1">
                {activity.description}
              </div>
              <div className="text-xs text-gray-500">
                {formatActivityDate(activity.timestamp)}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              {activity.amount && (
                <div className="text-sm font-semibold text-gray-900 mb-1">
                  {activity.amount}
                </div>
              )}
              <div className={`text-xs px-2 py-1 rounded inline-block ${
                activity.status === 'success' 
                  ? 'bg-green-100 text-green-600' 
                  : activity.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-red-100 text-red-600'
              }`}>
                {activity.status === 'success' ? 'Success' : 
                 activity.status === 'pending' ? 'Pending' : 'Failed'}
              </div>
            </div>
          </div>
          {index < activities.length - 1 && (
            <hr className="border-gray-200" />
          )}
        </div>
      ))}
      </div>
    </div>
  )
}
