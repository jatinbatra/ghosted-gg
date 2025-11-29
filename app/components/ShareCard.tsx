'use client'

import { useRef } from 'react'

interface ShareCardProps {
  result: any
  rizzScore: number
}

export default function ShareCard({ result, rizzScore }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const downloadCard = async () => {
    if (!cardRef.current) return

    try {
      // Use html2canvas if available, otherwise just copy text
      const text = `🔬 GHOSTED.GG AUTOPSY REPORT

Ghosting Probability: ${result.ghosting_probability}%
Rizz Score: ${rizzScore}/100
${result.severity_meter}

Cause of Death: ${result.cause_of_death}

Analyzed at Ghosted.gg 👻`

      await navigator.clipboard.writeText(text)
      alert('Results copied! Share on social media 🔥')
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="mt-8">
      <div 
        ref={cardRef}
        className="ghost-card p-8 max-w-md mx-auto text-center"
      >
        <div className="text-6xl mb-4">👻</div>
        <h3 className="text-3xl font-bold text-red-500 mb-2" style={{ fontFamily: 'Creepster, cursive' }}>
          GHOSTED.GG
        </h3>
        <div className="text-5xl font-bold text-orange-500 my-4">
          {result.ghosting_probability}%
        </div>
        <p className="text-gray-400 text-sm mb-4">GHOSTING PROBABILITY</p>
        <div className="text-3xl mb-4">{result.severity_meter}</div>
        <p className="text-gray-300 text-sm italic">
          "{result.toxic_friend_comment}"
        </p>
        <div className="mt-6 pt-6 border-t border-gray-800">
          <p className="text-xs text-gray-500">Analyzed at Ghosted.gg</p>
        </div>
      </div>

      <div className="text-center mt-6 space-x-4">
        <button
          onClick={downloadCard}
          className="spooky-button px-6 py-3 text-sm font-bold text-orange-400"
        >
          📸 Capture Spirit
        </button>
      </div>
    </div>
  )
}
