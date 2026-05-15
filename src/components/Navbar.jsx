import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">P</span>
          </div>
          <span className="font-semibold text-gray-900 text-sm tracking-tight">Parcoria</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm transition-colors ${pathname === '/' ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Home
          </Link>
          <Link
            to="/wizard"
            className={`text-sm transition-colors ${pathname === '/wizard' ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Permit Wizard
          </Link>
          <Link
            to="/wizard"
            className="text-sm bg-brand-600 text-white px-4 py-1.5 rounded-lg hover:bg-brand-700 transition-colors font-medium"
          >
            Get started
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="sm:hidden text-gray-500 hover:text-gray-900"
          onClick={() => setOpen(!open)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3">
          <Link to="/" className="text-sm text-gray-700" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/wizard" className="text-sm text-gray-700" onClick={() => setOpen(false)}>Permit Wizard</Link>
          <Link to="/wizard" className="text-sm bg-brand-600 text-white px-4 py-2 rounded-lg text-center font-medium" onClick={() => setOpen(false)}>
            Get started
          </Link>
        </div>
      )}
    </nav>
  )
}
