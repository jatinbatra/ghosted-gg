'use client'

import { useState } from 'react'

interface SeanceModeProps {
  result: any
}

const SPIRIT_GUIDES = [
  {
    name: 'Dr. Love',
    emoji: '💕',
    personality: 'Romantic psychologist',
    advice: (result: any) => {
      if (result.ghosting_probability > 70) {
        return "Listen, darling. This person wasn't emotionally available. You deserve someone who's excited to text you back. Don't chase someone who's running away."
      }
      return "The foundation of any relationship is reciprocity. If they're not matching your energy, they're showing you who they are. Believe them."
    }
  },
  {
    name: 'The Rizz Master',
    emoji: '😎',
    personality: 'Charisma coach',
    advice: (result: any) => {
      if (result.red_flags.some((f: string) => f.includes('Double-texting'))) {
        return "Bro, you're coming on too strong. Rizz is about confidence, not desperation. Pull back, let them chase you a bit. Scarcity creates value."
      }
      return "Real rizz is about being genuinely interesting, not trying too hard. Be mysterious, be fun, be unpredictable. Boring = ghosted."
    }
  },
  {
    name: 'Grandma Wisdom',
    emoji: '👵',
    personality: 'Old-school dating advice',
    advice: (result: any) => {
      return "In my day, we didn't have all these text messages. But one thing hasn't changed: if someone wants to be with you, they'll make time. Don't waste your youth on someone who doesn't appreciate you, dear."
    }
  },
  {
    name: 'The Savage',
    emoji: '🔥',
    personality: 'Brutally honest friend',
    advice: (result: any) => {
      if (result.ghosting_probability > 80) {
        return "They're just not that into you. Period. Stop analyzing every word. Delete the thread, hit the gym, and move on. You're embarrassing yourself."
      }
      return "You're overthinking this. If they wanted to talk to you, they would. Stop making excuses for people who don't care. Have some self-respect."
    }
  },
  {
    name: 'The Optimist',
    emoji: '🌟',
    personality: 'Positive mindset coach',
    advice: (result: any) => {
      return "Every rejection is redirection! This person wasn't your person. The universe is protecting you from something that wasn't meant to be. Your perfect match is out there, and they'll be excited to text you back!"
    }
  }
]

export default function SeanceMode({ result }: SeanceModeProps) {
  const [selectedSpirit, setSelectedSpirit] = useState<number | null>(null)
  const [isChanneling, setIsChanneling] = useState(false)

  const summonSpirit = (index: number) => {
    setIsChanneling(true)
    setTimeout(() => {
      setSelectedSpirit(index)
      setIsChanneling(false)
    }, 2000)
  }

  return (
    <div className="ghost-card p-6 border-4 border-purple-500">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🔮</div>
        <h3 className="text-2xl font-bold text-purple-500 mb-2">
          SÉANCE MODE
        </h3>
        <p className="text-gray-400">
          Summon the spirits of dating experts for guidance
        </p>
      </div>

      {isChanneling && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 animate-pulse">👻</div>
          <p className="text-purple-400 text-lg">Channeling the spirits...</p>
          <p className="text-gray-500 text-sm mt-2">The veil between worlds grows thin...</p>
        </div>
      )}

      {!isChanneling && selectedSpirit === null && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SPIRIT_GUIDES.map((spirit, index) => (
            <button
              key={index}
              onClick={() => summonSpirit(index)}
              className="p-6 bg-purple-950 bg-opacity-30 border-2 border-purple-500 rounded hover:bg-purple-900 hover:scale-105 transition-all text-left"
            >
              <div className="text-4xl mb-2">{spirit.emoji}</div>
              <div className="text-lg font-bold text-purple-400 mb-1">
                {spirit.name}
              </div>
              <div className="text-xs text-gray-400">{spirit.personality}</div>
            </button>
          ))}
        </div>
      )}

      {!isChanneling && selectedSpirit !== null && (
        <div className="space-y-6 animate-fade-in">
          <div className="text-center p-6 bg-purple-950 bg-opacity-50 border-2 border-purple-500 rounded">
            <div className="text-6xl mb-4">{SPIRIT_GUIDES[selectedSpirit].emoji}</div>
            <div className="text-2xl font-bold text-purple-400 mb-2">
              {SPIRIT_GUIDES[selectedSpirit].name}
            </div>
            <div className="text-sm text-gray-400 mb-4">
              {SPIRIT_GUIDES[selectedSpirit].personality}
            </div>
            <div className="text-lg text-gray-200 leading-relaxed italic">
              "{SPIRIT_GUIDES[selectedSpirit].advice(result)}"
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setSelectedSpirit(null)}
              className="spooky-button px-6 py-3 text-sm font-bold text-purple-400"
            >
              🔮 Summon Another Spirit
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
