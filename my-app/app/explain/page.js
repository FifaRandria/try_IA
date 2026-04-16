'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

function ExplainContent() {
  const params = useSearchParams()

  const name = params.get('name') || 'ami'
  const initialLevel = params.get('level') || 'enfant'

  const [topic, setTopic] = useState('')
  const [level, setLevel] = useState(initialLevel)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const styles = {
    enfant: "bg-pink-100 text-lg",
    debutant: "bg-blue-100",
    intermediaire: "bg-gray-200"
  }

  const handleSubmit = async () => {
    setLoading(true)
    setResult('')

    const res = await fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, level, name })
    })

    const data = await res.json()
    setResult(data.content)
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-6 gap-4">

      <h1 className="text-2xl font-bold text-center">
        Salut {name} 👋
      </h1>

      <p className="text-gray-600">
        Comment je peux t&apos;aider aujourd&apos;hui ?
      </p>

      <input
        className="border p-2 w-64"
        placeholder="Ex: JWT"
        onChange={(e) => setTopic(e.target.value)}
      />

      <select
        className="border p-2"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
      >
        <option value="enfant">👶 Enfant</option>
        <option value="debutant">🧑 Débutant</option>
        <option value="intermediaire">🧠 Intermédiaire</option>
      </select>

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Chargement..." : "Expliquer"}
      </button>

      {result && (
        <div className={`p-4 mt-4 rounded w-full max-w-md ${styles[level]}`}>
          {result}
        </div>
      )}

    </main>
  )
}

function Loading() {
  return <main className="min-h-screen flex items-center justify-center">Chargement...</main>
}

export default function ExplainPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ExplainContent />
    </Suspense>
  )
}