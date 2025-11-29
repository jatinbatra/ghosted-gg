'use client'

import { useState } from 'react'

interface ZombieRevivalProps {
  result: any
  originalMessages: Array<{ sender: string; text: string }>
}

export default function ZombieRevival({ result, originalMessages }: ZombieRevivalProps) {
  const [revivalMessage, setRevivalMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [ritualStage, setRitualStage] = useState(0)

  const generateRevival = () => {
    setIsGenerating(true)
    setRitualStage(0)
    
    // Ritual stages
    const stages = [
      '🕯️ Lighting the candles...',
      '📖 Reading from the ancient texts...',
      '💀 Summoning the spirits...',
      '⚡ Channeling dark energy...',
      '🧟‍♂️ Raising the dead...'
    ]
    
    // Animate through ritual stages
    stages.forEach((_, index) => {
      setTimeout(() => setRitualStage(index + 1), index * 500)
    })
    
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
      setRitualStage(0)
    }, 3000)
  }

  const copyMessage = () => {
    navigator.clipboard.writeText(revivalMessage)
    alert('Copied! Good luck, zombie hunter 🧟')
  }

  return (
    <div className="ghost-card p-6 border-4 border-green-500 relative overflow-hidden">
      {/* Spooky background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-950 to-black opacity-20 pointer-events-none"></div>
      
      <div className="text-center mb-6 relative z-10">
        <div className="text-6xl mb-3 animate-float">🧟‍♂️</div>
        <h3 className="text-3xl font-bold text-green-500 mb-2" style={{ fontFamily: 'Creepster, cursive' }}>
          NECROMANCY RITUAL
        </h3>
        <p className="text-gray-400 text-sm">
          ⚠️ Attempt to raise this conversation from the dead ⚠️
        </p>
        <p className="text-green-500 text-xs mt-2">
          Success rate: {Math.max(5, 100 - result.ghosting_probability)}%
        </p>
      </div>

      {isGenerating && (
        <div className="text-center py-12 space-y-4">
          <div className="text-6xl animate-pulse">
            {ritualStage === 1 && '🕯️'}
            {ritualStage === 2 && '📖'}
            {ritualStage === 3 && '💀'}
            {ritualStage === 4 && '⚡'}
            {ritualStage === 5 && '🧟‍♂️'}
          </div>
          <p className="text-green-400 text-lg font-bold">
            {ritualStage === 1 && 'Lighting the candles...'}
            {ritualStage === 2 && 'Reading from the ancient texts...'}
            {ritualStage === 3 && 'Summoning the spirits...'}
            {ritualStage === 4 && 'Channeling dark energy...'}
            {ritualStage === 5 && 'Raising the dead...'}
          </p>
          <div className="flex justify-center gap-2">
            <div className={`w-3 h-3 rounded-full ${ritualStage >= 1 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
            <div className={`w-3 h-3 rounded-full ${ritualStage >= 2 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
            <div className={`w-3 h-3 rounded-full ${ritualStage >= 3 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
            <div className={`w-3 h-3 rounded-full ${ritualStage >= 4 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
            <div className={`w-3 h-3 rounded-full ${ritualStage >= 5 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
          </div>
        </div>
      )}

      {!revivalMessage && !isGenerating && (
        <div className="text-center space-y-4 relative z-10">
          <div className="mb-6">
            <div className="flex justify-center gap-4 mb-4">
              <div className="text-4xl">🕯️</div>
              <div className="text-4xl">💀</div>
              <div className="text-4xl">🕯️</div>
            </div>
          </div>
          
          <button
            onClick={generateRevival}
            disabled={isGenerating}
            className="spooky-button px-8 py-4 text-lg font-bold text-green-400 border-green-500 hover:bg-green-900 hover:scale-105 transition-all"
          >
            ⚡ BEGIN NECROMANCY RITUAL
          </button>
          
          {result.ghosting_probability > 85 && (
            <div className="p-4 bg-red-950 bg-opacity-50 border-2 border-red-500 rounded relative">
              <div className="absolute top-2 right-2 text-2xl animate-pulse">☠️</div>
              <p className="text-red-400 font-bold mb-2">⚠️ CURSED TERRITORY</p>
              <p className="text-gray-300 text-sm">
                Necromancy success rate: {Math.max(5, 100 - result.ghosting_probability)}%
                <br />
                The spirits warn: This corpse is too far gone. Revival may summon demons.
              </p>
            </div>
          )}
          
          {result.ghosting_probability <= 85 && result.ghosting_probability > 60 && (
            <div className="p-4 bg-orange-950 bg-opacity-50 border-2 border-orange-500 rounded relative">
              <div className="absolute top-2 right-2 text-2xl animate-pulse">🔥</div>
              <p className="text-orange-400 font-bold mb-2">⚠️ DARK MAGIC REQUIRED</p>
              <p className="text-gray-300 text-sm">
                Necromancy success rate: {100 - result.ghosting_probability}%
                <br />
                The ritual is dangerous. One attempt only. The dead don't like being disturbed.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in relative z-10">
          <div className="text-center mb-4">
            <div className="text-5xl mb-2">✨</div>
            <p className="text-green-500 font-bold text-sm">THE RITUAL WAS SUCCESSFUL</p>
          </div>
          
          {result.ghosting_probability <= 85 && (
            <div className="p-4 bg-purple-950 bg-opacity-50 border-2 border-purple-500 rounded mb-4">
              <p className="text-purple-400 text-sm font-bold mb-1">🔮 DARK WISDOM</p>
              <p className="text-gray-300 text-xs">
                {result.red_flags.some((f: string) => f.includes('Double-texting')) 
                  ? 'The spirits advise: Give them space. Desperation repels the living.'
                  : result.red_flags.some((f: string) => f.includes('Energy mismatch'))
                  ? 'The spirits advise: Mirror their energy. Balance is key to resurrection.'
                  : result.red_flags.some((f: string) => f.includes('Interview mode'))
                  ? 'The spirits advise: Stop interrogating. Make them curious about YOU.'
                  : 'The spirits advise: Acknowledge the silence. Confidence summons interest.'}
              </p>
            </div>
          )}
          
          <div className="p-6 bg-green-950 bg-opacity-50 border-2 border-green-500 rounded relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black px-3 py-1 border border-green-500 text-green-400 text-xs font-bold">
              RESURRECTION SPELL
            </div>
            <p className="text-gray-200 text-lg leading-relaxed mt-2">{revivalMessage}</p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={copyMessage}
              className="spooky-button px-6 py-3 text-sm font-bold text-green-400 hover:bg-green-900"
            >
              📜 Copy Spell
            </button>
            <button
              onClick={() => setRevivalMessage('')}
              className="spooky-button px-6 py-3 text-sm font-bold text-orange-400 hover:bg-orange-900"
            >
              🔄 Cast Again
            </button>
          </div>

          <div className="text-center text-red-400 text-xs mt-4 p-3 bg-red-950 bg-opacity-30 border border-red-900 rounded">
            <p className="font-bold mb-1">⚠️ NECROMANCER'S WARNING</p>
            <p>The dead don't always stay dead. Use this spell wisely, or face the consequences.</p>
          </div>
        </div>
      )}
    </div>
  )
}
