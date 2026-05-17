import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUser, saveProject } from '../lib/supabase'
import { isDeveloper } from '../lib/access'

const PROJ_LABELS = {
  sfh: 'New Home', adu: 'ADU', addition: 'Addition',
  deck: 'Deck', reno: 'Renovation', pool: 'Pool',
  shed: 'Shed', townhouse: 'Townhouse',
}

export default function SaveToDashboard({ state, data, saveStatus, setSaveStatus }) {
  const [user, setUser] = useState(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    getUser().then(u => {
      setUser(u)
      setChecked(true)
    })
  }, [])

  // Not a developer — don't show
  if (!isDeveloper()) return null

  // Still checking auth
  if (!checked) return null

  // Not logged in — prompt to log in
  if (!user) {
    return (
      <div className="w-full mt-2 bg-brand-50 border border-brand-100 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
        <div className="text-xs text-brand-700">
          <strong>Developer:</strong> Log in to save this project to your dashboard
        </div>
        <Link
          to="/dashboard"
          className="text-xs text-brand-600 font-semibold hover:text-brand-700 whitespace-nowrap"
        >
          Log in ↗
        </Link>
      </div>
    )
  }

  async function handleSave() {
    setSaveStatus('saving')
    try {
      const permitCount = (data?.count || 0) +
        (state.historic ? 1 : 0) +
        (state.septic ? 1 : 0) +
        (state.flood ? 1 : 0)

      await saveProject({
        name: `${PROJ_LABELS[state.proj] || state.proj} — ${state.addr || state.jurisdiction}`,
        jurisdiction: state.jurisdiction,
        addr: state.addr,
        proj: state.proj,
        cost: state.cost,
        historic: state.historic,
        septic: state.septic,
        flood: state.flood,
        corner: state.corner,
        permitCount,
        timeline: data?.timeline,
        fees: data?.fees,
        status: 'planning',
      })
      setSaveStatus('saved')
    } catch (err) {
      console.error('Save error:', err)
      setSaveStatus('error')
    }
  }

  if (saveStatus === 'saved') {
    return (
      <div className="w-full mt-2 bg-green-50 border border-green-100 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
        <div className="text-xs text-green-700 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Project saved to your dashboard
        </div>
        <Link to="/dashboard" className="text-xs text-green-700 font-semibold hover:text-green-800 whitespace-nowrap">
          View dashboard ↗
        </Link>
      </div>
    )
  }

  if (saveStatus === 'error') {
    return (
      <div className="w-full mt-2 bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-xs text-red-700">
        Could not save project. <button onClick={handleSave} className="underline">Try again</button>
      </div>
    )
  }

  return (
    <button
      onClick={handleSave}
      disabled={saveStatus === 'saving'}
      className="w-full mt-2 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
      </svg>
      {saveStatus === 'saving' ? 'Saving...' : 'Save to my dashboard'}
    </button>
  )
}
