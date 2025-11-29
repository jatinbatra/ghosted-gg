'use client'

import { useState } from 'react'

interface SeanceModeProps {
  result: any
}

const SPIRIT_GUIDES = [
  {
    name: 'The Phantom of Romance',
    emoji: '👻',
    personality: 'Ghostly love expert from beyond',
    advice: (result: any) => {
      if (result.ghosting_probability > 70) {
        return "From the realm of lost love, I warn you... This soul has already departed. They walk among the emotionally unavailable. Release them to the void, lest you join them in eternal longing."
      }
      return "The spirits whisper ancient truths: Love must be reciprocal, or it becomes a curse. If their energy does not match yours, they are but a phantom in your life. Banish them."
    }
  },
  {
    name: 'The Reaper of Rizz',
    emoji: '💀',
    personality: 'Death himself, master of attraction',
    advice: (result: any) => {
      if (result.red_flags.some((f: string) => f.includes('Double-texting'))) {
        return "I have claimed many souls who chased too eagerly. Desperation is the scent of death. Pull back into the shadows. Let them wonder if you still walk this earth. Mystery is power."
      }
      return "I have witnessed eons of courtship. The living who bore others are swiftly taken. Be unpredictable. Be dangerous. Be the darkness they cannot resist."
    }
  },
  {
    name: 'The Crypt Keeper',
    emoji: '⚰️',
    personality: 'Ancient guardian of dating wisdom',
    advice: (result: any) => {
      return "I have guarded these tombs for centuries, watching lovers come and go. Heed my warning: Those who do not value your time shall be buried in the graveyard of forgotten connections. Move on, before you join them."
    }
  },
  {
    name: 'The Witch of Truth',
    emoji: '🧙‍♀️',
    personality: 'Brutally honest sorceress',
    advice: (result: any) => {
      if (result.ghosting_probability > 80) {
        return "My crystal ball shows no future here. They care not for you. This is a curse you must break yourself. Delete their number. Burn sage. Move on, or be hexed with eternal pining."
      }
      return "I cast a truth spell upon you: Stop making excuses for the living who treat you like the dead. You deserve a love that doesn't require necromancy to revive."
    }
  },
  {
    name: 'The Vampire of Hope',
    emoji: '🧛',
    personality: 'Immortal optimist',
    advice: (result: any) => {
      return "I have lived for centuries, and I promise you this: Every rejection is the universe protecting you from a mortal wound. Your eternal soulmate awaits. This ghost was merely a distraction from your destiny."
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
        <h3 className="text-2xl font-bold text-purple-500 mb-2" style={{ fontFamily: 'Creepster, cursive' }}>
          SÉANCE MODE
        </h3>
        <p className="text-gray-400">
          Channel the spirits of the dead for forbidden wisdom
        </p>
        <p className="text-purple-500 text-xs mt-2">
          ⚠️ The veil between worlds grows thin...
        </p>
      </div>

      {isChanneling && (
        <div className="text-center py-12 relative">
          <div className="absolute inset-0 bg-purple-900 opacity-10 animate-pulse"></div>
          <div className="text-6xl mb-4 animate-float">👻</div>
          <p className="text-purple-400 text-lg font-bold">Channeling the spirits...</p>
          <p className="text-gray-500 text-sm mt-2">🕯️ The dead are speaking... 🕯️</p>
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      )}

      {!isChanneling && selectedSpirit === null && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SPIRIT_GUIDES.map((spirit, index) => (
            <button
              key={index}
              onClick={() => summonSpirit(index)}
              className="p-6 bg-purple-950 bg-opacity-30 border-2 border-purple-500 rounded hover:bg-purple-900 hover:scale-105 transition-all text-left relative group"
            >
              <div className="absolute inset-0 bg-purple-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="text-4xl mb-2">{spirit.emoji}</div>
              <div className="text-lg font-bold text-purple-400 mb-1">
                {spirit.name}
              </div>
              <div className="text-xs text-gray-500 italic">{spirit.personality}</div>
              <div className="text-xs text-purple-600 mt-2">Click to summon →</div>
            </button>
          ))}
        </div>
      )}

      {!isChanneling && selectedSpirit !== null && (
        <div className="space-y-6 animate-fade-in">
          <div className="text-center p-6 bg-purple-950 bg-opacity-50 border-2 border-purple-500 rounded relative">
            <div className="absolute top-2 left-2 text-xs text-purple-600">🕯️</div>
            <div className="absolute top-2 right-2 text-xs text-purple-600">🕯️</div>
            <div className="text-6xl mb-4 animate-float">{SPIRIT_GUIDES[selectedSpirit].emoji}</div>
            <div className="text-2xl font-bold text-purple-400 mb-2" style={{ fontFamily: 'Creepster, cursive' }}>
              {SPIRIT_GUIDES[selectedSpirit].name}
            </div>
            <div className="text-sm text-gray-500 mb-4 italic">
              {SPIRIT_GUIDES[selectedSpirit].personality}
            </div>
            <div className="h-px bg-purple-500 w-24 mx-auto mb-4"></div>
            <div className="text-lg text-gray-200 leading-relaxed italic">
              "{SPIRIT_GUIDES[selectedSpirit].advice(result)}"
            </div>
            <div className="absolute bottom-2 left-2 text-xs text-purple-600">🕯️</div>
            <div className="absolute bottom-2 right-2 text-xs text-purple-600">🕯️</div>
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
