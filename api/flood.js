// api/flood.js — Vercel Serverless Function
// Proxies geocoding + FEMA NFHL requests server-side to bypass CORS restrictions
// Deployed automatically by Vercel from /api directory

const NOMINATIM = 'https://nominatim.openstreetmap.org/search'
const FEMA_NFHL = 'https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28/query'

const HIGH_RISK_ZONES = ['A', 'AE', 'AH', 'AO', 'AR', 'A99', 'V', 'VE']
const MODERATE_RISK_ZONES = ['X500']

function classifyFloodZone(zone) {
  if (!zone) return { risk: 'unknown', label: 'Unknown', zone: 'N/A', requiresElevationCert: false, requiresFloodInsurance: false, desc: 'Flood zone data unavailable.' }
  const z = zone.trim().toUpperCase()
  if (HIGH_RISK_ZONES.some(h => z === h || z.startsWith(h))) {
    return {
      risk: 'high',
      label: 'High risk flood zone',
      zone: z,
      requiresElevationCert: true,
      requiresFloodInsurance: true,
      desc: `Zone ${z} — 1% or greater annual chance of flooding (100-year flood zone). FEMA elevation certificate required before permits are issued. Flood insurance mandatory for federally-backed mortgages.`,
    }
  }
  if (z === 'X500' || MODERATE_RISK_ZONES.includes(z)) {
    return {
      risk: 'moderate',
      label: 'Moderate risk flood zone',
      zone: z,
      requiresElevationCert: false,
      requiresFloodInsurance: false,
      desc: `Zone ${z} — 0.2% annual chance of flooding. No elevation certificate required but flood insurance is strongly recommended.`,
    }
  }
  return {
    risk: 'minimal',
    label: 'Minimal flood risk',
    zone: z,
    requiresElevationCert: false,
    requiresFloodInsurance: false,
    desc: `Zone ${z} — Minimal flood hazard. No FEMA elevation certificate required based on current FIRM data.`,
  }
}

async function geocode(address) {
  const params = new URLSearchParams({
    q: address,
    format: 'json',
    limit: '1',
    countrycodes: 'us',
  })
  const res = await fetch(`${NOMINATIM}?${params}`, {
    headers: { 'User-Agent': 'Parcoria/1.0 (parcoria.com)' },
  })
  if (!res.ok) throw new Error('Geocoding failed')
  const data = await res.json()
  if (!data || data.length === 0) return null
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    matchedAddress: data[0].display_name,
  }
}

async function queryFEMA(lat, lng) {
  const params = new URLSearchParams({
    geometry: `${lng},${lat}`,
    geometryType: 'esriGeometryPoint',
    inSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    outFields: 'FLD_ZONE,ZONE_SUBTY,SFHA_TF,DFIRM_ID',
    returnGeometry: 'false',
    f: 'json',
  })
  const res = await fetch(`${FEMA_NFHL}?${params}`)
  if (!res.ok) throw new Error('FEMA query failed')
  const data = await res.json()
  const features = data?.features
  if (!features || features.length === 0) return { zone: 'X', source: 'no_data' }
  const attrs = features[0].attributes
  return {
    zone: attrs.FLD_ZONE || 'X',
    subtype: attrs.ZONE_SUBTY,
    sfha: attrs.SFHA_TF === 'T',
    firmId: attrs.DFIRM_ID,
    source: 'fema_nfhl',
  }
}

export default async function handler(req, res) {
  // CORS headers so browser can call this endpoint
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { address } = req.query
  if (!address) {
    return res.status(400).json({ error: 'Address parameter required' })
  }

  try {
    // Step 1 — Geocode
    const geo = await geocode(address)
    if (!geo) {
      return res.status(200).json({
        status: 'geocode_failed',
        message: 'Could not locate this address. Please verify and try again.',
        floodData: null,
        classification: null,
      })
    }

    // Step 2 — Query FEMA
    const floodData = await queryFEMA(geo.lat, geo.lng)
    if (!floodData) {
      return res.status(200).json({
        status: 'fema_failed',
        message: 'Could not retrieve flood data. Verify manually at msc.fema.gov.',
        matchedAddress: geo.matchedAddress,
        floodData: null,
        classification: null,
      })
    }

    // Step 3 — Classify and return
    const classification = classifyFloodZone(floodData.zone)
    return res.status(200).json({
      status: 'success',
      matchedAddress: geo.matchedAddress,
      coordinates: { lat: geo.lat, lng: geo.lng },
      floodData,
      classification,
    })
  } catch (err) {
    console.error('Flood API error:', err)
    return res.status(200).json({
      status: 'error',
      message: 'Flood check failed. Verify manually at msc.fema.gov.',
      floodData: null,
      classification: null,
    })
  }
}
