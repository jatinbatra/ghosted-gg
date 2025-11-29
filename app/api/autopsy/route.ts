import { NextRequest, NextResponse } from 'next/server'

interface Message {
  sender: 'me' | 'them'
  text: string
  timestamp?: number
}

function parseConversation(conversation: string): Message[] {
  const lines = conversation.split('\n').filter(line => line.trim())
  const messages: Message[] = []
  
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

function analyzeConversation(messages: Message[]) {
  const myMessages = messages.filter(m => m.sender === 'me')
  const theirMessages = messages.filter(m => m.sender === 'them')
  
  const redFlags: string[] = []
  let ghostingProbability = 0
  
  // Message pattern analysis
  const yourAvgLength = myMessages.length > 0 
    ? Math.round(myMessages.reduce((sum, m) => sum + m.text.length, 0) / myMessages.length)
    : 0
  const theirAvgLength = theirMessages.length > 0
    ? Math.round(theirMessages.reduce((sum, m) => sum + m.text.length, 0) / theirMessages.length)
    : 0
  
  // Detect double texting
  let maxConsecutive = 0
  let current = 0
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].sender === 'me') {
      current++
      maxConsecutive = Math.max(maxConsecutive, current)
    } else {
      current = 0
    }
  }
  
  const doubleTexting = maxConsecutive >= 3 ? 'high' : maxConsecutive === 2 ? 'medium' : 'low'
  if (maxConsecutive >= 2) {
    redFlags.push('Double-texting detected')
    ghostingProbability += 15
  }
  
  // Dominant speaker
  const dominantSpeaker = myMessages.length > theirMessages.length * 1.3 ? 'you' : 
                          theirMessages.length > myMessages.length * 1.3 ? 'them' : 'balanced'
  
  if (dominantSpeaker === 'you') {
    redFlags.push('One-sided conversation - you dominate')
    ghostingProbability += 20
  }
  
  // Tone analysis
  const warmWords = ['love', 'haha', 'lol', 'amazing', 'awesome', 'excited', '!', '😂', '❤️']
  const dryWords = ['k', 'ok', 'cool', 'nice', 'yeah', 'sure']
  
  const firstThree = theirMessages.slice(0, 3)
  const lastThree = theirMessages.slice(-3)
  
  const startWarmth = firstThree.reduce((count, m) => 
    count + warmWords.filter(w => m.text.toLowerCase().includes(w)).length, 0
  )
  const endWarmth = lastThree.reduce((count, m) => 
    count + warmWords.filter(w => m.text.toLowerCase().includes(w)).length, 0
  )
  
  const startDryness = firstThree.reduce((count, m) => 
    count + dryWords.filter(w => m.text.toLowerCase().trim() === w).length, 0
  )
  const endDryness = lastThree.reduce((count, m) => 
    count + dryWords.filter(w => m.text.toLowerCase().trim() === w).length, 0
  )
  
  const toneStart = startWarmth > 2 ? 'warm' : startDryness > 1 ? 'dry' : 'neutral'
  const toneEnd = endDryness > 1 ? 'ice cold' : endWarmth > 1 ? 'neutral' : 'dry'
  
  if (toneStart === 'warm' && toneEnd === 'ice cold') {
    redFlags.push('Dramatic tone shift - warm to ice cold')
    ghostingProbability += 25
  }
  
  // Interest slope
  const earlyEngagement = firstThree.reduce((sum, m) => sum + m.text.length, 0) / Math.max(firstThree.length, 1)
  const lateEngagement = lastThree.reduce((sum, m) => sum + m.text.length, 0) / Math.max(lastThree.length, 1)
  
  let interestSlope: string
  if (lateEngagement < earlyEngagement * 0.3) {
    interestSlope = 'collapsed'
    ghostingProbability += 30
  } else if (lateEngagement < earlyEngagement * 0.6) {
    interestSlope = 'dropping'
    ghostingProbability += 20
  } else if (lateEngagement > earlyEngagement * 1.2) {
    interestSlope = 'rising'
    ghostingProbability -= 10
  } else {
    interestSlope = 'stable'
  }
  
  // Energy mismatch
  if (yourAvgLength > theirAvgLength * 2) {
    redFlags.push('Energy mismatch - you write essays, they write texts')
    ghostingProbability += 15
  }
  
  // Dry responses
  if (endDryness > 1) {
    redFlags.push('Dry responses - minimal effort')
    ghostingProbability += 15
  }
  
  // No questions from them
  const theirQuestions = theirMessages.filter(m => m.text.includes('?')).length
  if (theirQuestions === 0 && theirMessages.length > 2) {
    redFlags.push('No follow-up questions - zero curiosity')
    ghostingProbability += 20
  }
  
  // Gym/workout mentions
  if (myMessages.some(m => m.text.toLowerCase().match(/gym|workout|legs|gains|fitness/))) {
    redFlags.push('Unsolicited gym flex')
    ghostingProbability += 10
  }
  
  // Interview mode
  const myQuestions = myMessages.filter(m => m.text.includes('?')).length
  if (myQuestions > myMessages.length * 0.6) {
    redFlags.push('Interview mode - interrogating them')
    ghostingProbability += 10
  }
  
  ghostingProbability = Math.max(0, Math.min(99, ghostingProbability))
  
  // Ghosting type
  let ghostingType: string
  if (theirMessages.length < 3) {
    ghostingType = 'hard cut'
  } else if (interestSlope === 'collapsed') {
    ghostingType = 'boredom drop'
  } else if (interestSlope === 'dropping' && toneEnd === 'ice cold') {
    ghostingType = 'slow fade'
  } else if (yourAvgLength > theirAvgLength * 2) {
    ghostingType = 'mismatch drift'
  } else {
    ghostingType = 'avoidant retreat'
  }
  
  // Timeline analysis
  const timelineAnalysis = []
  for (let i = 0; i < Math.min(messages.length, 10); i++) {
    const msg = messages[i]
    if (msg.sender === 'them') {
      if (dryWords.some(w => msg.text.toLowerCase().trim() === w)) {
        timelineAnalysis.push({
          message_index: i + 1,
          event: 'tone drop'
        })
      }
      if (warmWords.some(w => msg.text.toLowerCase().includes(w))) {
        timelineAnalysis.push({
          message_index: i + 1,
          event: 'enthusiasm spike'
        })
      }
    }
  }
  
  // Cause of death
  let causeOfDeath = ''
  if (redFlags.includes('Double-texting detected')) {
    causeOfDeath = 'Fatal double-text syndrome. Desperation detected and rejected.'
  } else if (redFlags.includes('Dramatic tone shift - warm to ice cold')) {
    causeOfDeath = 'Sudden cardiac arrest. They were interested, then they weren\'t.'
  } else if (redFlags.includes('Energy mismatch - you write essays, they write texts')) {
    causeOfDeath = 'Asymmetric investment. You cared too much, they cared too little.'
  } else if (redFlags.includes('No follow-up questions - zero curiosity')) {
    causeOfDeath = 'Conversational flatline. They never asked a single question.'
  } else if (redFlags.includes('Unsolicited gym flex')) {
    causeOfDeath = 'Nobody asked about your workout routine. Terminal cringe.'
  } else {
    causeOfDeath = 'Natural causes. Sometimes conversations just die.'
  }
  
  // Severity meter
  const severityMeter = ghostingProbability > 80 ? '💀💀💀💀💀' :
                        ghostingProbability > 60 ? '💀💀💀💀' :
                        ghostingProbability > 40 ? '💀💀💀' :
                        ghostingProbability > 20 ? '💀💀' : '💀'
  
  // Verdict
  const verdict = ghostingProbability > 70
    ? 'DECEASED. This conversation is clinically dead. Time of death: approximately when they stopped replying with full sentences.'
    : ghostingProbability > 40
    ? 'CRITICAL CONDITION. Conversation is on life support. Prognosis: grim.'
    : 'STABLE. Minor injuries detected. May recover with better energy.'
  
  // Toxic friend comment
  const toxicComments = [
    'Bestie... they were never that into you. I tried to tell you.',
    'Girl/bro, read the room. They checked out three messages ago.',
    'The gym selfie? Really? We talked about this.',
    'You deserve someone who matches your energy. This ain\'t it.',
    'They\'re just not that into you. Delete the number.',
    'Stop texting them. Have some dignity.',
    'This is embarrassing. Move on.',
    'You can do better than someone who replies with "k".'
  ]
  const toxicFriendComment = toxicComments[Math.floor(Math.random() * toxicComments.length)]
  
  // Revival chance
  const revivalChance = Math.max(0, 100 - ghostingProbability - 20)
  
  // Recommended next move
  let recommendedNextMove = ''
  if (ghostingProbability > 70) {
    recommendedNextMove = 'Delete the thread. Block if necessary. Return to dating apps immediately.'
  } else if (ghostingProbability > 40) {
    recommendedNextMove = 'Wait 3-5 days. If they reach out, cool. If not, move on gracefully.'
  } else {
    recommendedNextMove = 'Send one more casual message. If they respond, great. If not, you have your answer.'
  }
  
  return {
    ghosting_probability: ghostingProbability,
    interest_slope: interestSlope,
    tone_shift: {
      start: toneStart,
      end: toneEnd
    },
    message_pattern: {
      your_avg_length: `${yourAvgLength} chars`,
      their_avg_length: `${theirAvgLength} chars`,
      your_reply_delay: 'N/A',
      their_reply_delay: 'N/A',
      double_texting: doubleTexting,
      dominant_speaker: dominantSpeaker
    },
    red_flags: redFlags.length > 0 ? redFlags : ['No major red flags detected'],
    ghosting_type: ghostingType,
    timeline_analysis: timelineAnalysis.slice(0, 5),
    cause_of_death: causeOfDeath,
    severity_meter: severityMeter,
    verdict: verdict,
    toxic_friend_comment: toxicFriendComment,
    revival_chance: revivalChance,
    recommended_next_move: recommendedNextMove
  }
}

export async function POST(request: NextRequest) {
  try {
    const { conversation } = await request.json()

    if (!conversation || typeof conversation !== 'string') {
      return NextResponse.json(
        { error: 'Invalid conversation provided' },
        { status: 400 }
      )
    }

    const messages = parseConversation(conversation)
    
    if (messages.length === 0) {
      return NextResponse.json(
        { error: 'Could not parse conversation. Use format like "Me: text" and "Her: text"' },
        { status: 400 }
      )
    }

    const result = analyzeConversation(messages)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Autopsy error:', error)
    return NextResponse.json(
      { error: 'Failed to perform autopsy', details: error.message },
      { status: 500 }
    )
  }
}
