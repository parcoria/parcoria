// Parcoria Parcel Intelligence Service
// Geocoding: Nominatim (OpenStreetMap) — CORS friendly, free, no key required
// Flood zone: FEMA National Flood Hazard Layer ArcGIS REST API — free, no key required

const NOMINATIM = 'https://nominatim.openstreetmap.org/search'
const FEMA_NFHL = 'https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28/query'

// Flood zone classifications
const HIGH_RISK_ZONES = ['A', 'AE', 'AH', 'AO', 'AR', 'A99', 'V', 'VE']
const MODERATE_RISK_ZONES = ['X500', '0.2 PCT ANNUAL CHANCE FLOOD HAZARD']

export function classifyFloodZone(zone) {
  if (!zone) return null
  const z = zone.trim().toUpperCase()

  if (HIGH_RISK_ZONES.some(h => z === h || z.startsWith(h + ' '))) {
    return {
      risk: 'high',
      label: 'High risk flood zone',
      zone: z,
      requiresElevationCert: true,
      requiresFloodInsurance: true,
      desc: `Zone ${z} — 1% or greater annual chance of flooding (100-year flood zone). FEMA elevation certificate required before permits are issued. Flood insurance mandatory for federally-backed mortgages.`,
    }
  }

  if (z === 'X500' || MODERATE_RISK_ZONES.some(m => z.includes(m))) {
    return {
      risk: 'moderate',
      label: 'Moderate risk flood zone',
      zone: z,
      requiresElevationCert: false,
      requiresFloodInsurance: false,
      desc: `Zone ${z} — 0.2% annual chance of flooding. Elevation certificate not required but flood insurance is strongly recommended.`,
    }
  }

  return {
    risk: 'minimal',
    label: 'Minimal flood risk',
    zone: z,
    requiresElevationCert: false,
    requiresFloodInsurance: false,
    desc: `Zone ${z} — Minimal flood hazard area. No FEMA elevation certificate required for this parcel based on current FIRM data.`,
  }
}

// Step 1 — Geocode address using Nominatim (OpenStreetMap) — full CORS support
export async function geocodeAddress(address) {
  try {
    const params = new URLSearchParams({
      q: address,
      format: 'json',
      limit: '1',
      countrycodes: 'us',
    })

    const res = await fetch(`${NOMINATIM}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Parcoria/1.0 (parcoria.com)',
      },
    })

    if (!res.ok) throw new Error('Geocoding failed')
    const data = await res.json()

    if (!data || data.length === 0) return null

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      matchedAddress: data[0].display_name,
    }
  } catch (err) {
    console.error('Geocoding error:', err)
    return null
  }
}

// Step 2 — Query FEMA NFHL ArcGIS REST API — full CORS support, free, no key
export async function queryFloodZone(lat, lng) {
  try {
    const params = new URLSearchParams({
      geometry: `${lng},${lat}`,
      geometryType: 'esriGeometryPoint',
      inSR: '4326',
      spatialRel: 'esriSpatialRelIntersects',
      outFields: 'FLD_ZONE,ZONE_SUBTY,SFHA_TF,DFIRM_ID,EFF_DATE',
      returnGeometry: 'false',
      f: 'json',
    })

    const res = await fetch(`${FEMA_NFHL}?${params}`)
    if (!res.ok) throw new Error('FEMA query failed')

    const data = await res.json()
    const features = data?.features

    if (!features || features.length === 0) {
      return { zone: 'X', source: 'no_data' }
    }

    const attrs = features[0].attributes
    return {
      zone: attrs.FLD_ZONE || 'X',
      subtype: attrs.ZONE_SUBTY,
      sfha: attrs.SFHA_TF === 'T',
      firmId: attrs.DFIRM_ID,
      effectiveDate: attrs.EFF_DATE,
      source: 'fema_nfhl',
    }
  } catch (err) {
    console.error('FEMA flood query error:', err)
    return null
  }
}

// Main entry — address string → full flood intelligence
export async function getParcelFloodData(address) {
  const geo = await geocodeAddress(address)

  if (!geo) {
    return {
      status: 'geocode_failed',
      message: 'Could not locate this address. Please verify the address and try again.',
      floodData: null,
      classification: null,
    }
  }

  const floodData = await queryFloodZone(geo.lat, geo.lng)

  if (!floodData) {
    return {
      status: 'fema_failed',
      message: 'Could not retrieve flood data. Verify manually at msc.fema.gov.',
      matchedAddress: geo.matchedAddress,
      floodData: null,
      classification: null,
    }
  }

  const classification = classifyFloodZone(floodData.zone)

  return {
    status: 'success',
    matchedAddress: geo.matchedAddress,
    coordinates: { lat: geo.lat, lng: geo.lng },
    floodData,
    classification,
  }
}
