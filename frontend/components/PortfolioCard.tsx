export default function PortfolioCard() {
  return (
          <div 
            className="rounded-xl p-3 mx-5 mb-4"
            style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #d9e3f6'
            }}
          >
      <div className="flex justify-between items-center">
        <div>
          <div className="font-semibold" style={{ fontSize: '16px', color: '#141B34' }}>My Portfolio</div>
          <div className="font-normal" style={{ fontSize: '12px', color: '#141B34' }}>You earned $490 this week</div>
        </div>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  )
}
