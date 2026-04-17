'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  SparklesIcon,
  LightBulbIcon,
  QuestionMarkCircleIcon,
  HeartIcon,
  ArrowDownTrayIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'
import { jsPDF } from 'jspdf'

function formatContent(text) {
  const patterns = [
    { regex: /\*\*([^*]+)\*\*/g, replace: '<strong class="text-indigo-700 font-semibold">$1</strong>' },
    { regex: /\*([^*]+)\*/g, replace: '<em class="text-slate-600">$1</em>' },
    { regex: /`([^`]+)`/g, replace: '<code class="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded font-mono text-sm">$1</code>' },
  ]
  
  let formatted = text
  patterns.forEach(({ regex, replace }) => {
    formatted = formatted.replace(regex, replace)
  })
  
  formatted = formatted.replace(/\n/g, '<br/>')
  
  return formatted
}

function ExplainContent() {
  const params = useSearchParams()
  const resultRef = useRef(null)

  const name = params.get('name') || 'ami'
  const initialLevel = params.get('level') || 'enfant'

  const [topic, setTopic] = useState('')
  const [level, setLevel] = useState(initialLevel)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const levelConfig = {
    enfant: { 
      bg: 'from-pink-50 to-rose-50', 
      border: 'border-pink-200', 
      badge: 'bg-pink-100 text-pink-700',
      icon: '-',
      label: 'Explication pour enfant'
    },
    debutant: { 
      bg: 'from-blue-50 to-cyan-50', 
      border: 'border-blue-200', 
      badge: 'bg-blue-100 text-blue-700',
      icon: '-',
      label: 'Explication debutant'
    },
    avance: { 
      bg: 'from-slate-50 to-gray-100', 
      border: 'border-slate-200', 
      badge: 'bg-slate-200 text-slate-700',
      icon: '-',
      label: 'Explication technique'
    }
  }

  const config = levelConfig[level] || levelConfig.debutant

  const handleSubmit = async () => {
    if (!topic.trim()) return
    
    setLoading(true)
    setError('')
    setResult('')

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, level, name })
      })

      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue')
      } else {
        setResult(data.content)
      }
    } catch (err) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && topic.trim()) handleSubmit()
  }

  const handleDownloadPDF = async () => {
    if (!result) return

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 15
      const contentWidth = pageWidth - (margin * 2)
      
      pdf.setFillColor(255, 255, 255)
      pdf.rect(0, 0, pageWidth, pageHeight, 'F')
      
      pdf.setFontSize(20)
      pdf.setTextColor(88, 28, 135)
      pdf.text(topic, margin, margin + 10)
      
      pdf.setDrawColor(147, 51, 234)
      pdf.setLineWidth(1)
      pdf.line(margin, margin + 15, margin + 30, margin + 15)
      
      pdf.setFontSize(12)
      pdf.setTextColor(100, 116, 139)
      pdf.text(config.label, margin, margin + 25)
      
      pdf.setFontSize(11)
      pdf.setTextColor(51, 65, 85)
      
      const lines = result.split('\n')
      let yPos = margin + 40
      const lineHeight = 7
      
      for (const line of lines) {
        if (yPos > pageHeight - margin) {
          pdf.addPage()
          yPos = margin
        }
        
        const cleanLine = line
          .replace(/\*\*([^*]+)\*\*/g, '$1')
          .replace(/\*([^*]+)\*/g, '$1')
          .replace(/`([^`]+)`/g, '$1')
        
        const splitLines = pdf.splitTextToSize(cleanLine, contentWidth)
        for (const splitLine of splitLines) {
          pdf.text(splitLine, margin, yPos)
          yPos += lineHeight
        }
      }
      
      pdf.setFontSize(9)
      pdf.setTextColor(148, 163, 184)
      pdf.text('ELI5 IA - Explain Like I\'m 5', margin, pageHeight - 10)
      
      pdf.save(`${topic || 'explication'}_ELI5.pdf`)
    } catch (err) {
      console.error('PDF download error:', err)
      setError('Erreur lors du téléchargement PDF. Veuillez réessayer.')
    }
  }

  const suggestions = ['JWT Tokens', 'React Hooks', 'API REST', 'Git']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-medium">Retour</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-slate-900">ELI5</span>
            <span className="text-xs bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-2 py-1 rounded-full">
              IA
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Salut <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">{name}</span> !
          </h1>
          <p className="text-slate-600">
            Tu peux me demander d&apos;expliquer n&apos;importe quoi.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Qu&apos;est-ce que tu veux apprendre ?
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={handleKeyPress}
                className="text-slate-700 w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Ex: JavaScript, Blockchain, Machine Learning..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Niveau d&apos;explication
              </label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(levelConfig).map(([key, conf]) => (
                  <button
                    key={key}
                    onClick={() => setLevel(key)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      level === key
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xl mb-1">{conf.icon}</div>
                    <div className="font-medium text-sm capitalize">{key}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!topic.trim() || loading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Réflechit...
                </span>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  Expliquer
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700 text-center">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Télécharger en PDF
              </button>
            </div>

            <div 
              ref={resultRef}
              data-result-ref="true"
              className={`bg-gradient-to-br ${config.bg} rounded-2xl border ${config.border} p-8 shadow-lg animate-fade-in relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.badge}`}>
                      {config.icon} {config.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <DocumentArrowDownIcon className="w-3 h-3" />
                    <span>PDF</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{topic}</h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full"></div>
                </div>

                <div 
                  className="prose prose-slate max-w-none text-slate-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatContent(result) }}
                />
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <p className="text-sm text-indigo-700 text-center">
                <SparklesIcon className="w-4 h-4 inline mr-2" />
                Cette fiche est prête à être téléchargée en PDF !
              </p>
            </div>
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <LightBulbIcon className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-slate-900">Suggestions</h3>
            </div>
            <div className="space-y-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setTopic(s)}
                  className="block w-full text-left text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  → {s}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <QuestionMarkCircleIcon className="w-5 h-5 text-indigo-500" />
              <h3 className="font-semibold text-slate-900">Comment ça marche ?</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              J&apos;utilise l&apos;IA pour transformer des concepts techniques complexes en explications claires et adaptées à ton niveau. Tu peux <strong>télécharger le résultat en PDF</strong> pour le garder !
            </p>
          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-slate-400 text-sm flex items-center justify-center gap-1">
        <HeartIcon className="w-4 h-4" />
        <p>Fifa_Randria 2026</p>
      </footer>
    </div>
  )
}

function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center">
        <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p className="text-slate-600">Chargement...</p>
      </div>
    </div>
  )
}

export default function ExplainPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ExplainContent />
    </Suspense>
  )
}