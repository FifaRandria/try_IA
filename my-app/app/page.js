'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Landing() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [level, setLevel] = useState('enfant')

  const handleStart = () => {
    if (!name) return alert("Entre ton nom 🙂")

    router.push(`/explain?name=${name}&level=${level}`)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6">

      <h1 className="text-4xl font-bold mb-6 text-center">
        Explain Like I'm 5 🧠
      </h1>

      <p className="mb-8 text-center opacity-80">
        Comprends les concepts techniques simplement ✨
      </p>

      <div className="bg-white text-black p-6 rounded-xl shadow-lg flex flex-col gap-4 w-full max-w-sm">

        <input
          className="border p-2 rounded"
          placeholder="Entre ton nom..."
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="enfant">👶 Enfant</option>
          <option value="debutant">🧑 Débutant</option>
          <option value="intermediaire">🧠 Intermédiaire</option>
        </select>

        <button
          onClick={handleStart}
          className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Let's go 🚀
        </button>

      </div>

    </main>
  )
}