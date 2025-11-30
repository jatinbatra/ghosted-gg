import { NextRequest, NextResponse } from 'next/server'
import { analyzeConversationContext, generateContextInsights } from '@/lib/amplifier'

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
  
  // Detect double texting with context
  let maxConsecutive = 0
  let current = 0
  let doubleTextExamples: string[] = []
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].sender === 'me') {
      current++
      if (current === 2) {
        doubleTextExamples.push(messages[i].text.substring(0, 30))
      }
      maxConsecutive = Math.max(maxConsecutive, current)
    } else {
      current = 0
    }
  }
  
  const doubleTexting = maxConsecutive >= 3 ? 'high' : maxConsecutive === 2 ? 'medium' : 'low'
  if (maxConsecutive >= 3) {
    redFlags.push(`Triple-texted: "${doubleTextExamples[0]}..." - desperation detected`)
    ghostingProbability += 25
  } else if (maxConsecutive === 2) {
    redFlags.push('Double-texting detected')
    ghostingProbability += 15
  }
  
  // Dominant speaker
  const dominantSpeaker = myMessages.length > theirMessages.length * 1.5 ? 'you' : 
                          theirMessages.length > myMessages.length * 1.5 ? 'them' : 'balanced'
  
  if (dominantSpeaker === 'you' && myMessages.length > 5) {
    redFlags.push(`Sent ${myMessages.length} messages to their ${theirMessages.length} - one-sided`)
    ghostingProbability += 20
  }
  
  // Advanced tone analysis
  const warmWords = ['love', 'haha', 'lol', 'lmao', 'amazing', 'awesome', 'excited', 'omg', '!', '😂', '❤️', '😊', '💕', '🔥']
  const dryWords = ['k', 'ok', 'okay', 'cool', 'nice', 'yeah', 'yep', 'sure', 'alright']
  const deflectionWords = ['busy', 'tired', 'maybe', 'idk', 'whatever', 'i guess']
  
  const firstThree = theirMessages.slice(0, 3)
  const lastThree = theirMessages.slice(-3)
  
  const startWarmth = firstThree.reduce((count, m) => 
    count + warmWords.filter(w => m.text.toLowerCase().includes(w)).length, 0
  )
  const endWarmth = lastThree.reduce((count, m) => 
    count + warmWords.filter(w => m.text.toLowerCase().includes(w)).length, 0
  )
  
  const startDryness = firstThree.reduce((count, m) => 
    count + dryWords.filter(w => m.text.toLowerCase().trim() === w || m.text.toLowerCase().includes(w)).length, 0
  )
  const endDryness = lastThree.reduce((count, m) => 
    count + dryWords.filter(w => m.text.toLowerCase().trim() === w || m.text.toLowerCase().includes(w)).length, 0
  )
  
  const endDeflection = lastThree.reduce((count, m) => 
    count + deflectionWords.filter(w => m.text.toLowerCase().includes(w)).length, 0
  )
  
  const toneStart = startWarmth > 2 ? 'warm' : startDryness > 1 ? 'dry' : 'neutral'
  const toneEnd = endDryness > 2 || endDeflection > 1 ? 'ice cold' : endWarmth > 1 ? 'neutral' : 'dry'
  
  if (toneStart === 'warm' && toneEnd === 'ice cold') {
    const lastMsg = lastThree[lastThree.length - 1]?.text.substring(0, 40) || ''
    redFlags.push(`Went from warm to ice cold. Last message: "${lastMsg}..."`)
    ghostingProbability += 30
  }
  
  // Interest slope with specifics
  const earlyEngagement = firstThree.reduce((sum, m) => sum + m.text.length, 0) / Math.max(firstThree.length, 1)
  const lateEngagement = lastThree.reduce((sum, m) => sum + m.text.length, 0) / Math.max(lastThree.length, 1)
  
  let interestSlope: string
  if (lateEngagement < earlyEngagement * 0.3) {
    interestSlope = 'collapsed'
    redFlags.push(`Response length dropped ${Math.round((1 - lateEngagement/earlyEngagement) * 100)}% - interest died`)
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
  
  // Energy mismatch with examples
  if (yourAvgLength > theirAvgLength * 2.5 && yourAvgLength > 50) {
    const longMsg = myMessages.find(m => m.text.length > 100)?.text.substring(0, 50) || ''
    redFlags.push(`You write paragraphs (${yourAvgLength} chars), they write texts (${theirAvgLength} chars)`)
    ghostingProbability += 20
  }
  
  // Detect one-word responses
  const oneWordResponses = theirMessages.filter(m => m.text.trim().split(/\s+/).length === 1).length
  if (oneWordResponses > theirMessages.length * 0.4 && theirMessages.length > 3) {
    const examples = theirMessages.filter(m => m.text.trim().split(/\s+/).length === 1).slice(0, 2).map(m => m.text)
    redFlags.push(`${oneWordResponses} one-word responses: "${examples.join('", "')}"`)
    ghostingProbability += 25
  }
  
  // No questions from them - curiosity check
  const theirQuestions = theirMessages.filter(m => m.text.includes('?')).length
  if (theirQuestions === 0 && theirMessages.length > 3) {
    redFlags.push('Never asked a single question - zero curiosity about you')
    ghostingProbability += 25
  }
  
  // Response quality - do they actually engage with topics?
  let topicIgnores = 0
  for (let i = 0; i < messages.length - 1; i++) {
    if (messages[i].sender === 'me' && messages[i].text.includes('?') && messages[i + 1]?.sender === 'them') {
      const response = messages[i + 1].text.toLowerCase()
      if (dryWords.some(w => response.trim() === w) || response.length < 10) {
        topicIgnores++
      }
    }
  }
  
  if (topicIgnores > 2) {
    redFlags.push(`Ignored ${topicIgnores} of your questions with dry responses`)
    ghostingProbability += 20
  }
  
  // Cringe detection - specific awkward patterns
  const cringePatterns = [
    { pattern: /\b(m'lady|milady)\b/i, flag: 'Said "m\'lady" unironically' },
    { pattern: /\b(wyd|wbu)\b/i, flag: 'Sent "wyd" - the conversation killer' },
    { pattern: /\bsend (pic|pics|photo)\b/i, flag: 'Asked for pics too early' },
    { pattern: /\b(gym|workout|gains|protein|lifting)\b/i, flag: 'Unsolicited gym talk' },
    { pattern: /\b(nice guy|good guy)\b/i, flag: 'Called yourself a "nice guy"' },
    { pattern: /\b(females?|males?)\b/i, flag: 'Used "females/males" instead of women/men' },
    { pattern: /\bhey\s*\.{3,}/i, flag: 'Sent "hey..." with excessive dots' },
    { pattern: /\byou there\??\b/i, flag: 'Sent "you there?" - clingy energy' },
  ]
  
  for (const msg of myMessages) {
    for (const { pattern, flag } of cringePatterns) {
      if (pattern.test(msg.text)) {
        redFlags.push(flag)
        ghostingProbability += 15
        break
      }
    }
  }
  
  // Interview mode - too many questions
  const myQuestions = myMessages.filter(m => m.text.includes('?')).length
  if (myQuestions > myMessages.length * 0.7 && myMessages.length > 4) {
    redFlags.push(`Asked ${myQuestions} questions in ${myMessages.length} messages - interview mode`)
    ghostingProbability += 15
  }
  
  // Conversation flow - who drives topics?
  let youInitiatedTopics = 0
  let theyInitiatedTopics = 0
  const topicWords = ['so', 'anyway', 'btw', 'also', 'oh', 'speaking of']
  
  for (const msg of myMessages) {
    if (topicWords.some(w => msg.text.toLowerCase().startsWith(w))) {
      youInitiatedTopics++
    }
  }
  
  for (const msg of theirMessages) {
    if (topicWords.some(w => msg.text.toLowerCase().startsWith(w))) {
      theyInitiatedTopics++
    }
  }
  
  if (youInitiatedTopics > 3 && theyInitiatedTopics === 0) {
    redFlags.push('You drove all topics - they never initiated conversation')
    ghostingProbability += 15
  }
  
  // Deflection detection
  if (endDeflection > 1) {
    redFlags.push('Deflecting with "busy", "tired", "maybe" - soft rejection')
    ghostingProbability += 20
  }
  
  ghostingProbability = Math.max(0, Math.min(99, ghostingProbability))
  
  // Ghosting type with context
  let ghostingType: string
  if (theirMessages.length < 3) {
    ghostingType = 'hard cut'
  } else if (interestSlope === 'collapsed') {
    ghostingType = 'boredom drop'
  } else if (interestSlope === 'dropping' && toneEnd === 'ice cold') {
    ghostingType = 'slow fade'
  } else if (yourAvgLength > theirAvgLength * 2) {
    ghostingType = 'mismatch drift'
  } else if (topicIgnores > 2) {
    ghostingType = 'avoidant retreat'
  } else {
    ghostingType = 'natural death'
  }
  
  // Timeline analysis with actual content
  const timelineAnalysis = []
  for (let i = 0; i < Math.min(messages.length, 10); i++) {
    const msg = messages[i]
    const preview = msg.text.substring(0, 40)
    
    if (msg.sender === 'them') {
      if (dryWords.some(w => msg.text.toLowerCase().trim() === w)) {
        timelineAnalysis.push({
          message_index: i + 1,
          event: 'tone drop',
          preview: `"${preview}"`
        })
      }
      if (warmWords.some(w => msg.text.toLowerCase().includes(w))) {
        timelineAnalysis.push({
          message_index: i + 1,
          event: 'enthusiasm spike',
          preview: `"${preview}"`
        })
      }
      if (deflectionWords.some(w => msg.text.toLowerCase().includes(w))) {
        timelineAnalysis.push({
          message_index: i + 1,
          event: 'deflection detected',
          preview: `"${preview}"`
        })
      }
    }
    
    if (msg.sender === 'me' && i > 0 && messages[i - 1].sender === 'me') {
      timelineAnalysis.push({
        message_index: i + 1,
        event: 'double text',
        preview: `"${preview}"`
      })
    }
  }
  
  // Cause of death - specific to actual conversation
  let causeOfDeath = ''
  const topRedFlag = redFlags[0] || ''
  
  if (topRedFlag.includes('Triple-texted')) {
    causeOfDeath = 'Fatal triple-text syndrome. ' + topRedFlag
  } else if (topRedFlag.includes('one-word responses')) {
    causeOfDeath = 'Death by monosyllables. ' + topRedFlag
  } else if (topRedFlag.includes('Went from warm to ice cold')) {
    causeOfDeath = 'Sudden cardiac arrest. ' + topRedFlag
  } else if (topRedFlag.includes('paragraphs')) {
    causeOfDeath = 'Asymmetric investment. ' + topRedFlag
  } else if (topRedFlag.includes('Never asked a single question')) {
    causeOfDeath = 'Conversational flatline. They showed zero curiosity about you.'
  } else if (topRedFlag.includes('Ignored') && topRedFlag.includes('questions')) {
    causeOfDeath = 'Death by avoidance. ' + topRedFlag
  } else if (topRedFlag.includes('gym')) {
    causeOfDeath = 'Nobody asked about your workout routine. Terminal cringe.'
  } else if (topRedFlag.includes('wyd')) {
    causeOfDeath = 'Killed by "wyd". The laziest conversation starter known to dating apps.'
  } else if (topRedFlag.includes('interview mode')) {
    causeOfDeath = 'Interrogation fatigue. ' + topRedFlag
  } else if (topRedFlag.includes('drove all topics')) {
    causeOfDeath = 'One-sided effort. You carried the entire conversation alone.'
  } else if (redFlags.length > 3) {
    causeOfDeath = `Multiple organ failure. ${redFlags.length} red flags detected.`
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

    // Get semantic analysis from Amplifier
    const context = await analyzeConversationContext(messages)
    const contextInsights = generateContextInsights(context)

    const result = analyzeConversation(messages)

    // Merge context insights into red flags
    result.red_flags = [...result.red_flags, ...contextInsights]

    // Adjust ghosting probability based on context
    if (!context.genuineInterest) {
      result.ghosting_probability = Math.min(99, result.ghosting_probability + 15)
    }
    if (context.emotionalTone === 'deflecting') {
      result.ghosting_probability = Math.min(99, result.ghosting_probability + 10)
    }
    if (context.responseRelevance < 40) {
      result.ghosting_probability = Math.min(99, result.ghosting_probability + 10)
    }

    // Add context to result
    const enhancedResult = {
      ...result,
      conversation_context: {
        topics: context.topics,
        emotional_tone: context.emotionalTone,
        response_relevance: context.responseRelevance,
        genuine_interest: context.genuineInterest
      }
    }

    return NextResponse.json(enhancedResult)
  } catch (error: any) {
    console.error('Autopsy error:', error)
    return NextResponse.json(
      { error: 'Failed to perform autopsy', details: error.message },
      { status: 500 }
    )
  }
}
