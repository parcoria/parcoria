import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

// Post-processor: converts any inline bullet patterns to proper markdown lists
// This runs on every Claude response regardless of jurisdiction
function cleanMarkdown(text) {
  if (!text) return text
  const lines = text.split('\n')
  const result = []
  for (const line of lines) {
    // Line starts with a bullet character — convert to markdown list item
    if (/^[•·▪▸➤◦‣]\s+/.test(line)) {
      result.push(line.replace(/^[•·▪▸➤◦‣]\s+/, '- '))
      continue
    }
    // Line contains inline bullets — split into header + separate list items
    if (/[•·▪▸]/.test(line) && !line.startsWith('#') && !line.startsWith('-')) {
      const parts = line.split(/\s*[•·▪▸]\s+/)
      if (parts.length > 1) {
        if (parts[0].trim()) result.push(parts[0].trim())
        parts.slice(1).forEach(part => {
          if (part.trim()) result.push('- ' + part.trim())
        })
        continue
      }
    }
    result.push(line)
  }
  return result.join('\n')
}

const SYSTEM_PROMPT = `You are the Parcoria AI Concierge — an expert guide for residential construction permitting across Wake County and the Research Triangle: Raleigh, Durham, Chapel Hill, Apex, Holly Springs, Wake Forest, Morrisville, and Garner, NC.

You have deep knowledge of:
- Raleigh: City permit portal + Wake County inspections
- Durham: Dual portal system — Dplans (building) + LDO (trade permits, fees, inspections)
- Chapel Hill: Online Permit Center + OWASA utilities + CAPS certificate requirement unique to Orange County
- Apex: Dual portal — IDT Plans (submissions) + ePermits (payments)
- Holly Springs: CityView Portal + Wake County inspections + Progress Energy premise number requirement
- Wake Forest: IDT Plans portal + Wake County inspections + 3 PM inspection cutoff
- Morrisville: CSS Portal + Wake County inspections + no phone inspection requests
- Garner: SmartGov Portal + Garner self-performs inspections (NOT Wake County) + 24-hour notice required
- Wake County inspection scheduling and requirements (Raleigh, Apex, Holly Springs)
- NC State building codes and licensing laws
- The exact sequence permits must be obtained
- Which licensed professionals are legally required for each project type
- Common mistakes that cause correction cycles and delays
- Lien agent requirements, owner exemption affidavits, and NC contractor licensing law

Your personality:
- You are direct, warm, and specific — never vague or generic
- You speak like a trusted expert friend who has built 100 homes across the Triangle
- You give real actionable guidance, not disclaimers
- You are encouraging but honest about complexity and risk
- You never say "consult a professional" as your only answer — you give real information first

Your formatting rules — STRICT, apply to every response regardless of jurisdiction:
- ALWAYS use proper markdown list syntax — a hyphen and space at the start of its own line
- NEVER write bullet points inline inside a paragraph using bullet characters
- For grouped items, always use this exact pattern:

**Group Header:**
- First item — explanation
- Second item — explanation
- Third item — explanation

- Every single bullet point must be on its own separate line
- Headers use double asterisks for bold
- Keep paragraphs to 2 sentences max
- This formatting rule applies permanently for ALL jurisdictions

Your constraints:
- Only answer questions related to construction, permits, zoning, contractors, inspections, and related topics
- Always reference the user's specific jurisdiction when relevant — each city has different portals and requirements
- Keep responses focused and actionable
- Use plain language, avoid jargon unless you explain it`

