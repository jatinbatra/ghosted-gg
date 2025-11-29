'use client'

import { useState, useEffect } from 'react'

interface GraveyardEntry {
  id: string
  date: string
  ghostingProb: number
  causeOfDeath: string
  severity: string
}

export default function Graveyard() {
  const [graves, setGraves] = useState<GraveyardEntry[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('ghosted_graveyard')
    if (saved) {
      setGraves(JSON.parse(saved))
    }
  }, [])

  const addToGraveyard = (entry: GraveyardEntry) => {
    const updated = [entry, ...graves].slice(0, 10) // Keep last 10
    setGraves(updated)
    localStorage.setItem('ghosted_graveyard', JSON.stringify(updated))
  }

  const clearGraveyard = () => {
    if (confirm('Clear all graves? This cannot be undone.')) {
      setGraves([])
      localStorage.removeItem('ghosted_graveyard')
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-40 spooky-button px-4 py-3 text-sm font-bold text-orange-400"
      >
        🪦 Graveyard ({graves.length})
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-red-500" style={{ fontFamily: 'Creepster, cursive' }}>
            🪦 YOUR GRAVEYARD
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {graves.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👻</div>
            <p className="text-gray-400">No dead conversations yet...</p>
            <p className="text-gray-500 text-sm mt-2">Your ghosted chats will appear here</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {graves.map((grave, idx) => (
                <div key={grave.id} className="ghost-card p-6 hover:scale-105 transition-transform">
                  <div className="text-4xl mb-3">🪦</div>
                  <div className="text-xs text-gray-500 mb-2">{grave.date}</div>
                  <div className="text-2xl font-bold text-red-500 mb-2">
                    {grave.ghostingProb}%
                  </div>
                  <div className="text-xl mb-2">{grave.severity}</div>
                  <p className="text-gray-300 text-sm italic">
                    "{grave.causeOfDeath}"
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={clearGraveyard}
                className="spooky-button px-6 py-3 text-sm font-bold text-red-400 hover:border-red-500"
              >
                🔥 Clear Graveyard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Export function to add entries
export function useGraveyard() {
  return {
    addToGraveyard: (result: any) => {
      const entry: GraveyardEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        ghostingProb: result.ghosting_probability,
        causeOfDeath: result.cause_of_death,
        severity: result.severity_meter
      }
      
      const saved = localStorage.getItem('ghosted_graveyard')
      const graves = saved ? JSON.parse(saved) : []
      const updated = [entry, ...graves].slice(0, 10)
      localStorage.setItem('ghosted_graveyard', JSON.stringify(updated))
    }
  }
}
