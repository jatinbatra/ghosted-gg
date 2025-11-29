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
    
    // Generate contextual comeback message based on red flags
    setTimeout(() => {
      const lastTheirMessage = originalMessages.filter(m => m.sender === 'them').slice(-1)[0]?.text || ''
      
      let message = ''
      let strategy = ''
      
      // Analyze what went wrong and craft appropriate response
      if (result.ghosting_probability > 85) {
        strategy = '⚠️ CRITICAL: This is likely unrecoverable. Consider moving on.'
        message = "Honestly? Let this one go. They've shown you who they are. Your energy is better spent elsewhere."
      } else if (result.red_flags.some((f: string) => f.includes('Double-texting'))) {
        strategy = '💡 Strategy: Give space, be casual, no pressure'
        message = `No worries if you're busy! Just wanted to say ${lastTheirMessage ? 'that thing you mentioned sounds cool' : 'hey'}. Hit me up if you ever want to chat 👋`
      } else if (result.red_flags.some((f: string) => f.includes('gym') || f.includes('workout'))) {
        strategy = '💡 Strategy: Shift to their interests, be playful'
        message = "Lol I realize I was rambling about random stuff. What have you been up to that's actually interesting? 😅"
      } else if (result.red_flags.some((f: string) => f.includes('Energy mismatch'))) {
        strategy = '💡 Strategy: Match their vibe, keep it short'
        message = lastTheirMessage.length < 30 
          ? "Hey! Been thinking about grabbing coffee. You down?" 
          : "Just saw this! Would love to continue this conversation over coffee if you're free?"
      } else if (result.red_flags.some((f: string) => f.includes('Interview mode'))) {
        strategy = '💡 Strategy: Make a statement, be interesting'
        message = "Just had the craziest day - reminded me of what you said earlier. Want to hear about it over drinks?"
      } else if (result.ghosting_probability > 60) {
        strategy = '💡 Strategy: Acknowledge the gap, be confident'
        message = "Hey! I know it's been a minute. No pressure at all, but I'd genuinely love to continue our conversation if you're interested 🙂"
      } else {
        strategy = '💡 Strategy: Light callback, suggest plans'
        message = lastTheirMessage 
          ? `Been thinking about what you said about ${lastTheirMessage.split(' ').slice(0, 3).join(' ')}... want to grab coffee and talk more about it?`
          : "Hey! Want to actually meet up instead of just texting? Coffee this week?"
      }
      
      setRevivalMessage(message)
      setIsGenerating(false)
    }, 2500)
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
        <div className="text-center space-y-4">
          <button
            onClick={generateRevival}
            disabled={isGenerating}
            className="spooky-button px-8 py-4 text-lg font-bold text-green-400 border-green-500"
          >
            {isGenerating ? '🔮 Analyzing conversation...' : '⚡ Generate Revival Message'}
          </button>
          
          {result.ghosting_probability > 85 && (
            <div className="p-4 bg-red-950 bg-opacity-30 border-2 border-red-500 rounded">
              <p className="text-red-400 font-bold mb-2">⚠️ DANGER ZONE</p>
              <p className="text-gray-300 text-sm">
                Revival chance: {100 - result.ghosting_probability}%
                <br />
                This conversation is clinically dead. Revival may cause further embarrassment.
              </p>
            </div>
          )}
          
          {result.ghosting_probability <= 85 && result.ghosting_probability > 60 && (
            <div className="p-4 bg-yellow-950 bg-opacity-30 border-2 border-yellow-500 rounded">
              <p className="text-yellow-400 font-bold mb-2">⚠️ PROCEED WITH CAUTION</p>
              <p className="text-gray-300 text-sm">
                Revival chance: {100 - result.ghosting_probability}%
                <br />
                One shot only. Make it count.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {result.ghosting_probability <= 85 && (
            <div className="p-4 bg-blue-950 bg-opacity-30 border-2 border-blue-500 rounded mb-4">
              <p className="text-blue-400 text-sm font-bold mb-1">💡 STRATEGY</p>
              <p className="text-gray-300 text-xs">
                {result.red_flags.some((f: string) => f.includes('Double-texting')) 
                  ? 'Give space, be casual, no pressure'
                  : result.red_flags.some((f: string) => f.includes('Energy mismatch'))
                  ? 'Match their vibe, keep it short'
                  : result.red_flags.some((f: string) => f.includes('Interview mode'))
                  ? 'Make a statement, be interesting'
                  : 'Acknowledge the gap, be confident'}
              </p>
            </div>
          )}
          
          <div className="p-6 bg-green-950 bg-opacity-30 border-2 border-green-500 rounded">
            <p className="text-gray-200 text-lg leading-relaxed">{revivalMessage}</p>
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