function buildContextMessage(projectData) {
  if (!projectData) return ''
  const { addr, proj, cost, historic, septic, flood, corner, jurisdiction, permitCount, timeline, fees } = projectData
  const projLabels = {
    sfh: 'new single-family home', adu: 'accessory dwelling unit (ADU)',
    addition: 'addition or expansion', deck: 'deck or porch',
    reno: 'major renovation', pool: 'pool or spa',
    shed: 'shed or detached garage', townhouse: 'townhouse or duplex',
  }
  const jurLabels = {
    raleigh: 'Raleigh, NC', durham: 'Durham, NC',
    chapelhill: 'Chapel Hill, NC', apex: 'Apex, NC', hollysprings: 'Holly Springs, NC',
  }
  const flags = []
  if (historic) flags.push('historic district overlay')
  if (septic) flags.push('private well/septic')
  if (flood) flags.push('floodplain overlay')
  if (corner) flags.push('corner lot')
  return `
PROJECT CONTEXT FOR THIS USER:
- Jurisdiction: ${jurLabels[jurisdiction] || 'Raleigh, NC'}
- Address: ${addr || 'Not provided'}
- Project type: ${projLabels[proj] || proj}
- Estimated cost: ${cost || 'not provided'}
- Permits required: ${permitCount || 'varies'}
- Estimated timeline: ${timeline || 'varies'}
- Estimated permit fees: ${fees || 'varies'}
- Special conditions: ${flags.length > 0 ? flags.join('; ') : 'none'}

Use this context to personalize every response. Reference their specific jurisdiction, project type, and conditions.
  `.trim()
}

const SUGGESTED_QUESTIONS = [
  'What documents do I need to gather first?',
  'How long will my permits take to approve?',
  'Do I need a licensed GC for my project?',
  'What is a lien agent and do I need one?',
  'What happens if my permit application gets rejected?',
  'How do I schedule my inspections?',
  'What is the Owner Exemption Affidavit?',
  'What are the most common mistakes that delay permits?',
]

export default function Concierge({ projectData }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: projectData?.proj
        ? `I have reviewed your ${projectData.proj === 'sfh' ? 'new home' : projectData.proj} project${projectData.addr ? ` at **${projectData.addr}**` : ''}. You have **${projectData.permitCount || 'several'} permits** ahead with an estimated timeline of **${projectData.timeline || 'a few months'}**. What would you like to know first?`
        : "Hi — I am your Parcoria AI Concierge. I know the Triangle permit process inside and out. Ask me anything about your project — permits, contractors, inspections, timelines, or NC law.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(text) {
    const question = text || input.trim()
    if (!question || loading) return
    setInput('')
    setError('')
    const userMessage = { role: 'user', content: question }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setLoading(true)
    try {
      const contextMessage = buildContextMessage(projectData)
      const apiMessages = updatedMessages.map(m => ({ role: m.role, content: m.content }))
      if (contextMessage && apiMessages.length === 1) {
        apiMessages[0] = { role: 'user', content: `${contextMessage}\n\nUSER QUESTION: ${question}` }
      }
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error?.message || 'API error')
      }
      const data = await response.json()
      const raw = data.content?.[0]?.text || 'Sorry, I could not generate a response.'
      setMessages(prev => [...prev, { role: 'assistant', content: cleanMarkdown(raw) }])
    } catch (err) {
      console.error('Concierge error:', err)
      setError('Something went wrong. Please try again.')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-semibold">P</span>
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">Parcoria AI Concierge</div>
          <div className="text-xs text-gray-400">Expert guidance for your build</div>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          <span className="text-xs text-gray-400">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                <span className="text-brand-700 text-xs font-semibold">P</span>
              </div>
            )}
            <div className={`max-w-xs sm:max-w-md rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-brand-600 text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-800 rounded-bl-sm'
            }`}>
              {m.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ol]:my-2 [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_li]:my-0 [&_li]:leading-relaxed [&_li]:pl-1 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-3 [&_h3]:mb-1 [&_strong]:font-semibold [&_strong]:text-gray-900">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              ) : m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
              <span className="text-brand-700 text-xs font-semibold">P</span>
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}

        {error && <div className="text-xs text-red-500 text-center py-1">{error}</div>}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      {messages.length < 3 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.slice(0, 4).map((q, i) => (
            <button
              key={i}
              onClick={() => send(q)}
              disabled={loading}
              className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50 transition-colors disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 items-end border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent transition-all">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask anything about your permits, contractors, or timeline..."
            rows={1}
            className="flex-1 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none bg-transparent leading-relaxed"
            style={{ maxHeight: '80px' }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="flex-shrink-0 w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center hover:bg-brand-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 text-center">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
