'use client'

import { useState, useEffect } from 'react'

interface LeaderboardEntry {
  id: string
  ghostingProb: number
  causeOfDeath: string
  severity: string
  timestamp: number
}

export default function HauntedLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'alltime'>('week')

  useEffect(() => {
    // Load from localStorage (in production, this would be a backend API)
    const saved = localStorage.getItem('ghosted_leaderboard')
    if (saved) {
      const entries = JSON.parse(saved)
      filterByTimeframe(entries)
    } else {
      // SEED WITH STAFF PICKS
      const staffPicks: LeaderboardEntry[] = [
        {
          id: 'lead1',
          ghostingProb: 96,
          causeOfDeath: 'Sent "wyd" 11 times in one day. Clinically desperate.',
          severity: '💀💀💀💀💀',
          timestamp: Date.now() - 86400000
        },
        {
          id: 'lead2',
          ghostingProb: 93,
          causeOfDeath: 'Wrote a 500-word essay about feelings. They replied "cool".',
          severity: '💀💀💀💀💀',
          timestamp: Date.now() - 172800000
        },
        {
          id: 'lead3',
          ghostingProb: 91,
          causeOfDeath: 'Asked "are you mad at me?" 6 times. They were not mad. Now they are.',
          severity: '💀💀💀💀💀',
          timestamp: Date.now() - 259200000
        },
        {
          id: 'lead4',
          ghostingProb: 89,
          causeOfDeath: 'Mentioned crypto in first 3 messages. Terminal cringe.',
          severity: '💀💀💀💀',
          timestamp: Date.now() - 345600000
        },
        {
          id: 'lead5',
          ghostingProb: 87,
          causeOfDeath: 'Replied in 0.3 seconds every time. Came off as unemployed.',
          severity: '💀💀💀💀',
          timestamp: Date.now() - 432000000
        }
      ]
      const filtered = staffPicks
      setLeaderboard(filtered)
      localStorage.setItem('ghosted_leaderboard', JSON.stringify(staffPicks))
    }
  }, [timeframe])

  const filterByTimeframe = (entries: LeaderboardEntry[]) => {
    const now = Date.now()
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000
    const monthAgo = now - 30 * 24 * 60 * 60 * 1000

    let filtered = entries
    if (timeframe === 'week') {
      filtered = entries.filter((e: LeaderboardEntry) => e.timestamp > weekAgo)
    } else if (timeframe === 'month') {
      filtered = entries.filter((e: LeaderboardEntry) => e.timestamp > monthAgo)
    }

    // Sort by ghosting probability (highest first)
    filtered.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.ghostingProb - a.ghostingProb)
    setLeaderboard(filtered.slice(0, 10))
  }

  const addToLeaderboard = (entry: LeaderboardEntry) => {
    const saved = localStorage.getItem('ghosted_leaderboard')
    const entries = saved ? JSON.parse(saved) : []
    const updated = [...entries, entry]
    localStorage.setItem('ghosted_leaderboard', JSON.stringify(updated))
  }

  const getRank = (index: number) => {
    const medals = ['🥇', '🥈', '🥉']
    return medals[index] || `#${index + 1}`
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 spooky-button px-4 py-3 text-sm font-bold text-red-400 animate-pulse"
      >
        👑 Hall of Shame ({leaderboard.length + 89})
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold text-red-500 mb-2" style={{ fontFamily: 'Creepster, cursive' }}>
              👑 HAUNTED LEADERBOARD
            </h2>
            <p className="text-gray-400">Hall of Shame - Worst Ghostings</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Timeframe Selector */}
        <div className="flex gap-4 mb-6 justify-center">
          <button
            onClick={() => setTimeframe('week')}
            className={`spooky-button px-4 py-2 text-sm ${
              timeframe === 'week' ? 'border-red-500 bg-red-900 bg-opacity-30' : ''
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`spooky-button px-4 py-2 text-sm ${
              timeframe === 'month' ? 'border-red-500 bg-red-900 bg-opacity-30' : ''
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeframe('alltime')}
            className={`spooky-button px-4 py-2 text-sm ${
              timeframe === 'alltime' ? 'border-red-500 bg-red-900 bg-opacity-30' : ''
            }`}
          >
            All Time
          </button>
        </div>

        {leaderboard.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👻</div>
            <p className="text-gray-400">No entries yet...</p>
            <p className="text-gray-500 text-sm mt-2">Be the first to make the hall of shame!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.id}
                className={`ghost-card p-6 flex items-center gap-6 ${
                  index < 3 ? 'border-4 border-red-500' : ''
                }`}
              >
                <div className="text-5xl">{getRank(index)}</div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="text-3xl font-bold text-red-500">
                      {entry.ghostingProb}%
                    </div>
                    <div className="text-2xl">{entry.severity}</div>
                  </div>
                  <p className="text-gray-300 italic">"{entry.causeOfDeath}"</p>
                </div>

                {index === 0 && (
                  <div className="text-yellow-500 text-sm font-bold">
                    WORST OF THE {timeframe.toUpperCase()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center text-gray-500 text-xs">
          <p>🔒 All entries are anonymous. Your secrets are safe with us.</p>
        </div>
      </div>
    </div>
  )
}

// Export function to add entries
export function useLeaderboard() {
  return {
    addToLeaderboard: (result: any) => {
      const entry: LeaderboardEntry = {
        id: Date.now().toString(),
        ghostingProb: result.ghosting_probability,
        causeOfDeath: result.cause_of_death,
        severity: result.severity_meter,
        timestamp: Date.now()
      }
      
      const saved = localStorage.getItem('ghosted_leaderboard')
      const entries = saved ? JSON.parse(saved) : []
      const updated = [...entries, entry]
      localStorage.setItem('ghosted_leaderboard', JSON.stringify(updated))
    }
  }
}
