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

  return null
}
