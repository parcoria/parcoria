import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-brand-600 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">P</span>
          </div>
          <span className="text-sm font-medium text-gray-900">Parcoria</span>
          <span className="text-sm text-gray-400">· Raleigh · Durham · Chapel Hill · Apex · Holly Springs · Est. 2026</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">Home</Link>
          <Link to="/wizard" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">Permit Wizard</Link>
          <a href="mailto:hello@parcoria.com" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  )
}
