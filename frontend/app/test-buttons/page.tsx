'use client'

import { useState } from 'react'

export default function TestButtonsPage() {
  const [clickCount, setClickCount] = useState(0)
  const [message, setMessage] = useState('')

  const handleClick = () => {
    setClickCount(prev => prev + 1)
    setMessage(`Button clicked ${clickCount + 1} times!`)
    console.log('Button clicked!')
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('Form submitted!')
    console.log('Form submitted!')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Button Test Page</h1>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Simple Button Test</h2>
            <button
              onClick={handleClick}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Click Me! (Count: {clickCount})
            </button>
            {message && (
              <p className="mt-4 text-green-600">{message}</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Form Test</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Test Input
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type something..."
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit Form
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Admin Test</h2>
            <button
              onClick={() => window.location.href = '/admin'}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors mr-4"
            >
              Go to Admin
            </button>
            <button
              onClick={() => window.location.href = '/admin-test'}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Go to Admin Test
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
