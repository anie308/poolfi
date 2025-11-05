export default function Header() {
  return (
    <div className="flex justify-between items-center p-5 bg-white">
      <div className="flex items-center">
        <img
          src="/logo.png"
          alt="PoolFi Logo"
            width={80}
            height={80}
          className="rounded-lg"
          onError={(e) => {
            console.error('Logo failed to load:', e);
            // Fallback to text logo if image fails
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      <button className="text-2xl text-gray-500">≡</button>
    </div>
  )
}
