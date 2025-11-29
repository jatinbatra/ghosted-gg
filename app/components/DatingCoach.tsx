'use client'

import { useState } from 'react'

interface DatingCoachProps {
  result: any
  originalMessages: Array<{ sender: string; text: string }>
}

export default function DatingCoach({ result, originalMessages }: DatingCoachProps) {
  const [showAlternate, setShowAlternate] = useState(false)

  // Generate better responses
  const generateBetterResponses = () => {
    const myMessages = originalMessages.filter(m => m.sender === 'me')
    const improvements: any[] = []

    myMessages.forEach((msg, idx) => {
      let betterVersion = msg.text
      let tip = ''

      // Fix double texting
      if (idx > 0 && myMessages[idx - 1]) {
        const prevMsg = originalMessages[originalMessages.indexOf(msg) - 1]
        if (prevMsg.sender === 'me') {
          tip = '❌ Double texting detected - Wait for their response'
          betterVersion = '[Wait for their reply before sending this]'
        }
      }

      // Fix gym mentions
      if (msg.text.toLowerCase().match(/gym|workout|fitness|gains|legs/)) {
        tip = '❌ Unsolicited gym flex - Keep it casual'
        betterVersion = msg.text.replace(/gym|workout|fitness|gains|legs/gi, 'relaxing')
      }

      // Fix interview mode
      if (msg.text.includes('?') && msg.text.split(' ').length < 8) {
        tip = '❌ Closed question - Ask open-ended questions'
        betterVersion = msg.text.replace('?', '? What do you think about it?')
      }

      // Fix low energy
      if (msg.text.length < 20 && !msg.text.includes('?')) {
        tip = '❌ Low effort response - Show more enthusiasm'
        betterVersion = msg.text + '! That sounds interesting, tell me more about it'
      }

      if (tip) {
        improvements.push({
          original: msg.text,
          better: betterVersion,
          tip: tip,
          index: originalMessages.indexOf(msg)
        })
      }
    })

    return improvements
  }

  const improvements = generateBetterResponses()

  // Calculate scores
  const rizzScore = Math.max(0, 100 - result.ghosting_probability)
  const energyScore = result.message_pattern.dominant_speaker === 'balanced' ? 85 : 45
  const questionScore = result.red_flags.includes('No follow-up questions - zero curiosity') ? 20 : 70
  const emojiScore = result.red_flags.includes('Emoji overload') ? 30 : 75

  return (
    <div className="space-y-8 mt-12">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-orange-500 mb-2" style={{ fontFamily: 'Creepster, cursive' }}>
          🎓 AI DATING COACH
        </h2>
        <p className="text-gray-400">Let's fix your game</p>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="ghost-card p-4 text-center">
          <div className="text-3xl font-bold text-orange-500">{rizzScore}</div>
          <div className="text-xs text-gray-400 mt-1">RIZZ SCORE</div>
        </div>
        <div className="ghost-card p-4 text-center">
          <div className="text-3xl font-bold text-orange-500">{energyScore}</div>
          <div className="text-xs text-gray-400 mt-1">ENERGY MATCH</div>
        </div>
        <div className="ghost-card p-4 text-center">
          <div className="text-3xl font-bold text-orange-500">{questionScore}</div>
          <div className="text-xs text-gray-400 mt-1">QUESTION QUALITY</div>
        </div>
        <div className="ghost-card p-4 text-center">
          <div className="text-3xl font-bold text-orange-500">{emojiScore}</div>
          <div className="text-xs text-gray-400 mt-1">EMOJI USAGE</div>
        </div>
      </div>

      {/* What Went Wrong */}
      <div className="ghost-card p-6">
        <h3 className="text-xl font-bold text-red-500 mb-4">🔥 What Went Wrong</h3>
        <div className="space-y-3">
          {result.red_flags.slice(0, 3).map((flag: string, idx: number) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-red-950 bg-opacity-30 border-l-4 border-red-500">
              <span className="text-2xl">❌</span>
              <div>
                <p className="text-orange-200 font-semibold">{flag}</p>
                <p className="text-gray-400 text-sm mt-1">
                  {getExplanation(flag)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Tips */}
      <div className="ghost-card p-6">
        <h3 className="text-xl font-bold text-green-500 mb-4">✅ How to Fix It</h3>
        <div className="space-y-3">
          {getTips(result.red_flags).map((tip: string, idx: number) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-green-950 bg-opacity-20 border-l-4 border-green-500">
              <span className="text-2xl">💡</span>
              <p className="text-gray-200">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Alternate Reality Button */}
      {improvements.length > 0 && (
        <div className="text-center">
          <button
            onClick={() => setShowAlternate(!showAlternate)}
            className="spooky-button px-8 py-4 text-lg font-bold text-orange-400"
          >
            {showAlternate ? '🔙 Hide' : '🔮 Show'} Alternate Reality
          </button>
        </div>
      )}

      {/* Alternate Reality Comparison */}
      {showAlternate && improvements.length > 0 && (
        <div className="ghost-card p-6 border-4 border-purple-500">
          <h3 className="text-2xl font-bold text-purple-400 mb-4 text-center">
            🔮 ALTERNATE REALITY: What You Should Have Said
          </h3>
          <p className="text-gray-400 text-center mb-6">
            Here's how this conversation could have gone...
          </p>
          
          <div className="space-y-6">
            {improvements.map((imp, idx) => (
              <div key={idx} className="space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Original */}
                  <div className="p-4 bg-red-950 bg-opacity-30 border-2 border-red-500 rounded">
                    <div className="text-xs text-red-400 font-bold mb-2">❌ WHAT YOU SAID</div>
                    <p className="text-gray-200">{imp.original}</p>
                  </div>
                  
                  {/* Better */}
                  <div className="p-4 bg-green-950 bg-opacity-30 border-2 border-green-500 rounded">
                    <div className="text-xs text-green-400 font-bold mb-2">✅ WHAT YOU SHOULD SAY</div>
                    <p className="text-gray-200">{imp.better}</p>
                  </div>
                </div>
                
                <div className="text-sm text-orange-400 italic pl-4">
                  {imp.tip}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Final Wisdom */}
      <div className="ghost-card p-8 text-center border-4 border-orange-500">
        <div className="text-5xl mb-4">🧙‍♂️</div>
        <h3 className="text-2xl font-bold text-orange-500 mb-3">Dating Wisdom</h3>
        <p className="text-gray-200 text-lg leading-relaxed max-w-2xl mx-auto">
          {getFinalWisdom(result.ghosting_probability)}
        </p>
      </div>
    </div>
  )
}

function getExplanation(flag: string): string {
  const explanations: Record<string, string> = {
    'Double-texting detected': 'Sending multiple messages without a response signals desperation and neediness.',
    'One-sided conversation - you dominate': 'You\'re doing all the talking. Conversations should be balanced.',
    'Energy mismatch - you write essays, they write texts': 'You\'re investing way more effort than they are. Match their energy.',
    'No follow-up questions - zero curiosity': 'They\'re not asking about you. That\'s a sign they\'re not interested.',
    'Unsolicited gym flex': 'Nobody asked about your workout. Keep fitness talk for when they show interest.',
    'Interview mode - interrogating them': 'Too many questions feels like an interrogation. Make statements too.',
    'Dry responses - minimal effort': 'One-word replies mean they\'re not engaged. Time to move on.',
  }
  
  for (const key in explanations) {
    if (flag.includes(key) || key.includes(flag.slice(0, 20))) {
      return explanations[key]
    }
  }
  
  return 'This pattern typically indicates low interest or poor conversation dynamics.'
}

function getTips(redFlags: string[]): string[] {
  const tips: string[] = []
  
  if (redFlags.some(f => f.includes('Double-texting'))) {
    tips.push('Wait at least 2-4 hours before sending another message if they haven\'t responded.')
  }
  
  if (redFlags.some(f => f.includes('Energy mismatch'))) {
    tips.push('Mirror their message length and enthusiasm. If they send 5 words, you send 5-10 words.')
  }
  
  if (redFlags.some(f => f.includes('Interview mode'))) {
    tips.push('Use the 2:1 ratio - For every 2 questions you ask, make 1 statement about yourself.')
  }
  
  if (redFlags.some(f => f.includes('gym') || f.includes('workout'))) {
    tips.push('Only talk about fitness if they bring it up first or it\'s relevant to the conversation.')
  }
  
  if (redFlags.some(f => f.includes('No follow-up'))) {
    tips.push('If they\'re not asking questions back, they\'re not interested. Move on gracefully.')
  }
  
  if (tips.length === 0) {
    tips.push('Keep conversations light, fun, and balanced. Ask open-ended questions.')
    tips.push('Show genuine interest but don\'t be overeager. Play it cool.')
  }
  
  return tips
}

function getFinalWisdom(ghostingProb: number): string {
  if (ghostingProb > 80) {
    return 'Sometimes the best move is to walk away. Not everyone is meant to vibe with you, and that\'s okay. Focus on people who match your energy.'
  } else if (ghostingProb > 50) {
    return 'You can recover from this, but you need to change your approach. Be more playful, less serious, and match their energy level.'
  } else {
    return 'You\'re doing pretty well! Just fine-tune a few things and you\'ll be golden. Keep being yourself, but be the best version.'
  }
}
