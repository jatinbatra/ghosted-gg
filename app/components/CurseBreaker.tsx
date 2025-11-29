'use client'

import { useState, useEffect } from 'react'

export default function CurseBreaker() {
  const [stats, setStats] = useState({
    totalAutopsies: 0,
    avgGhostingProb: 0,
    improvement: 0,
    streak: 0
  })

  useEffect(() => {
    const graveyard = localStorage.getItem('ghosted_graveyard')
    if (graveyard) {
      const graves = JSON.parse(graveyard)
      const total = graves.length
      const avg = graves.reduce((sum: number, g: any) => sum + g.ghostingProb, 0) / total
      
      // Calculate improvement (compare first vs last 3)
      if (total >= 6) {
        const first3 = graves.slice(-3).reduce((sum: number, g: any) => sum + g.ghostingProb, 0) / 3
        const last3 = graves.slice(0, 3).reduce((sum: number, g: any) => sum + g.ghostingProb, 0) / 3
        const improvement = first3 - last3
        
        setStats({
          totalAutopsies: total,
          avgGhostingProb: Math.round(avg),
          improvement: Math.round(improvement),
          streak: improvement > 0 ? 3 : 0
        })
      } else {
        setStats({
          totalAutopsies: total,
          avgGhostingProb: Math.round(avg),
          improvement: 0,
          streak: 0
        })
      }
    }
  }, [])

  const getCurseStatus = () => {
    if (stats.avgGhostingProb < 30) return { text: 'CURSE BROKEN! 🎉', color: 'text-green-500' }
    if (stats.avgGhostingProb < 50) return { text: 'CURSE WEAKENING 💪', color: 'text-yellow-500' }
    if (stats.avgGhostingProb < 70) return { text: 'STILL CURSED 😬', color: 'text-orange-500' }
    return { text: 'HEAVILY CURSED ☠️', color: 'text-red-500' }
  }

  const status = getCurseStatus()

  return (
    <div className="ghost-card p-6 border-4 border-purple-500">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🔮</div>
        <h3 className="text-2xl font-bold text-purple-500 mb-2">
          CURSE BREAKER
        </h3>
        <p className="text-gray-400">Track your journey to dating redemption</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-purple-950 bg-opacity-30 border border-purple-500 rounded">
          <div className="text-3xl font-bold text-purple-400">{stats.totalAutopsies}</div>
          <div className="text-xs text-gray-400 mt-1">AUTOPSIES</div>
        </div>
        
        <div className="text-center p-4 bg-purple-950 bg-opacity-30 border border-purple-500 rounded">
          <div className="text-3xl font-bold text-purple-400">{stats.avgGhostingProb}%</div>
          <div className="text-xs text-gray-400 mt-1">AVG GHOSTING</div>
        </div>
        
        <div className="text-center p-4 bg-purple-950 bg-opacity-30 border border-purple-500 rounded">
          <div className={`text-3xl font-bold ${stats.improvement > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {stats.improvement > 0 ? '+' : ''}{stats.improvement}%
          </div>
          <div className="text-xs text-gray-400 mt-1">IMPROVEMENT</div>
        </div>
        
        <div className="text-center p-4 bg-purple-950 bg-opacity-30 border border-purple-500 rounded">
          <div className="text-3xl font-bold text-purple-400">{stats.streak}</div>
          <div className="text-xs text-gray-400 mt-1">STREAK</div>
        </div>
      </div>

      <div className="text-center p-6 bg-black bg-opacity-50 border-2 border-purple-500 rounded">
        <div className={`text-3xl font-bold ${status.color} mb-2`}>
          {status.text}
        </div>
        <p className="text-gray-400 text-sm">
          {stats.totalAutopsies < 3 
            ? 'Analyze more conversations to track your progress'
            : stats.improvement > 10
            ? 'You\'re learning! Keep applying the tips.'
            : stats.improvement > 0
            ? 'Slight improvement. Stay consistent.'
            : 'Review the dating coach advice and try again.'}
        </p>
      </div>
    </div>
  )
}
