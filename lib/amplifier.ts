// Amplifier-inspired semantic analysis for conversation understanding
// Using lightweight transformers.js for client-side inference

interface ConversationContext {
  topics: string[]
  topicEngagement: { [topic: string]: 'high' | 'medium' | 'low' }
  emotionalTone: 'enthusiastic' | 'neutral' | 'disinterested' | 'deflecting'
  responseRelevance: number // 0-100
  genuineInterest: boolean
}

interface MessagePair {
  question: string
  response: string
  index: number
}

// Topic extraction using keyword clustering
function extractTopics(messages: string[]): string[] {
  const topicKeywords = {
    dating: ['date', 'meet', 'coffee', 'dinner', 'drinks', 'hang out', 'plans'],
    hobbies: ['hobby', 'like to', 'enjoy', 'love to', 'favorite', 'into'],
    work: ['work', 'job', 'career', 'office', 'busy', 'meeting'],
    personal: ['family', 'friends', 'weekend', 'free time', 'usually'],
    flirting: ['cute', 'hot', 'beautiful', 'handsome', 'attractive', 'vibe'],
    small_talk: ['weather', 'how are you', 'what\'s up', 'wyd', 'hbu'],
  }
  
  const topicCounts: { [key: string]: number } = {}
  const allText = messages.join(' ').toLowerCase()
  
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    const count = keywords.filter(kw => allText.includes(kw)).length
    if (count > 0) {
      topicCounts[topic] = count
    }
  }
  
  return Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([topic]) => topic)
}

// Analyze if response is relevant to the question
function analyzeResponseRelevance(question: string, response: string): number {
  const qLower = question.toLowerCase()
  const rLower = response.toLowerCase()
  
  // Check for direct deflection
  const deflections = ['idk', 'i don\'t know', 'maybe', 'not sure', 'whatever', 'busy', 'tired']
  if (deflections.some(d => rLower.trim() === d || rLower.includes(d))) {
    return 20
  }
  
  // One word response to open question
  if (response.trim().split(/\s+/).length === 1 && question.length > 20) {
    return 30
  }
  
  // Extract key words from question
  const questionWords = qLower
    .replace(/[?!.,]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3 && !['what', 'when', 'where', 'how', 'why', 'would', 'could', 'should'].includes(w))
  
  // Check if response mentions any question keywords
  const relevantWords = questionWords.filter(w => rLower.includes(w))
  
  if (relevantWords.length > 0) {
    return 80
  }
  
  // Check if response is substantive (more than 20 chars, multiple words)
  if (response.length > 20 && response.split(/\s+/).length > 3) {
    return 60
  }
  
  return 40
}

// Detect emotional tone from message content
function detectEmotionalTone(messages: string[]): 'enthusiastic' | 'neutral' | 'disinterested' | 'deflecting' {
  const allText = messages.join(' ').toLowerCase()
  
  const enthusiasmMarkers = ['!', 'haha', 'lol', 'lmao', 'omg', 'love', 'amazing', 'awesome', 'excited', '😂', '❤️', '🔥']
  const disinterestMarkers = ['k', 'ok', 'cool', 'nice', 'yeah', 'sure']
  const deflectionMarkers = ['busy', 'tired', 'maybe', 'idk', 'whatever', 'i guess', 'not really']
  
  const enthusiasmScore = enthusiasmMarkers.filter(m => allText.includes(m)).length
  const disinterestScore = disinterestMarkers.filter(m => {
    const words = allText.split(/\s+/)
    return words.some(w => w === m)
  }).length
  const deflectionScore = deflectionMarkers.filter(m => allText.includes(m)).length
  
  if (deflectionScore > 2) return 'deflecting'
  if (enthusiasmScore > 3) return 'enthusiastic'
  if (disinterestScore > 3) return 'disinterested'
  return 'neutral'
}

