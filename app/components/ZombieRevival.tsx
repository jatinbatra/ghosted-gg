'use client'

import { useState } from 'react'

interface ZombieRevivalProps {
  result: any
  originalMessages: Array<{ sender: string; text: string }>
}

export default function ZombieRevival({ result, originalMessages }: ZombieRevivalProps) {
  const [revivalMessage, setRevivalMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const generateRevival = () => {
    setIsGenerating(true)
    
    // Generate comeback message based on conversation context
    setTimeout(() => {
      const messages = [
        "Hey! Just saw this - been swamped lately. How's your week been?",
        "Lol sorry, my phone died and I forgot to charge it for like 3 days 😅 What's new with you?",
        "My bad for the late reply! Been thinking about what you said though. Want to grab coffee this week?",
        "Sorry for ghosting! Life got crazy. But I'd love to continue this conversation if you're down?",
        "Hey! I know it's been a minute. No pressure, but would love to hear how things are going with you.",
      ]
      
      // Pick based on ghosting probability
      let message = messages[0]
      if (result.ghosting_probability > 80) {
        message = "Sometimes the best move is to let it go. But if you must try: \"" + messages[4] + "\""
      } else if (result.ghosting_probability > 60) {
        message = messages[3]
      } else {
        message = messages[Math.floor(Math.random() * 3)]
      }
      
      setRevivalMessage(message)
      setIsGenerating(false)
    }, 2000)
  }

  const copyMessage = () => {
    navigator.clipboard.writeText(revivalMessage)
    alert('Copied! Good luck, zombie hunter 🧟')
  }

  return (
    <div className="ghost-card p-6 border-4 border-green-500">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🧟‍♂️</div>
        <h3 className="text-2xl font-bold text-green-500 mb-2">
          ZOMBIE REVIVAL
        </h3>
        <p className="text-gray-400">
          Resurrect this dead conversation from the grave
        </p>
      </div>

      {!revivalMessage ? (
        <div className="text-center">
          <button
            onClick={generateRevival}
            disabled={isGenerating}
            className="spooky-button px-8 py-4 text-lg font-bold text-green-400 border-green-500"
          >
            {isGenerating ? '🔮 Summoning...' : '⚡ Generate Revival Message'}
          </button>
          
          {result.ghosting_probability > 80 && (
            <p className="text-red-400 text-sm mt-4">
              ⚠️ Warning: Revival chance is very low. Proceed with caution.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-6 bg-green-950 bg-opacity-30 border-2 border-green-500 rounded">
            <p className="text-gray-200 text-lg">{revivalMessage}</p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={copyMessage}
              className="spooky-button px-6 py-3 text-sm font-bold text-green-400"
            >
              📋 Copy Message
            </button>
            <button
              onClick={() => setRevivalMessage('')}
              className="spooky-button px-6 py-3 text-sm font-bold text-orange-400"
            >
              🔄 Generate Another
            </button>
          </div>

          <div className="text-center text-gray-500 text-xs mt-4">
            <p>💀 Use at your own risk. Some conversations are better left dead.</p>
          </div>
        </div>
      )}
    </div>
  )
}
