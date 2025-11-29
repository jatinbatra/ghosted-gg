'use client'

import { useState, useEffect } from 'react'

interface Message {
  sender: 'me' | 'them'
  text: string
}

interface AnimatedStoryProps {
  messages: Message[]
  analysis: any
  onComplete: () => void
}

export default function AnimatedStory({ messages, analysis, onComplete }: AnimatedStoryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [health, setHealth] = useState(100)
  const [showTyping, setShowTyping] = useState(false)
  const [redFlags, setRedFlags] = useState<string[]>([])
  const [isDead, setIsDead] = useState(false)
  const [shake, setShake] = useState(false)

  // Sound effects using Web Audio API
  const playSound = (type: 'message' | 'redflag' | 'heartbeat' | 'flatline') => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    switch(type) {
      case 'message':
        // Soft pop sound
        oscillator.frequency.value = 800
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.1)
        break
      
      case 'redflag':
        // Alarm sound
        oscillator.frequency.value = 440
        oscillator.type = 'square'
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
        break
      
      case 'heartbeat':
        // Heartbeat thump
        oscillator.frequency.value = 60
        oscillator.type = 'sine'
        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.2)
        break
      
      case 'flatline':
        // Long beep
        oscillator.frequency.value = 1000
        oscillator.type = 'sine'
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + 2)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2.5)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 2.5)
        break
    }
  }

  useEffect(() => {
    if (currentIndex >= messages.length) {
      // Conversation ended
      setTimeout(() => {
        setIsDead(true)
        playSound('flatline')
        setTimeout(onComplete, 3000)
      }, 1000)
      return
    }

    const message = messages[currentIndex]
    
    // Show typing indicator
    if (message.sender === 'them') {
      setShowTyping(true)
      setTimeout(() => {
        setShowTyping(false)
        revealMessage()
      }, 1500)
    } else {
      revealMessage()
    }

    function revealMessage() {
      setCurrentIndex(prev => prev + 1)
      
      // Play message sound
      playSound('message')
      
      // Calculate health drop
      const progressPercent = (currentIndex / messages.length) * 100
      const targetHealth = 100 - (analysis.ghosting_probability * (progressPercent / 100))
      const newHealth = Math.max(0, targetHealth)
      setHealth(newHealth)
      
      // Play heartbeat when health is low
      if (newHealth < 30 && newHealth > 0) {
        setTimeout(() => playSound('heartbeat'), 200)
      }
      
      // Show red flags at certain points
      if (currentIndex === Math.floor(messages.length * 0.3) && analysis.red_flags[0]) {
        triggerRedFlag(analysis.red_flags[0])
      }
      if (currentIndex === Math.floor(messages.length * 0.6) && analysis.red_flags[1]) {
        triggerRedFlag(analysis.red_flags[1])
      }
      if (currentIndex === Math.floor(messages.length * 0.9) && analysis.red_flags[2]) {
        triggerRedFlag(analysis.red_flags[2])
      }
    }
  }, [currentIndex, messages.length])

  const triggerRedFlag = (flag: string) => {
    setRedFlags(prev => [...prev, flag])
    setShake(true)
    playSound('redflag')
    setTimeout(() => setShake(false), 500)
  }

  const displayedMessages = messages.slice(0, currentIndex)

  // Start ambient spooky sound on mount
  useEffect(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Low frequency drone
    oscillator.frequency.value = 55
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime)
    
    oscillator.start()
    
    return () => {
      oscillator.stop()
      audioContext.close()
    }
  }, [])

  return (
    <div className={`fixed inset-0 bg-black z-50 flex flex-col ${shake ? 'animate-shake' : ''}`}>
      {/* Skip Button */}
      <button
        onClick={onComplete}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-red-900 border border-red-500 text-white text-sm tracking-wider hover:bg-red-800 transition-all"
      >
        SKIP ANIMATION →
      </button>

      {/* Health Bar */}
      <div className="p-4 bg-black bg-opacity-90 border-b-2 border-red-900">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="text-red-500 text-sm font-bold tracking-wider">CONVERSATION HEALTH</span>
            <div className="flex-1 h-8 bg-gray-900 border-2 border-red-900 relative overflow-hidden">
              <div 
                className="health-bar h-full transition-all duration-1000"
                style={{ width: `${health}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg z-10">{Math.round(health)}%</span>
              </div>
            </div>
            <div className="heartbeat text-3xl">
              {health > 50 ? '❤️' : health > 20 ? '💔' : '💀'}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
        <div className="space-y-4">
          {displayedMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} animate-message-in`}
            >
              <div
                className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
                  msg.sender === 'me'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-200'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {showTyping && (
            <div className="flex justify-start animate-message-in">
              <div className="bg-gray-800 px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="typing-dot"></div>
                  <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
                  <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Red Flags Overlay */}
      {redFlags.length > 0 && (
        <div className="fixed top-20 right-4 space-y-2 z-50">
          {redFlags.map((flag, idx) => (
            <div
              key={idx}
              className="red-flag-alert bg-red-900 bg-opacity-90 border-2 border-red-500 px-4 py-2 rounded text-white text-sm font-bold animate-slide-in"
            >
              🚩 {flag}
            </div>
          ))}
        </div>
      )}

      {/* Flatline Overlay */}
      {isDead && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 animate-fade-in">
          <div className="text-center">
            <div className="text-8xl mb-8 animate-float">💀</div>
            <h2 className="text-6xl font-bold text-red-500 mb-4" style={{ fontFamily: 'Creepster, cursive' }}>
              FLATLINE
            </h2>
            <p className="text-2xl text-gray-400">Time of Death: {new Date().toLocaleTimeString()}</p>
            <div className="mt-8">
              <svg width="400" height="100" viewBox="0 0 400 100" className="mx-auto">
                <path
                  d="M 0 50 L 100 50 L 120 20 L 140 80 L 160 50 L 400 50"
                  stroke="#ef4444"
                  strokeWidth="3"
                  fill="none"
                  className="flatline-animation"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
