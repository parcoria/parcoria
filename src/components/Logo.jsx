// Logo.jsx — Parcoria brand mark
// Concept F: Permit progress bars — four stacked bars at decreasing lengths
// representing permits in sequence, the first complete, the rest in motion

export function LogoMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Track backgrounds */}
      <rect x="10" y="27" width="52" height="9" rx="4.5" fill="#185FA5" opacity=".08"/>
      <rect x="10" y="42" width="52" height="9" rx="4.5" fill="#185FA5" opacity=".08"/>
      <rect x="10" y="57" width="52" height="9" rx="4.5" fill="#185FA5" opacity=".08"/>
      {/* Bar 1 — complete */}
      <rect x="10" y="12" width="52" height="9" rx="4.5" fill="#185FA5"/>
      {/* Bar 2 */}
      <rect x="10" y="27" width="42" height="9" rx="4.5" fill="#185FA5" opacity=".75"/>
      {/* Bar 3 */}
      <rect x="10" y="42" width="30" height="9" rx="4.5" fill="#185FA5" opacity=".5"/>
      {/* Bar 4 */}
      <rect x="10" y="57" width="18" height="9" rx="4.5" fill="#185FA5" opacity=".28"/>
      {/* Checkmark on bar 1 */}
      <circle cx="56" cy="16.5" r="6" fill="#185FA5"/>
      <path d="M53.5 16.5l2 2 3.5-3.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function LogoWordmark({ size = 28 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <LogoMark size={size} />
      <span style={{ fontSize: 18, fontWeight: 600, color: 'inherit', letterSpacing: '-.4px', lineHeight: 1 }}>
        Parcoria
      </span>
    </div>
  )
}

export default LogoMark
