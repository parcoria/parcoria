import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { isDeveloper } from '../lib/access'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/wizard', label: 'Permit Wizard' },
  { to: '/pre-check', label: 'Plan Pre-Check' },
  { to: '/pricing', label: 'Pricing' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const devUser = isDeveloper()

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">P</span>
          </div>
          <span className="font-semibold text-gray-900 text-sm tracking-tight">Parcoria</span>
        </Link>

        <div className="hidden sm:flex items-center gap-6">
          {NAV_LINKS.map(link => (
            <Link key={link.to} to={link.to}
              className={`text-sm transition-colors ${pathname === link.to ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'}`}>
              {link.label}
            </Link>
          ))}
          {devUser ? (
            <Link to="/dashboard"
              className="text-sm bg-brand-600 text-white px-4 py-1.5 rounded-lg hover:bg-brand-700 transition-colors font-medium flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </Link>
          ) : (
            <Link to="/pricing"
              className="text-sm bg-brand-600 text-white px-4 py-1.5 rounded-lg hover:bg-brand-700 transition-colors font-medium">
              Get started — $79
            </Link>
          )}
        </div>

        <button className="sm:hidden text-gray-500 hover:text-gray-900" onClick={() => setOpen(!open)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3">
          {NAV_LINKS.map(link => (
            <Link key={link.to} to={link.to} className="text-sm text-gray-700" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          {devUser ? (
            <Link to="/dashboard" className="text-sm bg-brand-600 text-white px-4 py-2 rounded-lg text-center font-medium" onClick={() => setOpen(false)}>
              My Dashboard
            </Link>
          ) : (
            <Link to="/pricing" className="text-sm bg-brand-600 text-white px-4 py-2 rounded-lg text-center font-medium" onClick={() => setOpen(false)}>
              Get started — $79
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
