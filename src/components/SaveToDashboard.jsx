import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUser, saveProject, findProjectByAddress, addProjectTypeToExisting } from '../lib/supabase'
import { isDeveloper, isContractor } from '../lib/access'
import { createJob } from '../lib/client-jobs'

const PROJ_LABELS = {
  sfh: 'New Home', adu: 'ADU', addition: 'Addition',
  deck: 'Deck', reno: 'Renovation', pool: 'Pool',
  shed: 'Shed', townhouse: 'Townhouse',
}

export default function SaveToDashboard({ state, data, saveStatus, setSaveStatus }) {
  const [user, setUser] = useState(null)
  const [checked, setChecked] = useState(false)
  const [modal, setModal] = useState(null)

  useEffect(() => {
    getUser().then(u => {
      setUser(u)
      setChecked(true)
    })
  }, [])

  // Only show for paying tiers (contractor or developer)
  if (!isDeveloper() && !isContractor()) return null

  // Still checking auth
  if (!checked) return null

  // Not logged in — prompt to log in
  if (!user) {
    const dest = isContractor() ? '/contractor' : '/dashboard'
    const label = isContractor() ? 'Contractor' : 'Developer'
    const action = isContractor() ? 'Log in via Contractor Mode to save jobs' : 'Log in to save this project'
    return (
      <div className="w-full mt-2 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
        <div className="text-xs text-amber-800">
          <strong>{label}:</strong> {action}
        </div>
        <Link to={dest} className="text-xs text-amber-700 font-semibold hover:text-amber-900 whitespace-nowrap">
          Log in ↗
        </Link>
      </div>
    )
  }

  const SOLO_TYPES = ['sfh', 'adu', 'townhouse']

  async function doSave() {
    const permitCount = (data?.count || 0) +
      (state.historic ? 1 : 0) + (state.septic ? 1 : 0) + (state.flood ? 1 : 0)

    if (isContractor()) {
      // Contractors save to their jobs list, not the developer dashboard
      const projs = state.projs?.length > 0 ? state.projs : [state.proj].filter(Boolean)
      const primaryType = state.proj || projs[0] || 'sfh'
      const jobAddress = state.addr || state.jurisdiction || 'Unknown address'

      await createJob({
        clientName: `${PROJ_LABELS[primaryType] || primaryType} — ${jobAddress}`,
        address: jobAddress,
        jurisdiction: state.jurisdiction,
        projectType: primaryType,
        projs,
        status: 'active',
        notes: `${permitCount} permits · ${data?.timeline || ''} · ${data?.fees || ''}`,
      })
    } else {
      await saveProject({
        name: `${PROJ_LABELS[state.proj] || state.proj} — ${state.addr || state.jurisdiction}`,
        jurisdiction: state.jurisdiction,
        addr: state.addr,
        proj: state.proj,
        projs: state.projs?.length > 0 ? state.projs : [state.proj],
        cost: state.cost,
        historic: state.historic,
        septic: state.septic,
        flood: state.flood,
        corner: state.corner,
        permitCount,
        timeline: data?.timeline,
        fees: data?.fees,
        status: 'active',
      })
    }
  }

  async function handleSave() {
    setSaveStatus('saving')
    try {
      // Contractors go straight to save — no duplicate check against projects table
      if (isContractor()) {
        await doSave()
        setSaveStatus('saved')
        return
      }

      if (!state.addr || !state.jurisdiction || !state.proj) {
        await doSave()
        setSaveStatus('saved')
        return
      }

      // Developer: check for existing projects at this address
      const existing = await findProjectByAddress(state.addr, state.jurisdiction)
      const currentProj = state.proj
      const isSolo = SOLO_TYPES.includes(currentProj)

      if (existing.length > 0) {
        const exactMatch = existing.find(p =>
          (p.projs || [p.project_type]).includes(currentProj)
        )
        if (exactMatch) {
          setSaveStatus('idle')
          setModal({ type: 'duplicate', existingProject: exactMatch })
          return
        }
        if (!isSolo) {
          setSaveStatus('idle')
          setModal({ type: 'attach', existingProject: existing[0] })
          return
        }
      }

      await doSave()
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
          {isContractor() ? 'Job saved to your jobs list' : 'Project saved to your dashboard'}
        </div>
        <Link to={isContractor() ? '/contractor' : '/dashboard'}
          className="text-xs text-green-700 font-semibold hover:text-green-800 whitespace-nowrap">
          {isContractor() ? 'View my jobs ↗' : 'View dashboard ↗'}
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

  async function handleAttach() {
    const { existingProject } = modal
    setModal(null)
    setSaveStatus('saving')
    try {
      await addProjectTypeToExisting(existingProject.id, state.proj,
        existingProject.projs || [existingProject.project_type])
      setSaveStatus('saved')
    } catch (err) { setSaveStatus('error') }
  }

  async function handleSaveAnyway() {
    setModal(null)
    setSaveStatus('saving')
    try { await doSave(); setSaveStatus('saved') }
    catch (err) { setSaveStatus('error') }
  }

  return (
    <>
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            {modal.type === 'duplicate' ? (<>
              <div className="text-base font-semibold text-gray-900 mb-2">Project already exists</div>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                You already have a <strong>{PROJ_LABELS[state.proj] || state.proj}</strong> project
                at <strong>{modal.existingProject.address}</strong>.
              </p>
              <div className="flex flex-col gap-2">
                <Link to="/dashboard" className="w-full py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl text-center">Open existing project</Link>
                <button onClick={handleSaveAnyway} className="w-full py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl">Create new separate project</button>
                <button onClick={() => setModal(null)} className="text-xs text-gray-400 text-center mt-1">Cancel</button>
              </div>
            </>) : (<>
              <div className="text-base font-semibold text-gray-900 mb-2">Add to existing project?</div>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                Found an existing project at <strong>{modal.existingProject.address}</strong>.
                Add this <strong>{PROJ_LABELS[state.proj] || state.proj}</strong> to it?
              </p>
              <div className="flex flex-col gap-2">
                <button onClick={handleAttach} className="w-full py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl">Add to existing project</button>
                <button onClick={handleSaveAnyway} className="w-full py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl">Save as separate project</button>
                <button onClick={() => setModal(null)} className="text-xs text-gray-400 text-center mt-1">Cancel</button>
              </div>
            </>)}
          </div>
        </div>
      )}
      <button
        onClick={handleSave}
      disabled={saveStatus === 'saving'}
      className="w-full mt-2 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
      </svg>
      {saveStatus === 'saving' ? 'Saving...' : isContractor() ? 'Save to my jobs' : 'Save to my dashboard'}
    </button>
    </>
  )
}