// Analyze topic engagement
function analyzeTopicEngagement(messages: { sender: string; text: string }[], topic: string): 'high' | 'medium' | 'low' {
  const topicKeywords = {
    dating: ['date', 'meet', 'coffee', 'dinner', 'drinks'],
    hobbies: ['hobby', 'like', 'enjoy', 'love'],
    work: ['work', 'job', 'career'],
    personal: ['family', 'friends', 'weekend'],
    flirting: ['cute', 'hot', 'beautiful', 'vibe'],
    small_talk: ['weather', 'how', 'what\'s up'],
  }
  
  const keywords = topicKeywords[topic as keyof typeof topicKeywords] || []
  const theirMessages = messages.filter(m => m.sender === 'them')
  
  const topicMessages = theirMessages.filter(m => 
    keywords.some(kw => m.text.toLowerCase().includes(kw))
  )
  
  if (topicMessages.length === 0) return 'low'
  
  const avgLength = topicMessages.reduce((sum, m) => sum + m.text.length, 0) / topicMessages.length
  const hasQuestions = topicMessages.some(m => m.text.includes('?'))
  
  if (avgLength > 50 && hasQuestions) return 'high'
  if (avgLength > 30 || hasQuestions) return 'medium'
  return 'low'
}

// Check for genuine interest signals
function detectGenuineInterest(messages: { sender: string; text: string }[]): boolean {
  const theirMessages = messages.filter(m => m.sender === 'them')
  
  // Signals of genuine interest
  const askedQuestions = theirMessages.filter(m => m.text.includes('?')).length
  const initiatedTopics = theirMessages.filter(m => {
    const starters = ['so', 'btw', 'oh', 'also', 'speaking of']
    return starters.some(s => m.text.toLowerCase().startsWith(s))
  }).length
  const substantiveResponses = theirMessages.filter(m => m.text.length > 40).length
  const enthusiasmMarkers = theirMessages.filter(m => 
    m.text.includes('!') || m.text.includes('haha') || m.text.includes('lol')
  ).length
  
  const interestScore = askedQuestions * 3 + initiatedTopics * 2 + substantiveResponses + enthusiasmMarkers
  
  return interestScore > 5
}

export async function analyzeConversationContext(
  messages: { sender: string; text: string }[]
): Promise<ConversationContext> {
  const allMessages = messages.map(m => m.text)
  const theirMessages = messages.filter(m => m.sender === 'them').map(m => m.text)
  
  // Extract topics
  const topics = extractTopics(allMessages)
  
  // Analyze topic engagement
  const topicEngagement: { [topic: string]: 'high' | 'medium' | 'low' } = {}
  for (const topic of topics) {
    topicEngagement[topic] = analyzeTopicEngagement(messages, topic)
  }
  
  // Detect emotional tone
  const emotionalTone = detectEmotionalTone(theirMessages)
  
  // Analyze response relevance
  const questionResponsePairs: MessagePair[] = []
  for (let i = 0; i < messages.length - 1; i++) {
    if (messages[i].sender === 'me' && messages[i].text.includes('?') && messages[i + 1]?.sender === 'them') {
      questionResponsePairs.push({
        question: messages[i].text,
        response: messages[i + 1].text,
        index: i
      })
    }
  }
  
  const relevanceScores = questionResponsePairs.map(pair => 
    analyzeResponseRelevance(pair.question, pair.response)
  )
  const responseRelevance = relevanceScores.length > 0
    ? Math.round(relevanceScores.reduce((a, b) => a + b, 0) / relevanceScores.length)
    : 50
  
  // Detect genuine interest
  const genuineInterest = detectGenuineInterest(messages)
  
  return {
    topics,
    topicEngagement,
    emotionalTone,
    responseRelevance,
    genuineInterest
  }
}

// Generate context-aware insights
export function generateContextInsights(context: ConversationContext): string[] {
  const insights: string[] = []
  
  if (context.topics.length === 0) {
    insights.push('No clear topics discussed - conversation lacked substance')
  } else {
    const lowEngagementTopics = Object.entries(context.topicEngagement)
      .filter(([_, engagement]) => engagement === 'low')
      .map(([topic]) => topic)
    
    if (lowEngagementTopics.length > 0) {
      insights.push(`Low engagement on: ${lowEngagementTopics.join(', ')}`)
    }
  }
  
  if (context.emotionalTone === 'deflecting') {
    insights.push('Actively deflecting - giving evasive answers')
  } else if (context.emotionalTone === 'disinterested') {
    insights.push('Disinterested tone - minimal emotional investment')
  }
  
  if (context.responseRelevance < 40) {
    insights.push(`Only ${context.responseRelevance}% of responses were relevant to your questions`)
  }
  
  if (!context.genuineInterest) {
    insights.push('No genuine interest signals detected - they\'re not invested')
  }
  
  return insights
}
