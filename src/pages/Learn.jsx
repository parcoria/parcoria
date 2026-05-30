import { Link } from 'react-router-dom'
import { GUIDES, CATEGORIES } from '../data/learn'
import { useState } from 'react'
import { t, useLang } from '../lib/i18n'

const CATEGORY_COLORS = {
  'Fundamentals':     'bg-blue-50 text-blue-700 border-blue-100',
  'Legal & Financial':'bg-amber-50 text-amber-700 border-amber-100',
  'Owner-Builder':    'bg-green-50 text-green-700 border-green-100',
  'Inspections':      'bg-purple-50 text-purple-700 border-purple-100',
  'Jurisdictions':    'bg-brand-50 text-brand-700 border-brand-100',
  'Planning':         'bg-rose-50 text-rose-700 border-rose-100',
}

export default function Learn() {
  useLang() // re-render on language change
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? GUIDES
    : GUIDES.filter(g => g.category === activeCategory)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 bg-brand-50 text-brand-700 border border-brand-100 rounded-full font-medium mb-4">
          {t('learn_badge')}
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">
          {t('learn_heading')}
        </h1>
        <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
          {t('learn_sub')}
        </p>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap mb-8 justify-center">
        {[t('learn_filter_all'), ...CATEGORIES].map((cat, i) => {
          const rawCat = i === 0 ? 'All' : CATEGORIES[i - 1]
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(rawCat)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                activeCategory === rawCat
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Guide cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {filtered.map(guide => (
          <Link
            key={guide.slug}
            to={`/learn/${guide.slug}`}
            className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-brand-200 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl flex-shrink-0">{guide.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${CATEGORY_COLORS[guide.category] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                    {guide.category}
                  </span>
                  <span className="text-xs text-gray-400">{guide.readTime} {t('learn_read')}</span>
                </div>
                <h2 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-brand-700 transition-colors">
                  {guide.title}
                </h2>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{guide.description}</p>
            <div className="mt-3 text-xs text-brand-600 font-medium group-hover:text-brand-700">
              {t('learn_read_guide')}
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="bg-brand-600 rounded-2xl p-8 text-center">
        <div className="text-white text-xl font-semibold mb-2">
          {t('learn_cta_title')}
        </div>
        <div className="text-brand-200 text-sm mb-6 max-w-md mx-auto">
          {t('learn_cta_sub')}
        </div>
        <Link
          to="/wizard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-700 text-sm font-semibold rounded-xl hover:bg-brand-50 transition-colors"
        >
          {t('learn_cta_btn')}
        </Link>
      </div>
    </div>
  )
}
