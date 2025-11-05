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
      <div className="grid grid-cols-2 gap-6 my-8">
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
          >
            <div className="w-20 h-20 gradient-card rounded-xl flex items-center justify-center text-white text-2xl">
              {button.isImage ? (
                <img 
                  src={button.icon} 
                  alt={button.label} 
                  className="w-12 h-12"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                button.icon
              )}
            </div>
            <span className="text-sm font-medium text-blue-600">{button.label}</span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex justify-center gap-10 my-6">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={button.onClick}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-2xl">
            {button.isImage ? (
              <img 
                src={button.icon} 
                alt={button.label} 
                className="w-12 h-12"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <span className={button.icon === '📤' ? 'text-sky-500' : 'text-blue-600'}>
                {button.icon}
              </span>
            )}
          </div>
          <span className="text-xs text-blue-600 font-medium">{button.label}</span>
        </button>
      ))}
    </div>
  )
}
