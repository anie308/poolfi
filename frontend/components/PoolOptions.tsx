interface PoolOptionsProps {
  onCreatePool: () => void
  onJoinPool: () => void
}

export default function PoolOptions({ onCreatePool, onJoinPool }: PoolOptionsProps) {
  const options = [
    {
      icon: '/create pool.png',
      title: 'Create Your Own Pool',
      description: 'Form your own group & invite trusted members to your inner Pool',
      onClick: onCreatePool,
      isImage: true
    },
    {
      icon: '/join pool.png',
      title: 'Join an existing Pool',
      description: 'Explore other pools and join existing pools to contribute in seconds',
      onClick: onJoinPool,
      isImage: true
    }
  ]

  return (
    <div className="space-y-4 mx-5">
      {options.map((option, index) => (
        <div
          key={index}
          onClick={option.onClick}
          className="rounded-xl pl-2 pr-5 py-1 cursor-pointer transition-opacity hover:opacity-80"
          style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #d9e3f6'
          }}
        >
                <div className="flex items-center gap-0">
                  <div className="w-20 h-20 bg-blue-50 rounded-lg flex items-center justify-center -ml-2">
                    {option.isImage ? (
                      <img 
                        src={option.icon} 
                        alt={option.title} 
                        className="w-14 h-14"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-xl text-blue-600">{option.icon}</span>
                    )}
                  </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900" style={{ fontSize: '18.92px' }}>
                {option.title}
              </h3>
              <p className="text-gray-600" style={{ fontSize: '9.46px' }}>
                {option.description}
              </p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  )
}
