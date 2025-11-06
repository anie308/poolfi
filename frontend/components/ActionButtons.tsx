interface ActionButtonsProps {
  onWithdraw: () => void
  onSwap: () => void
  onCreatePool: () => void
  onJoinPool: () => void
  isDesktop?: boolean
}

export default function ActionButtons({ 
  onWithdraw, 
  onSwap, 
  onCreatePool, 
  onJoinPool, 
  isDesktop = false 
}: ActionButtonsProps) {
  const buttons = [
    { icon: '/withdraw.png', label: 'Withdraw', onClick: onWithdraw, isImage: true },
    { icon: '/swap.png', label: 'Swap', onClick: onSwap, isImage: true },
    ...(isDesktop ? [
      { icon: '➕', label: 'Create Pool', onClick: onCreatePool, isImage: false },
      { icon: '👤', label: 'Join Pool', onClick: onJoinPool, isImage: false }
    ] : [])
  ]

  if (isDesktop) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 flex flex-col items-center gap-3 md:gap-4 hover:border-blue-500 hover:shadow-md transition-all duration-200"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl md:text-2xl">
              {button.isImage ? (
                <img 
                  src={button.icon} 
                  alt={button.label} 
                  className="w-8 h-8 md:w-10 md:h-10"
                  style={{ filter: 'brightness(0) invert(1)' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                button.icon
              )}
            </div>
            <span className="text-xs md:text-sm font-semibold text-gray-700 text-center">{button.label}</span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex justify-center gap-8 my-8">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={button.onClick}
          className="flex flex-col items-center gap-3 group"
        >
          <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center text-2xl shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
            {button.isImage ? (
              <img 
                src={button.icon} 
                alt={button.label} 
                className="w-10 h-10"
                style={{ filter: 'brightness(0) invert(1)' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <span className="text-white text-2xl">
                {button.icon}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-700 font-semibold group-hover:text-blue-600 transition-colors">{button.label}</span>
        </button>
      ))}
    </div>
  )
}
