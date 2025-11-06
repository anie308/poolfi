export default function PortfolioCard() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <div className="min-w-0 flex-1">
          <div className="font-bold text-base md:text-lg text-gray-900 mb-1 truncate">My Portfolio</div>
          <div className="font-medium text-xs md:text-sm text-gray-600 flex items-center gap-2">
            <span className="text-green-600 font-semibold">+$490</span>
            <span className="text-gray-400">this week</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-green-500 flex items-center justify-center">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <svg className="hidden md:block w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  )
}
