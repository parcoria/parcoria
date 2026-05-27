// detectJurisdiction.js
// Parses jurisdiction from a geocoded address string
// Works with ArcGIS matched addresses like "500 Foster St, Durham, North Carolina, 27701"

const JURISDICTION_MAP = {
  'raleigh': 'raleigh',
  'durham': 'durham',
  'chapel hill': 'chapelhill',
  'apex': 'apex',
  'holly springs': 'hollysprings',
  'wake forest': 'wakeforest',
  'morrisville': 'morrisville',
  'garner': 'garner',
  'fuquay-varina': 'fuquayvarina',
  'fuquay varina': 'fuquayvarina',
  'cary': 'cary',
}

const JURISDICTION_LABELS = {
  raleigh: 'City of Raleigh',
  durham: 'City of Durham',
  chapelhill: 'Town of Chapel Hill',
  apex: 'Town of Apex',
  hollysprings: 'Town of Holly Springs',
  wakeforest: 'Town of Wake Forest',
  morrisville: 'Town of Morrisville',
  garner: 'Town of Garner',
}

export function detectJurisdictionFromAddress(matchedAddress) {
  if (!matchedAddress) return null
  const lower = matchedAddress.toLowerCase()

  for (const [city, id] of Object.entries(JURISDICTION_MAP)) {
    // Match city name surrounded by comma, space, or string boundaries
    // This prevents "garner" matching "la grange" etc
    const pattern = new RegExp(`(^|,\\s*)${city}(\\s*,|\\s*$)`)
    if (pattern.test(lower)) {
      return {
        id,
        label: JURISDICTION_LABELS[id],
        confidence: 'high',
      }
    }
  }

  return null
}

export function getJurisdictionLabel(id) {
  return JURISDICTION_LABELS[id] || id
}

// Zip codes known to be in each jurisdiction - fallback when city parse fails
const ZIP_MAP = {
  // Raleigh
  '27601': 'raleigh', '27602': 'raleigh', '27603': 'raleigh', '27604': 'raleigh',
  '27605': 'raleigh', '27606': 'raleigh', '27607': 'raleigh', '27608': 'raleigh',
  '27609': 'raleigh', '27610': 'raleigh', '27612': 'raleigh', '27613': 'raleigh',
  '27614': 'raleigh', '27615': 'raleigh', '27616': 'raleigh', '27617': 'raleigh',
  // Durham
  '27701': 'durham', '27702': 'durham', '27703': 'durham', '27704': 'durham',
  '27705': 'durham', '27706': 'durham', '27707': 'durham', '27708': 'durham',
  '27709': 'durham', '27710': 'durham', '27711': 'durham',
  // Chapel Hill
  '27514': 'chapelhill', '27515': 'chapelhill', '27516': 'chapelhill', '27517': 'chapelhill',
  // Apex
  '27502': 'apex', '27523': 'apex',
  // Holly Springs
  '27540': 'hollysprings',
  // Wake Forest
  '27587': 'wakeforest', '27588': 'wakeforest',
  // Morrisville
  '27560': 'morrisville',
  // Garner
  '27529': 'garner',
  '27526': 'fuquayvarina',
  '27513': 'cary',
  '27511': 'cary',
  '27518': 'cary',
  '27519': 'cary',
  '27560': 'morrisville',
}

export function detectJurisdictionFromZip(address) {
  if (!address) return null
  const zipMatch = address.match(/\b(\d{5})\b/)
  if (!zipMatch) return null
  const zip = zipMatch[1]
  const id = ZIP_MAP[zip]
  if (!id) return null
  return {
    id,
    label: JURISDICTION_LABELS[id],
    confidence: 'medium', // zip codes can span jurisdictions
  }
}

export { JURISDICTION_LABELS }
