import { useState, useEffect } from 'react'
import { getParcelFloodData } from '../lib/parcelIntelligence'

const FLOOD_RISK_STYLES = {
  high:     { bg: 'bg-red-50 border-red-100',    icon: '🔴', text: 'text-red-800',    sub: 'text-red-700' },
  moderate: { bg: 'bg-amber-50 border-amber-100', icon: '🟡', text: 'text-amber-800', sub: 'text-amber-700' },
  minimal:  { bg: 'bg-green-50 border-green-100', icon: '🟢', text: 'text-green-800', sub: 'text-green-700' },
  unmapped: { bg: 'bg-gray-50 border-gray-200',   icon: '⚪', text: 'text-gray-700',  sub: 'text-gray-500' },
  unknown:  { bg: 'bg-gray-50 border-gray-200',   icon: '⚪', text: 'text-gray-700',  sub: 'text-gray-500' },
}

// All jurisdiction metadata in one place
const JUR = {
  raleigh:     { label: 'Raleigh',      portal: 'All permits through City of Raleigh permit portal. Inspections via Wake County.',                                                                           inspections: 'Wake County performs all field inspections.',                                                                                   utilities: 'Raleigh Water at water.review@raleighnc.gov', historicUrl: 'https://raleighnc.gov/planning/services/historic-preservation' },
  durham:      { label: 'Durham',       portal: 'Building permits → Dplans portal. Trade permits, fees & inspections → LDO portal. Both accounts required.',                                                inspections: 'Durham City-County Building & Safety handles all inspections - same department as permits.',                                       utilities: 'Durham One Call at (919) 560-1200',           historicUrl: 'https://www.durhamnc.gov/292/Planning' },
  chapelhill:  { label: 'Chapel Hill',  portal: 'All permits through Online Permit Center (OpenGov). OWASA handles all water and sewer connections.',                                                       inspections: 'Wake County performs all field inspections.',                                                                                   utilities: 'OWASA at (919) 968-4421',                     historicUrl: 'https://www.townofchapelhill.org/government/departments-services/planning-and-zoning-permit-applications' },
  apex:        { label: 'Apex',         portal: 'Submit plans via IDT Plans portal. Pay fees via ePermits portal. Permit not active until fees are paid.',                                                  inspections: 'Wake County performs all field inspections. Schedule by 2 PM day before via IDT Plans portal.',                                  utilities: 'Apex Utilities',                              historicUrl: 'https://www.apexnc.org/215/Applications-Schedules' },
  hollysprings:{ label: 'Holly Springs',portal: 'Single CityView Portal for applications, payments, inspections, and status tracking. Obtain Progress Energy premise number early.',                      inspections: 'Wake County performs all field inspections. Request before 4 PM = next day; after 4 PM = second business day.',                  utilities: 'Holly Springs Public Utilities at (919) 557-2591', historicUrl: 'https://www.hollyspringsnc.gov' },
  wakeforest:  { label: 'Wake Forest',  portal: 'All permit applications through IDT Plans portal at wakeforest.idtplans.com. Same system as Apex, different town account.',                               inspections: 'Wake County performs all field inspections. Request before 3 PM via IDT Plans portal for next business day.',                    utilities: 'Wake Forest Public Works',                    historicUrl: 'https://www.wakeforestnc.gov/planning' },
  morrisville: { label: 'Morrisville',  portal: 'All permits through CSS (Customer Self Service) Portal. No phone inspection requests accepted - online portal only.',                                     inspections: 'Wake County performs all field inspections. All inspection requests through CSS Portal - no phone requests accepted.',            utilities: 'Morrisville Public Works at (919) 463-6200', historicUrl: 'https://www.morrisvillenc.gov/government/departments-services/planning' },
  garner:      { label: 'Garner',       portal: 'All permits through SmartGov Permit & Inspection Portal. No paper applications or plan sets accepted - digital only.',                                    inspections: 'Garner Inspections Department performs its own field inspections (NOT Wake County). 24-hour notice required. No same-day inspections.', utilities: 'Garner Public Works at (919) 773-4433',   historicUrl: 'https://www.garnernc.gov/departments/planning' },
}

function getJur(jurisdiction) {
  return JUR[jurisdiction] || JUR.raleigh
}

