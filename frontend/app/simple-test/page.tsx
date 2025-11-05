'use client'

export default function SimpleTestPage() {
  const handleClick = () => {
    alert('Button clicked!')
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Test</h1>
      <button 
        onClick={handleClick}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Test Button
      </button>
    </div>
  )
}
