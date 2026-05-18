// api/flood.js — Vercel Serverless Function
// Uses ArcGIS World Geocoding Service (no key required, server-friendly)
// + FEMA NFHL ArcGIS REST API for flood zone data

const ARCGIS_GEOCODE = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates'
const FEMA_NFHL = 'https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28/query'

const HIGH_RISK_ZONES = ['A', 'AE', 'AH', 'AO', 'AR', 'A99', 'V', 'VE']

function classifyFloodZone(zone, unmapped) {
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
  if (z === 'X500') {
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

async function geocodeArcGIS(address) {
  const params = new URLSearchParams({
    SingleLine: address,
    outFields: 'Match_addr,City,Region,Postal',
    f: 'json',
    maxLocations: '1',
    countryCode: 'USA',
    searchExtent: '-85,33,-75,38', // Bounding box for NC/Triangle area
  })
  const url = `${ARCGIS_GEOCODE}?${params}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`ArcGIS geocode failed: ${res.status}`)
  const data = await res.json()
  const candidates = data?.candidates
  if (!candidates || candidates.length === 0) return null
  const best = candidates[0]
  if (best.score < 70) return null // Low confidence match
  return {
    lat: best.location.y,
    lng: best.location.x,
    matchedAddress: best.address,
    score: best.score,
  }
}

async function queryFEMANFHL(lat, lng) {
  const params = new URLSearchParams({
    geometry: `${lng},${lat}`,
    geometryType: 'esriGeometryPoint',
    inSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    outFields: 'FLD_ZONE,ZONE_SUBTY,SFHA_TF,DFIRM_ID',
    returnGeometry: 'false',
    f: 'json',
  })
  const url = `${FEMA_NFHL}?${params}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`FEMA query failed: ${res.status}`)
  const data = await res.json()
  const features = data?.features
  if (!features || features.length === 0) {
    return { zone: 'X', source: 'no_data', unmapped: true }
  }
  const attrs = features[0].attributes
  return {
    zone: attrs.FLD_ZONE || 'X',
    subtype: attrs.ZONE_SUBTY,
    sfha: attrs.SFHA_TF === 'T',
    firmId: attrs.DFIRM_ID,
    source: 'fema_nfhl',
    unmapped: false,
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { address } = req.query
  if (!address) return res.status(400).json({ error: 'Address parameter required' })

  try {
    // Step 1 — Geocode via ArcGIS World Geocoding (server-friendly, no key needed)
    const geo = await geocodeArcGIS(address)
    if (!geo) {
      return res.status(200).json({
        status: 'geocode_failed',
        message: `Could not locate "${address}". Try simplifying — use street number, street name, and city only.`,
        floodData: null,
        classification: null,
      })
    }

    // Step 2 — Query FEMA NFHL
    const floodData = await queryFEMANFHL(geo.lat, geo.lng)
    if (!floodData) {
      return res.status(200).json({
        status: 'fema_failed',
        message: 'Could not retrieve FEMA flood data. Verify manually at msc.fema.gov.',
        matchedAddress: geo.matchedAddress,
        floodData: null,
        classification: null,
      })
    }

    // Step 3 — Classify and return
    const classification = classifyFloodZone(floodData.zone, floodData.unmapped)
    return res.status(200).json({
      status: 'success',
      matchedAddress: geo.matchedAddress,
      geocodeScore: geo.score,
      coordinates: { lat: geo.lat, lng: geo.lng },
      city: geo.city || null,
      floodData,
      classification,
    })
  } catch (err) {
    console.error('Flood API error:', err.message)
    return res.status(200).json({
      status: 'error',
      message: `Flood check failed: ${err.message}. Verify manually at msc.fema.gov.`,
      floodData: null,
      classification: null,
    })
  }
}
