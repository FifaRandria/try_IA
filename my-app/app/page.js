'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { 
  SparklesIcon, 
  BoltIcon, 
  CpuChipIcon,
  ArrowRightIcon,
  DocumentArrowDownIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

export default function Landing() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [level, setLevel] = useState('enfant')
  const [currentTip, setCurrentTip] = useState(0)

  const handleStart = () => {
    if (!name.trim()) return
    router.push(`/explain?name=${encodeURIComponent(name)}&level=${level}`)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleStart()
  }

  const tips = [
    { title: 'Comment utiliser ?', desc: '1. Choisis ton niveau (enfant, débutant ou expert)' },
    { title: 'Comment utiliser ?', desc: '2. Tape ta question technique' },
    { title: 'Comment utiliser ?', desc: '3. Lis l\'explication adaptée' },
    { title: 'Comment utiliser ?', desc: '4. Télécharge en PDF !' },
  ]

  const features = [
    { icon: SparklesIcon, title: 'Personnalisé', desc: 'Adapté à ton niveau' },
    { icon: BoltIcon, title: 'Rapide', desc: 'Explications en secondes' },
    { icon: CpuChipIcon, title: 'IA Puissante', desc: 'Modèles avancés' },
  ]

  const levels = [
    { value: 'enfant', label: 'Enfant', icon: '-', desc: '5 ans' },
    { value: 'debutant', label: 'Débutant', icon: '-', desc: 'Curieux' },
    { value: 'avancé', label: 'avancé', icon: '-', desc: 'Technique' },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [tips.length])

  return (
    <div className="min-h-screen bg-white relative">
      <div className="hidden lg:block fixed bottom-6 right-6 z-50 w-72">
        <div className="bg-gradient-to-br from-indigo-50 to-pink-50 border border-indigo-100 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Ton assistante IA</h3>
              <p className="text-xs text-slate-500">Spécialisée Tech</p>
            </div>
          </div>

          <div className="relative h-20">
            {tips.map((tip, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-500 ${
                  index === currentTip 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-2'
                }`}
              >
                <div className="bg-white rounded-xl p-3 border border-indigo-100">
                  <p className="text-sm font-medium text-indigo-700">{tip.title}</p>
                  <p className="text-xs text-slate-600 mt-1">{tip.desc}</p>
                </div>
                <div className="flex justify-center gap-1 mt-2">
                  {tips.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        i === currentTip ? 'bg-indigo-500 w-3' : 'bg-indigo-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full space-y-10">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-slate-600">Spécialisé Tech</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
              Explain Like<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
                I&apos;m 5
              </span>
            </h1>
            
            <p className="text-lg text-slate-600">
              Débloque n&apos;importe quel concept technique.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
                  Comment t&apos;appelles-tu ?
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Ton prénom..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
                  Ton niveau ?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {levels.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setLevel(opt.value)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                        level === opt.value
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 text-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 text-xs'
                      }`}
                    >
                      <div className="text-xl mb-1">{opt.icon}</div>
                      <div className="font-medium text-sm">{opt.label}</div>
                      <div className="text-xs opacity-60">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStart}
                disabled={!name.trim()}
                className="w-full py-3.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                Commencer
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="text-center">
                  <Icon className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                  <div className="font-medium text-slate-700 text-sm">{feature.title}</div>
                  <div className="text-xs text-slate-500">{feature.desc}</div>
                </div>
              )
            })}
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-pink-50 rounded-xl p-4 border border-indigo-100">
            <div className="flex items-center gap-3">
              <DocumentArrowDownIcon className="w-6 h-6 text-indigo-600" />
              <div className="text-sm">
                <span className="font-medium text-slate-900">Fonctionnalité PDF</span>
                <span className="text-slate-600"> - Télécharge tes explications pour les conserver !</span>
              </div>
            </div>
          </div>

          <p className="text-slate-400 text-sm text-center pt-4">
            Pas de compte requis • Gratuit • Fifa_Randria 2026
          </p>
        </div>
      </main>
    </div>
  )
}