export default function BuildabilityChecker({ address, jurisdiction, flags, onFloodDetected }) {
  const [floodStatus, setFloodStatus] = useState('loading')
  const [floodResult, setFloodResult] = useState(null)

  useEffect(() => {
    if (!address || address.trim().length < 5) {
      setFloodStatus('skipped')
      return
    }
    runFloodCheck()
  }, [address])

  async function runFloodCheck() {
    setFloodStatus('loading')
    const result = await getParcelFloodData(address)
    setFloodResult(result)
    if (result.status === 'success') {
      setFloodStatus('success')
      if (result.classification?.risk === 'high') {
        onFloodDetected && onFloodDetected(true, result)
      } else {
        onFloodDetected && onFloodDetected(false, result)
      }
    } else if (result.status === 'dev_cors') {
      setFloodStatus('dev')
    } else {
      setFloodStatus('failed')
    }
  }

  const jur = getJur(jurisdiction)

  const checks = [
    {
      ok: true,
      title: `${jur.label} jurisdiction confirmed`,
      desc: jur.portal,
      source: 'system',
    },
    {
      ok: true,
      title: `${jur.label} inspection district`,
      desc: jur.inspections,
      source: 'system',
    },
    {
      ok: !flags.historic,
      title: flags.historic ? 'Historic district overlay - flagged by you' : 'No historic district reported',
      desc: flags.historic
        ? `${jur.label} historic district commission approval required before building permit submission - adds 4–8 weeks.`
        : `You indicated no historic district. Verify with ${jur.label} planning before submitting.`,
      source: 'user_reported',
      verifyUrl: jur.historicUrl,
      verifyLabel: `Verify historic district - ${jur.label}`,
    },
    {
      ok: !flags.septic,
      title: flags.septic ? 'Private well/septic - county approval needed' : 'City utilities reported',
      desc: flags.septic
        ? `${jurisdiction === 'durham' ? 'Durham County Environmental Health (919) 560-7600' : jurisdiction === 'chapelhill' ? 'Orange County Environmental Health (919) 245-2360' : 'Wake County Environmental Services (919) 856-7400'} must approve before ${jur.label} accepts your permit application.`
        : `Confirm utility availability with ${jur.utilities} before applying.`,
      source: 'user_reported',
    },
    {
      ok: !flags.corner,
      title: flags.corner ? 'Corner lot - dual setbacks apply' : 'Standard lot reported',
      desc: flags.corner
        ? `Corner lots in ${jur.label} have setback requirements on both street frontages. Verify with your licensed surveyor.`
        : `Confirm setbacks for your zoning district in ${jur.label} UDO before finalizing plans.`,
      source: 'user_reported',
    },
  ]

  const hasWarnings = checks.some(c => !c.ok) ||
    (floodStatus === 'success' && ['high', 'moderate'].includes(floodResult?.classification?.risk))

  return (
    <div>
      {/* Verdict */}
      <div className={`flex gap-3 items-start rounded-xl p-4 mb-5 ${hasWarnings ? 'bg-amber-50 border border-amber-100' : 'bg-green-50 border border-green-100'}`}>
        <span className="text-lg">{hasWarnings ? '⚠️' : '✅'}</span>
        <div>
          <div className={`text-sm font-semibold ${hasWarnings ? 'text-amber-800' : 'text-green-800'}`}>
            {hasWarnings ? 'Buildable with conditions' : 'No major parcel blockers detected'}
          </div>
          <div className={`text-xs mt-1 ${hasWarnings ? 'text-amber-700' : 'text-green-700'}`}>
            {hasWarnings ? 'Review flagged items below before submitting any permit applications.' : 'Continue to select your project type. Always verify conditions with your local municipality before submitting.'}
          </div>
        </div>
      </div>

      {/* FEMA flood check */}
      <div className="flex gap-3 items-start py-3 border-b border-gray-100">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs ${
          floodStatus === 'loading' ? 'bg-gray-100 text-gray-400' :
          floodStatus === 'success' && floodResult?.classification?.risk === 'high' ? 'bg-red-100 text-red-700' :
          floodStatus === 'success' && floodResult?.classification?.risk === 'moderate' ? 'bg-amber-100 text-amber-700' :
          floodStatus === 'success' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
        }`}>
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
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-100 font-medium">Live data</span>
          </div>

          {floodStatus === 'loading' && (
            <div className="text-xs text-gray-500 mt-0.5">Checking FEMA National Flood Hazard Layer...</div>
          )}

          {floodStatus === 'success' && floodResult?.classification && (() => {
            const cls = floodResult.classification
            const isUnmapped = floodResult.floodData?.source === 'no_data' || floodResult.floodData?.unmapped
            const style = FLOOD_RISK_STYLES[cls.risk] || FLOOD_RISK_STYLES.unknown
            return (
              <div className={`mt-2 rounded-lg border p-3 ${style.bg}`}>
                <div className={`text-xs font-semibold mb-1 ${style.text}`}>
                  {style.icon} {isUnmapped ? 'Parcel not in FEMA flood hazard area' : `${cls.label} - Zone ${cls.zone}`}
                </div>
                <div className={`text-xs leading-relaxed ${style.sub}`}>
                  {isUnmapped ? 'No flood hazard data found in FEMA National Flood Hazard Layer. Verify at msc.fema.gov before submitting permits.' : cls.desc}
                </div>
                {floodResult.matchedAddress && (
                  <div className="text-xs text-gray-400 mt-1.5">Matched: {floodResult.matchedAddress}</div>
                )}
                {cls.requiresElevationCert && (
                  <div className="mt-2 text-xs font-semibold text-red-700">⚠️ FEMA elevation certificate required before permits can be issued.</div>
                )}
                <a href="https://msc.fema.gov/portal/search" target="_blank" rel="noreferrer" className="text-xs text-brand-600 hover:text-brand-700 mt-2 inline-block">View official FEMA flood map ↗</a>
              </div>
            )
          })()}

          {floodStatus === 'dev' && (
            <div className="mt-2 bg-gray-50 rounded-lg p-3 text-xs text-gray-500 leading-relaxed">
              Live FEMA data active on parcoria.com. Run <code className="bg-gray-100 px-1 rounded">vercel dev</code> locally to test flood detection.
            </div>
          )}

          {floodStatus === 'failed' && (
            <div className="mt-2">
              {floodResult?.message?.includes('vercel dev') ? (
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                  <div className="text-xs font-semibold text-amber-800 mb-1">⚠️ Run vercel dev for local FEMA testing</div>
                  <code className="block text-xs bg-amber-100 text-amber-900 px-3 py-2 rounded mb-2 font-mono">vercel dev</code>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <div className="text-xs font-semibold text-blue-800 mb-1">Verify flood zone manually</div>
                  <ol className="text-xs text-blue-700 space-y-1 list-decimal pl-4 mb-2">
                    <li>Go to <strong>msc.fema.gov</strong></li>
                    <li>Enter your property address</li>
                    <li>Zone X = minimal risk · Zone A or AE = high risk, elevation cert required</li>
                  </ol>
                  <a href="https://msc.fema.gov/portal/search" target="_blank" rel="noreferrer" className="text-xs text-brand-600 font-medium">Open FEMA flood map ↗</a>
                </div>
              )}
            </div>
          )}

          {floodStatus === 'skipped' && (
            <div className="text-xs text-gray-400 mt-0.5">Enter a full address to enable live flood zone detection.</div>
          )}
        </div>
      </div>

      {/* Jurisdiction-specific checks */}
      {checks.map((c, i) => (
        <div key={i} className="flex gap-3 items-start py-3 border-b border-gray-100 last:border-none">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs ${c.ok ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            {c.ok ? '✓' : '!'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-sm font-medium text-gray-800">{c.title}</div>
              {c.source === 'user_reported' && !c.ok && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">Self-reported</span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{c.desc}</div>
            {c.verifyUrl && !c.ok && (
              <a href={c.verifyUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-600 hover:text-brand-700 mt-1 inline-block">
                {c.verifyLabel} ↗
              </a>
            )}
          </div>
        </div>
      ))}

      {/* Disclaimer */}
      <div className="mt-4 bg-gray-50 rounded-lg px-4 py-3 text-xs text-gray-400 leading-relaxed">
        <strong className="text-gray-500">Data sources:</strong> Flood zone from FEMA National Flood Hazard Layer via ArcGIS REST API. Jurisdiction portal and inspection notes from official municipal sources. Historic district, septic, and corner lot are self-reported. Always verify with your local municipality before submitting.
      </div>
    </div>
  )
}
