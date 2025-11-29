'use client'

import { useState, useRef } from 'react'
import AutopsyResult from './components/AutopsyResult'
import GhostIcon from './components/GhostIcon'
import ECGLine from './components/ECGLine'
import SuggestedPrompts from './components/SuggestedPrompts'
import MobileInstructions from './components/MobileInstructions'
import FloatingGhosts from './components/FloatingGhosts'
import AnimatedStory from './components/AnimatedStory'
import DatingCoach from './components/DatingCoach'
import ShareCard from './components/ShareCard'
import DeathCertificate from './components/DeathCertificate'
import ZombieRevival from './components/ZombieRevival'
import CurseBreaker from './components/CurseBreaker'
import Graveyard, { useGraveyard } from './components/Graveyard'
import SeanceMode from './components/SeanceMode'
import HauntedLeaderboard, { useLeaderboard } from './components/HauntedLeaderboard'
import { createWorker } from 'tesseract.js'

export default function Home() {
  const [conversation, setConversation] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [inputMode, setInputMode] = useState<'text' | 'screenshot'>('text')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setConversation(text)
      setInputMode('text')
    } catch (error) {
      alert('Failed to paste from clipboard. Please paste manually.')
    }
  }

  const copyResults = async () => {
    if (!result) return
    
    const text = `🔬 GHOSTED.GG AUTOPSY REPORT

Ghosting Probability: ${result.ghosting_probability}%
Severity: ${result.severity_meter}

VERDICT:
${result.verdict}

CAUSE OF DEATH:
${result.cause_of_death}

INTEREST SLOPE: ${result.interest_slope}
TONE SHIFT: ${result.tone_shift.start} → ${result.tone_shift.end}

RED FLAGS:
${result.red_flags.map((flag: string) => `• ${flag}`).join('\n')}

YOUR TOXIC FRIEND SAYS:
"${result.toxic_friend_comment}"

REVIVAL CHANCE: ${result.revival_chance}%

RECOMMENDED NEXT MOVE:
${result.recommended_next_move}

---
Analyzed by Ghosted.gg`

    try {
      await navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    } catch (error) {
      alert('Failed to copy. Please copy manually.')
    }
  }

  const handleScreenshot = async (file: File) => {
    setLoading(true)
    setOcrProgress(0)

    try {
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100))
          }
        },
      })

      const { data: { text } } = await worker.recognize(file)
      await worker.terminate()

      setConversation(text)
      setOcrProgress(100)
    } catch (error) {
      console.error('OCR failed:', error)
      alert('Failed to read screenshot. Try typing the conversation instead.')
    } finally {
      setLoading(false)
    }
  }

  const [showAnimation, setShowAnimation] = useState(false)
  const [parsedMessages, setParsedMessages] = useState<any[]>([])
  const { addToGraveyard } = useGraveyard()
  const { addToLeaderboard } = useLeaderboard()

  const parseMessages = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim())
    const messages: any[] = []
    
    for (const line of lines) {
      const lower = line.toLowerCase()
      if (lower.startsWith('me:') || lower.startsWith('you:')) {
        messages.push({ sender: 'me', text: line.substring(line.indexOf(':') + 1).trim() })
      } else if (lower.match(/^(her:|him:|them:)/)) {
        messages.push({ sender: 'them', text: line.substring(line.indexOf(':') + 1).trim() })
      }
    }
    return messages
  }

  const performAutopsy = async () => {
    if (!conversation.trim()) {
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/autopsy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation }),
      })

      const data = await response.json()
      
      if (response.ok) {
        // Parse messages and show animation
        const messages = parseMessages(conversation)
        setParsedMessages(messages)
        setShowAnimation(true)
        
        // Store result and add to graveyard + leaderboard
        setResult(data)
        addToGraveyard(data)
        addToLeaderboard(data)
      }
    } catch (error) {
      console.error('Autopsy failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {showAnimation && result && (
        <AnimatedStory 
          messages={parsedMessages}
          analysis={result}
          onComplete={() => setShowAnimation(false)}
        />
      )}
      
      <FloatingGhosts />
      <Graveyard />
      <HauntedLeaderboard />
      <main className="min-h-screen p-6 md:p-12 relative z-10">
        <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 mt-8">
          <div className="flex justify-center mb-6">
            <GhostIcon />
          </div>
          <h1 className="horror-title text-6xl md:text-8xl mb-6 text-white">
            GHOSTED.GG
          </h1>
          <p className="subtitle-spooky text-2xl md:text-3xl mb-4">
            The Digital Morgue for Dead Conversations
          </p>
          <p className="text-gray-300 text-sm md:text-base mb-2 max-w-2xl mx-auto">
            Perform a full forensic autopsy on your ghosted chats. Watch them die in real-time, 
            discover the cause of death, and learn how to resurrect your dating game from the grave.
          </p>
          <p className="text-sm text-orange-500 mt-3 tracking-widest uppercase font-bold">
            ☠️ Kiroween 2025 Hackathon - Where Texts Go to Die ☠️
          </p>
        </div>

        {/* Mobile Instructions */}
        {!result && <MobileInstructions />}

        {/* Suggested Prompts */}
        {!result && (
          <SuggestedPrompts onSelect={(text) => {
            setConversation(text)
            setInputMode('text')
          }} />
        )}

        {/* Input Mode Toggle */}
        <div className="flex gap-3 mb-6 justify-center flex-wrap">
          <button
            onClick={() => setInputMode('text')}
            className={`spooky-button px-5 py-3 text-xs tracking-wider uppercase font-bold text-orange-400 ${
              inputMode === 'text' ? 'border-red-500 bg-red-900 bg-opacity-30' : ''
            }`}
          >
            ✍️ Scribe
          </button>
          <button
            onClick={pasteFromClipboard}
            className="spooky-button px-5 py-3 text-xs tracking-wider uppercase font-bold text-orange-400"
          >
            📜 Summon Text
          </button>
          <button
            onClick={() => setInputMode('screenshot')}
            className={`spooky-button px-5 py-3 text-xs tracking-wider uppercase font-bold text-orange-400 ${
              inputMode === 'screenshot' ? 'border-red-500 bg-red-900 bg-opacity-30' : ''
            }`}
          >
            📸 Capture
          </button>
        </div>

        {/* Input Section */}
        <div className="mb-8">
          <label className="block text-xs text-gray-400 mb-3 tracking-widest uppercase">
            {inputMode === 'text' ? '📜 Cursed Conversation' : '📸 Haunted Screenshot'}
          </label>
          
          {inputMode === 'text' ? (
            <textarea
              value={conversation}
              onChange={(e) => setConversation(e.target.value)}
              placeholder="Me: Hey! How's your week going?&#10;Her: Good!! You?&#10;Me: Pretty good, just finished legs at the gym.&#10;Her: Nicee&#10;Me: Wanna hang this weekend?"
              className="input-spooky w-full h-64 p-5 text-white resize-none font-mono text-sm"
              style={{ caretColor: '#ff0000' }}
            />
          ) : (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleScreenshot(file)
                }}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="w-full h-64 border-2 border-dashed border-orange-600 bg-black bg-opacity-50 flex flex-col items-center justify-center gap-4 hover:border-red-500 transition-all"
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-orange-600">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-orange-500 text-sm tracking-wider font-bold">
                  {loading ? `🔮 Extracting... ${ocrProgress}%` : '📸 Click to upload or take photo'}
                </span>
              </button>
              
              {conversation && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2 tracking-wider">👻 SUMMONED TEXT:</p>
                  <textarea
                    value={conversation}
                    onChange={(e) => setConversation(e.target.value)}
                    className="input-spooky w-full h-32 p-4 text-white resize-none font-mono text-xs"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Button */}
        <div className="mb-16">
          <button
            onClick={performAutopsy}
            disabled={loading || !conversation.trim()}
            className="btn-deadly w-full h-14 text-white font-bold flex items-center justify-center gap-3 text-lg relative z-10"
          >
            <span className="text-2xl">☠️</span>
            {loading ? '🔮 Summoning Spirits...' : '⚰️ PERFORM AUTOPSY'}
          </button>
        </div>

        {/* Results */}
        {result && !showAnimation && (
          <div className="animate-fade-in">
            <ECGLine />
            <AutopsyResult result={result} />
            
            {/* Dating Coach Section */}
            <DatingCoach result={result} originalMessages={parsedMessages} />
            
            {/* Zombie Revival */}
            <div className="mt-8">
              <ZombieRevival result={result} originalMessages={parsedMessages} />
            </div>
            
            {/* Death Certificate */}
            <div className="mt-8">
              <DeathCertificate result={result} />
            </div>
            
            {/* Curse Breaker */}
            <div className="mt-8">
              <CurseBreaker />
            </div>
            
            {/* Séance Mode */}
            <div className="mt-8">
              <SeanceMode result={result} />
            </div>
            
            {/* Share Card */}
            <ShareCard result={result} rizzScore={Math.max(0, 100 - result.ghosting_probability)} />
            
            {/* Action Buttons */}
            <div className="mt-8 flex gap-4 justify-center flex-wrap">
              <button
                onClick={copyResults}
                className="spooky-button px-6 py-3 text-sm tracking-wider uppercase font-bold text-orange-400"
              >
                📜 Copy Curse
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Ghosted.gg Autopsy Report',
                      text: `Ghosting Probability: ${result.ghosting_probability}% - ${result.verdict}`,
                      url: window.location.href
                    })
                  }
                }}
                className="spooky-button px-6 py-3 text-sm tracking-wider uppercase font-bold text-orange-400"
              >
                👻 Haunt Friends
              </button>
              <button
                onClick={() => {
                  setResult(null)
                  setConversation('')
                }}
                className="spooky-button px-6 py-3 text-sm tracking-wider uppercase font-bold text-orange-400 hover:border-red-500"
              >
                ⚰️ New Victim
              </button>
            </div>
          </div>
        )}
        </div>
      </main>
    </>
  )
}
