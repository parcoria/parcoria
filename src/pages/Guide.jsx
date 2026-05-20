import { useParams, Link } from 'react-router-dom'
import { getGuideBySlug, GUIDES } from '../data/learn'

const CATEGORY_COLORS = {
  'Fundamentals':     'bg-blue-50 text-blue-700 border-blue-100',
  'Legal & Financial':'bg-amber-50 text-amber-700 border-amber-100',
  'Owner-Builder':    'bg-green-50 text-green-700 border-green-100',
  'Inspections':      'bg-purple-50 text-purple-700 border-purple-100',
  'Jurisdictions':    'bg-brand-50 text-brand-700 border-brand-100',
  'Planning':         'bg-rose-50 text-rose-700 border-rose-100',
}

export default function Guide() {
  const { slug } = useParams()
  const guide = getGuideBySlug(slug)

  if (!guide) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="text-4xl mb-4">🔍</div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Guide not found</h1>
        <Link to="/learn" className="text-sm text-brand-600 hover:text-brand-700">← Back to Learning Center</Link>
      </div>
    )
  }

  // Related guides — same category, exclude current
  const related = GUIDES.filter(g => g.category === guide.category && g.slug !== guide.slug).slice(0, 2)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
        <Link to="/learn" className="hover:text-gray-600">Learning Center</Link>
        <span>›</span>
        <span className={`px-2 py-0.5 rounded-full border font-medium ${CATEGORY_COLORS[guide.category] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
          {guide.category}
        </span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="text-4xl mb-4">{guide.icon}</div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 leading-snug mb-3">
          {guide.title}
        </h1>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>{guide.readTime} read</span>
          <span>·</span>
          <span>Research Triangle, NC</span>
          <span>·</span>
          <span>Free guide</span>
        </div>
      </div>

      {/* Intro */}
      <p className="text-base text-gray-600 leading-relaxed mb-8 pb-8 border-b border-gray-100">
        {guide.intro}
      </p>

      {/* Sections */}
      <div className="space-y-8 mb-10">
        {guide.sections.map((section, i) => (
          <div key={i}>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{section.heading}</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              {section.body.split('\n\n').map((para, j) => {
                // Render bullet lists
                if (para.startsWith('•')) {
                  const items = para.split('\n').filter(l => l.startsWith('•'))
                  return (
                    <ul key={j} className="space-y-1.5 pl-1">
                      {items.map((item, k) => (
                        <li key={k} className="flex items-start gap-2">
                          <span className="text-brand-600 flex-shrink-0 mt-0.5">•</span>
                          <span>{item.replace('• ', '')}</span>
                        </li>
                      ))}
                    </ul>
                  )
                }
                // Render numbered lists
                if (para.match(/^\d+\./)) {
                  const items = para.split('\n').filter(l => l.match(/^\d+\./))
                  return (
                    <ol key={j} className="space-y-1.5 pl-1">
                      {items.map((item, k) => (
                        <li key={k} className="flex items-start gap-2">
                          <span className="text-brand-600 font-medium flex-shrink-0">{k + 1}.</span>
                          <span>{item.replace(/^\d+\.\s/, '')}</span>
                        </li>
                      ))}
                    </ol>
                  )
                }
                // Bold text handling
                const parts = para.split(/(\*\*[^*]+\*\*)/)
                return (
                  <p key={j}>
                    {parts.map((part, k) =>
                      part.startsWith('**') && part.endsWith('**')
                        ? <strong key={k} className="font-semibold text-gray-800">{part.slice(2, -2)}</strong>
                        : part
                    )}
                  </p>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-brand-600 rounded-2xl p-6 text-center mb-10">
        <div className="text-white font-semibold mb-1">{guide.cta.text}</div>
        <div className="text-brand-200 text-xs mb-4 leading-relaxed">{guide.cta.sub}</div>
        <Link
          to={guide.cta.link}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-700 text-sm font-semibold rounded-xl hover:bg-brand-50 transition-colors"
        >
          {guide.cta.button}
        </Link>
      </div>

      {/* Related guides */}
      {related.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Related guides</h3>
          <div className="space-y-3">
            {related.map(g => (
              <Link key={g.slug} to={`/learn/${g.slug}`}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <span className="text-xl">{g.icon}</span>
                <div>
                  <div className="text-sm font-medium text-gray-900">{g.title}</div>
                  <div className="text-xs text-gray-400">{g.readTime} read</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <Link to="/learn" className="text-xs text-gray-400 hover:text-gray-600">← Back to Learning Center</Link>
      </div>
    </div>
  )
}
