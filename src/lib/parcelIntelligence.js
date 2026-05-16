// Parcoria Parcel Intelligence Service
// Calls /api/flood serverless function for geocoding + FEMA flood zone lookup
// Run locally with: vercel dev (not npm run dev)
// vercel dev serves both Vite frontend AND /api/* serverless functions together

function classifyZone(zone, unmapped) {
  if (unmapped || !zone) {
    return {
      risk: 'unmapped',
      label: 'Not in mapped flood hazard area',
      zone: zone || 'X',
      requiresElevationCert: false,
      requiresFloodInsurance: false,
      desc: 'No flood hazard data found for this parcel in the FEMA National Flood Hazard Layer. This typically means the area is outside a Special Flood Hazard Area or has not yet been mapped. Verify at msc.fema.gov before submitting permits.',
    }
  }
  const z = zone.trim().toUpperCase()
  const HIGH = ['A', 'AE', 'AH', 'AO', 'AR', 'A99', 'V', 'VE']
  if (HIGH.some(h => z === h || z.startsWith(h))) {
    return {
      risk: 'high', label: 'High risk flood zone', zone: z,
      requiresElevationCert: true, requiresFloodInsurance: true,
      desc: `Zone ${z} — 1% or greater annual chance of flooding. FEMA elevation certificate required before permits are issued. Flood insurance mandatory for federally-backed mortgages.`,
    }
  }
  if (z === 'X500') {
    return {
      risk: 'moderate', label: 'Moderate risk flood zone', zone: z,
      requiresElevationCert: false, requiresFloodInsurance: false,
      desc: `Zone ${z} — 0.2% annual chance of flooding. Elevation certificate not required but flood insurance strongly recommended.`,
    }
  }
  return {
    risk: 'minimal', label: 'Minimal flood risk', zone: z,
    requiresElevationCert: false, requiresFloodInsurance: false,
    desc: `Zone ${z} — Minimal flood hazard. No FEMA elevation certificate required based on current FIRM data.`,
  }
}

export async function getParcelFloodData(address) {
  if (!address || address.trim().length < 5) {
    return {
      status: 'skipped',
      message: 'Enter a full address to enable live FEMA flood zone detection.',
      floodData: null,
      classification: null,
    }
  }

  try {
    const params = new URLSearchParams({ address: address.trim() })
    const res = await fetch(`/api/flood?${params}`)

    // Guard against HTML responses — means routing issue or function not running
    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      throw new Error('Flood API not reachable. Are you running "vercel dev" instead of "npm run dev"?')
    }

    const data = await res.json()

    // Ensure classification is built if missing
    if (data.status === 'success' && data.floodData && !data.classification) {
      data.classification = classifyZone(data.floodData.zone, data.floodData.unmapped)
    }

    return data
  } catch (err) {
    console.error('Parcel intelligence error:', err.message)
    return {
      status: 'error',
      message: err.message.includes('vercel dev')
        ? 'Run "vercel dev" instead of "npm run dev" to enable live FEMA flood detection locally.'
        : 'Flood check unavailable. Verify manually at msc.fema.gov.',
      floodData: null,
      classification: null,
    }
  }
}
