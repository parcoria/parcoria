// Parcoria Parcel Intelligence Service
// Production: calls /api/flood Vercel serverless function
// Development: falls back to direct FEMA call with graceful error handling

const IS_DEV = import.meta.env.DEV

async function getFloodDataDev(address) {
  // In dev, call FEMA directly — will likely fail due to CORS
  // but shows the right UI state for testing
  try {
    const params = new URLSearchParams({
      q: address,
      format: 'json',
      limit: '1',
      countrycodes: 'us',
    })
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: { 'User-Agent': 'Parcoria/1.0 (parcoria.com)' },
    })
    if (!geoRes.ok) throw new Error('Geocoding failed')
    const geoData = await geoRes.json()
    if (!geoData || geoData.length === 0) {
      return { status: 'geocode_failed', message: 'Address not found.', floodData: null, classification: null }
    }
    const lat = parseFloat(geoData[0].lat)
    const lng = parseFloat(geoData[0].lon)
    const matchedAddress = geoData[0].display_name

    const femaParams = new URLSearchParams({
      geometry: `${lng},${lat}`,
      geometryType: 'esriGeometryPoint',
      inSR: '4326',
      spatialRel: 'esriSpatialRelIntersects',
      outFields: 'FLD_ZONE,ZONE_SUBTY,SFHA_TF',
      returnGeometry: 'false',
      f: 'json',
    })
    const femaRes = await fetch(`https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28/query?${femaParams}`)
    if (!femaRes.ok) throw new Error('FEMA failed')
    const femaData = await femaRes.json()
    const features = femaData?.features
    const zone = features?.length > 0 ? (features[0].attributes.FLD_ZONE || 'X') : 'X'
    return {
      status: 'success',
      matchedAddress,
      coordinates: { lat, lng },
      floodData: { zone, source: 'fema_nfhl' },
      classification: classifyZone(zone),
    }
  } catch {
    return {
      status: 'dev_cors',
      message: 'Live FEMA data available on parcoria.com — CORS blocks direct calls in local dev.',
      floodData: null,
      classification: null,
    }
  }
}

function classifyZone(zone) {
  if (!zone) return null
  const z = zone.trim().toUpperCase()
  const HIGH = ['A', 'AE', 'AH', 'AO', 'AR', 'A99', 'V', 'VE']
  if (HIGH.some(h => z === h || z.startsWith(h))) {
    return {
      risk: 'high', label: 'High risk flood zone', zone: z,
      requiresElevationCert: true, requiresFloodInsurance: true,
      desc: `Zone ${z} — 1% or greater annual chance of flooding. FEMA elevation certificate required before permits are issued.`,
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
    return { status: 'skipped', message: 'Enter a full address to enable flood zone detection.', floodData: null, classification: null }
  }

  // Development — try direct call, expect CORS failure, show dev message
  if (IS_DEV) {
    return getFloodDataDev(address)
  }

  // Production — call Vercel serverless function at /api/flood
  try {
    const params = new URLSearchParams({ address: address.trim() })
    const res = await fetch(`/api/flood?${params}`)

    // Guard: check content type before parsing
    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      throw new Error('API returned non-JSON response')
    }

    if (!res.ok) {
      throw new Error(`API responded with ${res.status}`)
    }

    return await res.json()
  } catch (err) {
    console.error('Parcel intelligence error:', err)
    return {
      status: 'error',
      message: 'Flood check unavailable. Verify manually at msc.fema.gov.',
      floodData: null,
      classification: null,
    }
  }
}
