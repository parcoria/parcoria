import { Link } from 'react-router-dom'

export default function Success() {
  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-3">You're all set</h1>
      <p className="text-gray-500 text-sm mb-8 leading-relaxed">
        Your Parcoria project access is confirmed. Your full permit roadmap, AI Concierge, and plan pre-check are ready. Start building smarter.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/wizard"
          className="px-6 py-3 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
        >
          Go to my permit wizard
        </Link>
        <Link
          to="/"
          className="px-6 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:border-gray-300 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
