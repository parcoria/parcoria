import { useState, useEffect } from 'react'
import { getParcelFloodData } from '../lib/parcelIntelligence'

const FLOOD_RISK_STYLES = {
  high:     { bg: 'bg-red-50 border-red-100', icon: '🔴', text: 'text-red-800', sub: 'text-red-700' },
  moderate: { bg: 'bg-amber-50 border-amber-100', icon: '🟡', text: 'text-amber-800', sub: 'text-amber-700' },
  minimal:  { bg: 'bg-green-50 border-green-100', icon: '🟢', text: 'text-green-800', sub: 'text-green-700' },
  unknown:  { bg: 'bg-gray-50 border-gray-200', icon: '⚪', text: 'text-gray-700', sub: 'text-gray-500' },
}

export default function BuildabilityChecker({ address, jurisdiction, flags, onFloodDetected }) {
  const [floodStatus, setFloodStatus] = useState('loading') // loading | success | failed | skipped
  const [floodResult, setFloodResult] = useState(null)

  useEffect(() => {
    if (!address || address.trim().length < 10) {
      setFloodStatus('skipped')
      return
    }
    runFloodCheck()
  }, [address])

  async function runFloodCheck() {
    setFloodStatus('loading')
    const result = await getParcelFloodData(address)
    setFloodResult(result)
    setFloodStatus(['success'].includes(result.status) ? 'success' : result.status === 'dev_cors' ? 'dev' : 'failed')

    // Notify parent if high risk detected
    if (result.status === 'success' && result.classification?.risk === 'high') {
      onFloodDetected && onFloodDetected(true, result)
    } else {
      onFloodDetected && onFloodDetected(false, result)
    }
  }


  // Use custom checks if provided (Chapel Hill, Apex, Holly Springs)
  // Otherwise build checks based on jurisdiction
  const isRaleigh = jurisdiction === 'raleigh' || !jurisdiction
  const isDurhamJur = jurisdiction === 'durham'
  const isApexJur = jurisdiction === 'apex'
  const isHSJur = jurisdiction === 'hollysprings'

  function getJurisdictionLabel() {
    if (isDurhamJur) return 'Durham'
    if (isApexJur) return 'Apex'
    if (isHSJur) return 'Holly Springs'
    return 'Raleigh'
  }

  function getInspectionNote() {
    if (isDurhamJur) return 'Durham City-County Building & Safety handles all inspections — same department as permits.'
    if (isApexJur || isHSJur) return 'Wake County performs all field inspections.'
    return 'Wake County performs all field inspections — separate from city permit applications.'
  }

  function getPortalNote() {
    if (isDurhamJur) return 'Building permits → Dplans portal. Trade permits, fees & inspections → LDO portal. Both accounts required.'
    if (isApexJur) return 'Submit plans via IDT Plans portal. Pay fees via ePermits portal. Permit not active until fees are paid in ePermits.'
    if (isHSJur) return 'Single CityView Portal for applications, payments, inspections, and status tracking.'
    return 'All permits through City of Raleigh permit portal. Inspections via Wake County.'
  }

  // Build checks array
  const checks = [
    {
      ok: true,
      title: isDurhamJur ? 'Durham City-County jurisdiction confirmed' : `${getJurisdictionLabel()} jurisdiction confirmed`,
      desc: `${getPortalNote()}`,
      source: 'system',
    },
    {
      ok: true,
      title: isDurhamJur ? 'Dual portal system — Dplans + LDO' : `${getJurisdictionLabel()} inspection district`,
      desc: getInspectionNote(),
      source: 'system',
    },
    {
      ok: !flags.historic,
      title: flags.historic ? 'Historic district overlay — flagged by you' : 'No historic district overlay reported',
      desc: flags.historic
        ? `${getJurisdictionLabel()} historic district commission approval required before building permit submission. Verify your district at the ${getJurisdictionLabel()} planning department — adds 4–8 weeks.`
        : `You indicated no historic district. Verify with ${getJurisdictionLabel()} planning before submitting.`,
      source: 'user_reported',
      verifyUrl: isDurhamJur ? 'https://www.durhamnc.gov/292/Planning'
        : isApexJur ? 'https://www.apexnc.org/215/Applications-Schedules'
        : isHSJur ? 'https://www.hollyspringsnc.gov'
        : 'https://raleighnc.gov/planning/services/historic-preservation',
      verifyLabel: `Verify historic district — ${getJurisdictionLabel()}`,
    },
    {
      ok: !flags.septic,
      title: flags.septic ? 'Private well/septic — flagged by you' : 'City water & sewer reported',
      desc: flags.septic
        ? `${isDurhamJur ? 'Durham County Environmental Health (919) 560-7600' : 'Wake County Environmental Services'} must approve septic/well design before the city accepts your permit application.`
        : `You indicated city utilities. Confirm availability with ${isDurhamJur ? 'Durham One Call at (919) 560-1200' : isHSJur ? 'Holly Springs Public Utilities at (919) 557-2591' : isApexJur ? 'Apex Utilities' : 'Raleigh Water at water.review@raleighnc.gov'} before applying.`,
      source: 'user_reported',
    },
    {
      ok: !flags.corner,
      title: flags.corner ? 'Corner lot — flagged by you' : 'Standard lot configuration reported',
      desc: flags.corner
        ? `Corner lots in ${getJurisdictionLabel()} have setback requirements on both street frontages. Verify exact setback distances with your licensed surveyor.`
        : `You indicated a standard lot. Confirm setbacks for your zoning district in ${getJurisdictionLabel()} UDO.`,
      source: 'user_reported',
    },
  ]

  // Overall verdict
  const hasWarnings = checks.some(c => !c.ok) ||
    (floodStatus === 'success' && floodResult?.classification?.risk === 'high') ||
    (floodStatus === 'success' && floodResult?.classification?.risk === 'moderate')

  return (
    <div>
      {/* Verdict banner */}
      <div className={`flex gap-3 items-start rounded-xl p-4 mb-5 ${hasWarnings ? 'bg-amber-50 border border-amber-100' : 'bg-green-50 border border-green-100'}`}>
        <span className="text-lg">{hasWarnings ? '⚠️' : '✅'}</span>
        <div>
          <div className={`text-sm font-semibold ${hasWarnings ? 'text-amber-800' : 'text-green-800'}`}>
            {hasWarnings ? 'Buildable with conditions' : 'No major parcel blockers detected'}
          </div>
          <div className={`text-xs mt-1 ${hasWarnings ? 'text-amber-700' : 'text-green-700'}`}>
            {hasWarnings
              ? 'Review flagged items below before submitting any permit applications.'
              : 'Continue to select your project type. Always verify conditions with your local municipality before submitting.'}
          </div>
        </div>
      </div>

      {/* FEMA Flood Zone — Live Check */}
      <div className="mb-1">
        <div className="flex gap-3 items-start py-3 border-b border-gray-100">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs
            ${floodStatus === 'loading' || floodStatus === 'dev' ? 'bg-gray-100 text-gray-400'
            : floodStatus === 'success' && floodResult?.classification?.risk === 'high' ? 'bg-red-100 text-red-700'
            : floodStatus === 'success' && floodResult?.classification?.risk === 'moderate' ? 'bg-amber-100 text-amber-700'
            : floodStatus === 'success' ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-400'}`}>
            {floodStatus === 'loading' ? (
              <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            ) : floodStatus === 'success' && floodResult?.classification?.risk === 'minimal' ? '✓'
            : floodStatus === 'success' ? '!' : '?'}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
              FEMA flood zone check
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-100 font-medium">
                Live data
              </span>
            </div>

            {floodStatus === 'loading' && (
              <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                Checking FEMA National Flood Hazard Layer for {address}...
              </div>
            )}

            {floodStatus === 'success' && floodResult?.classification && (() => {
              const cls = floodResult.classification
              const style = FLOOD_RISK_STYLES[cls.risk] || FLOOD_RISK_STYLES.unknown
              return (
                <div className={`mt-2 rounded-lg border p-3 ${style.bg}`}>
                  <div className={`text-xs font-semibold mb-1 ${style.text}`}>
                    {style.icon} {cls.label} — Zone {cls.zone}
                  </div>
                  <div className={`text-xs leading-relaxed ${style.sub}`}>{cls.desc}</div>
                  {floodResult.matchedAddress && (
                    <div className="text-xs text-gray-400 mt-1.5">
                      Matched address: {floodResult.matchedAddress}
                    </div>
                  )}
                  {cls.requiresElevationCert && (
                    <div className="mt-2 text-xs font-semibold text-red-700">
                      ⚠️ FEMA elevation certificate required before permits can be issued.
                    </div>
                  )}
                  <a
                    href={`https://msc.fema.gov/portal/search#searchresultsanchor`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-brand-600 hover:text-brand-700 mt-2 inline-block"
                  >
                    View official FEMA flood map ↗
                  </a>
                </div>
              )
            })()}

            {floodStatus === 'failed' && (
              <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
                <div className="text-xs font-semibold text-blue-800 mb-1">Manual verification required</div>
                <div className="text-xs text-blue-700 leading-relaxed mb-2">
                  Live FEMA lookup is being moved to our secure server connection. In the meantime, verify your flood zone directly — it takes under 60 seconds.
                </div>
                <ol className="text-xs text-blue-700 space-y-1 list-decimal pl-4 mb-2">
                  <li>Go to <strong>msc.fema.gov</strong></li>
                  <li>Enter your property address</li>
                  <li>Look for your flood zone — Zone X is minimal risk, Zone A or AE means high risk and an elevation certificate is required</li>
                </ol>
                <a
                  href="https://msc.fema.gov/portal/search"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1"
                >
                  Open FEMA flood map ↗
                </a>
              </div>
            )}

            {floodStatus === 'dev' && (
              <div className="mt-2 bg-gray-50 rounded-lg p-3 text-xs text-gray-500 leading-relaxed">
                Live FEMA flood data is active on <strong>parcoria.com</strong>. Local dev environment uses direct API calls which are blocked by CORS. Push to Vercel to test live flood detection.
              </div>
            )}

            {floodStatus === 'skipped' && (
              <div className="text-xs text-gray-400 mt-0.5">
                Enter a full address on the previous step to enable live flood zone detection.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User-reported checks */}
      {checks.map((c, i) => (
        <div key={i} className="flex gap-3 items-start py-3 border-b border-gray-100 last:border-none">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs ${c.ok ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            {c.ok ? '✓' : '!'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-sm font-medium text-gray-800">{c.title}</div>
              {c.source === 'user_reported' && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">Self-reported</span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{c.desc}</div>
            {c.verifyUrl && (
              <a href={c.verifyUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-600 hover:text-brand-700 mt-1 inline-block">
                {c.verifyLabel} ↗
              </a>
            )}
          </div>
        </div>
      ))}

      {/* Disclaimer */}
      <div className="mt-4 bg-gray-50 rounded-lg px-4 py-3 text-xs text-gray-400 leading-relaxed">
        <strong className="text-gray-500">Data sources:</strong> Flood zone data from FEMA National Flood Hazard Layer via ArcGIS REST API. Historic district, septic, and corner lot status are self-reported by the user. Always verify all parcel conditions with your local municipality and licensed professionals before submitting permit applications.
      </div>
    </div>
  )
}
