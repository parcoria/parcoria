import { Link } from 'react-router-dom'
import { t } from '../lib/i18n'
import { LogoMark } from './Logo'

const FOOTER_LINKS = {
  Product: [
    { label: 'Permit Wizard', to: '/wizard' },
    { label: 'Sample Roadmap', to: '/sample' },
    { label: 'Plan Pre-Check', to: '/pre-check' },
    { label: 'Find Contractors', to: '/directory' },
    { label: 'Pricing', to: '/pricing' },
  ],
  Learn: [
    { label: 'Learning Center', to: '/learn' },
    { label: 'What is a building permit?', to: '/learn/what-is-a-building-permit' },
    { label: 'Lien agent guide', to: '/learn/what-is-a-lien-agent-nc' },
    { label: 'Owner-builder in NC', to: '/learn/owner-builder-nc' },
  ],
  Jurisdictions: [
    { label: 'Raleigh', to: '/wizard' },
    { label: 'Durham', to: '/wizard' },
    { label: 'Chapel Hill', to: '/wizard' },
    { label: 'Apex · Holly Springs', to: '/wizard' },
    { label: 'Wake Forest · Morrisville · Garner', to: '/wizard' },
  ],
  Company: [
    { label: 'Contact', href: 'mailto:support@parcoria.com' },
    { label: 'Developer support', href: 'mailto:developer@parcoria.com' },
    { label: 'Restore access', to: '/restore' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* Top row - brand + columns */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-gray-900 mb-3">
              <LogoMark size={24} />
              <span className="font-semibold text-sm">Parcoria</span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              Permit intelligence for the Research Triangle. Know exactly what to build, in the right order, before you spend a dollar on construction.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{group === 'Product' ? t('footer_product') : group === 'Learn' ? t('footer_learn') : group === 'Jurisdictions' ? t('footer_jurs') : t('footer_company')}</div>
              <div className="flex flex-col gap-2">
                {links.map((link, i) => (
                  link.href
                    ? <a key={i} href={link.href} className="text-xs text-gray-400 hover:text-gray-700 transition-colors leading-relaxed">{link.label}</a>
                    : <Link key={i} to={link.to} className="text-xs text-gray-400 hover:text-gray-700 transition-colors leading-relaxed">{link.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-400">
            © 2026 Parcoria · Research Triangle, NC · Est. 2026
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">
              Covering Raleigh · Durham · Chapel Hill · Apex · Holly Springs · Wake Forest · Morrisville · Garner · Fuquay-Varina · Cary
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
