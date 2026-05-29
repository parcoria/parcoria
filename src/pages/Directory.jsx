import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPublicDirectory, TRADE_TYPES, getLicenseVerifyUrl, getLicenseBoardName } from '../lib/contractors'

const JURISDICTION_LABELS = {
  raleigh: 'Raleigh', durham: 'Durham', chapelhill: 'Chapel Hill',
  apex: 'Apex', hollysprings: 'Holly Springs', wakeforest: 'Wake Forest',
  morrisville: 'Morrisville', garner: 'Garner',
}

const TRADE_ICONS = {
  general: '🏗️', electrical: '⚡', plumbing: '🔧', hvac: '💨',
  structural: '📐', architect: '🏛️', surveyor: '🗺️', pool: '🏊',
  insulation: '🧱', roofing: '🏠', other: '👷',
}

const TRADE_COLORS = {
  general: 'bg-blue-50 text-blue-700 border-blue-100',
  electrical: 'bg-amber-50 text-amber-700 border-amber-100',
  plumbing: 'bg-cyan-50 text-cyan-700 border-cyan-100',
  hvac: 'bg-purple-50 text-purple-700 border-purple-100',
  structural: 'bg-orange-50 text-orange-700 border-orange-100',
  architect: 'bg-rose-50 text-rose-700 border-rose-100',
  surveyor: 'bg-green-50 text-green-700 border-green-100',
  pool: 'bg-sky-50 text-sky-700 border-sky-100',
  insulation: 'bg-stone-50 text-stone-700 border-stone-100',
  roofing: 'bg-red-50 text-red-700 border-red-100',
  other: 'bg-gray-50 text-gray-700 border-gray-100',
}

export default function Directory() {
  const [contractors, setContractors] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterTrade, setFilterTrade] = useState('all')
  const [filterJurisdiction, setFilterJurisdiction] = useState('all')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadDirectory()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterTrade, filterJurisdiction])

  async function loadDirectory() {
    setLoading(true)
    try {
      const data = await getPublicDirectory({
        tradeType: filterTrade,
        jurisdiction: filterJurisdiction,
      })
      setContractors(data)
    } catch (err) {
      setError('Could not load contractor directory.')
    } finally {
      setLoading(false)
    }
  }

  const filtered = contractors.filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    return c.name?.toLowerCase().includes(q) || c.company?.toLowerCase().includes(q)
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 bg-green-50 text-green-700 border border-green-100 rounded-full font-medium mb-4">
          ✓ All listings NC license verified
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">
          Verified Contractor Directory
        </h1>
        <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
          Every contractor in this directory has been license-verified against official NC licensing boards by Parcoria Developer members. Find the right professional for your project.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or company..."
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <select value={filterTrade} onChange={e => setFilterTrade(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
          <option value="all">All trades</option>
          {Object.entries(TRADE_TYPES).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select value={filterJurisdiction} onChange={e => setFilterJurisdiction(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
          <option value="all">All jurisdictions</option>
          {Object.entries(JURISDICTION_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-xs text-red-700 mb-5">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading verified contractors...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
          <div className="text-4xl mb-3">👷</div>
          <div className="text-sm font-semibold text-gray-800 mb-2">No contractors found</div>
          <div className="text-xs text-gray-400 mb-4 leading-relaxed max-w-sm mx-auto">
            {contractors.length === 0
              ? 'The public directory is being built by Parcoria Developer members. Check back soon - or if you\'re a developer, add your trusted contractors.'
              : 'Try adjusting your filters or search term.'}
          </div>
          {(filterTrade !== 'all' || filterJurisdiction !== 'all' || search) && (
            <button
              onClick={() => { setFilterTrade('all'); setFilterJurisdiction('all'); setSearch('') }}
              className="text-xs text-brand-600 hover:text-brand-700"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="text-xs text-gray-400 mb-4">{filtered.length} verified contractor{filtered.length !== 1 ? 's' : ''}</div>
          <div className="space-y-3">
            {filtered.map(c => (
              <div key={c.id} className="bg-white border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 text-2xl">
                    {TRADE_ICONS[c.trade_type] || '👷'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div>
                        <div className="text-base font-semibold text-gray-900">{c.name}</div>
                        {c.company && <div className="text-sm text-gray-500">{c.company}</div>}
                      </div>
                      {c.rating && (
                        <div className="flex-shrink-0 text-right">
                          <div className="text-sm font-semibold text-gray-900">{c.rating}.0</div>
                          <div className="text-xs text-amber-500">{'⭐'.repeat(c.rating)}</div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${TRADE_COLORS[c.trade_type] || TRADE_COLORS.other}`}>
                        {TRADE_ICONS[c.trade_type]} {TRADE_TYPES[c.trade_type]}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full border font-medium bg-green-50 text-green-700 border-green-100">
                        ✓ License verified
                      </span>
                      {c.license_number && (
                        <a
                          href={getLicenseVerifyUrl(c.trade_type)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-brand-600 hover:text-brand-700"
                        >
                          License #{c.license_number} - verify at {getLicenseBoardName(c.trade_type)} ↗
                        </a>
                      )}
                    </div>

                    {c.jurisdictions?.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap">
                        {c.jurisdictions.map(j => (
                          <span key={j} className="text-xs px-2 py-0.5 bg-gray-50 text-gray-500 border border-gray-100 rounded-full">
                            {JURISDICTION_LABELS[j] || j}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* CTA for developers */}
      <div className="mt-10 bg-brand-50 border border-brand-100 rounded-2xl p-6 text-center">
        <div className="text-sm font-semibold text-brand-900 mb-1">Are you a developer or GC?</div>
        <div className="text-xs text-brand-700 mb-4 leading-relaxed">
          Add your trusted contractors to this directory. Developer accounts can add verified contractors to the public listing - helping the whole Triangle community.
        </div>
        <div className="flex items-center justify-center gap-3">
          <Link to="/contractors"
            className="text-xs px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium">
            Manage my contractors ↗
          </Link>
          <Link to="/pricing"
            className="text-xs px-4 py-2 border border-brand-200 text-brand-700 rounded-lg hover:bg-brand-100 transition-colors">
            Get Developer access
          </Link>
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-xs text-gray-400 leading-relaxed">
          All listings verified by Parcoria Developer members against official NC licensing boards. Parcoria does not independently verify credentials - always confirm license status directly at the relevant board before hiring.
        </p>
      </div>
    </div>
  )
}
