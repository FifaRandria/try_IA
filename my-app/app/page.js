'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { 
  SparklesIcon, 
  BoltIcon, 
  CpuChipIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline'

export default function Landing() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [level, setLevel] = useState('enfant')

  const handleStart = () => {
    if (!name.trim()) return
    router.push(`/explain?name=${encodeURIComponent(name)}&level=${level}`)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleStart()
  }

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

  return (
    <div className="min-h-screen bg-white">
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-slate-600">mettez tous les atouts de votre côté</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
              Explain Like<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                I'm 5
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
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                          ? 'border-purple-600 bg-purple-50 text-purple-700 text-xs'
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

          <p className="text-slate-400 text-sm text-center pt-4">
            Pas de compte requis • Gratuit • Fifa_Randria 2026
          </p>
        </div>
      </main>
    </div>
  )
}