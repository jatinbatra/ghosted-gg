interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void
}

const prompts = [
  {
    title: 'Classic Gym Flex',
    text: `Me: Hey! How was your weekend?
Her: Good! You?
Me: Pretty good, just hit the gym and meal prepped for the week
Her: Nice
Me: Yeah been trying to stay consistent with my fitness goals
Me: What do you usually do on weekends?
Her: Stuff
Me: Cool! Want to grab coffee sometime this week?
Her: Maybe`
  },
  {
    title: 'The Slow Fade',
    text: `Me: That movie recommendation was amazing! Thank you!
Her: Omg I'm so glad you liked it!! What was your favorite part?
Me: Definitely the ending. Didn't see it coming at all
Her: Right?? I was shook haha
Me: Have you seen any other good movies lately?
Her: Not really
Me: I've been wanting to check out that new thriller
Her: Cool
Me: We should go see it together
Her: Yeah maybe`
  },
  {
    title: 'Actually Going Well',
    text: `Me: Just finished that book you recommended!
Her: No way! What did you think??
Me: Honestly blown away. The plot twist in chapter 12 was insane
Her: I KNOW RIGHT! I literally gasped out loud when I read that
Me: Haha same! Do you have any other recommendations?
Her: Yes! I have like 10 more you'd love. Are you into sci-fi at all?
Me: Absolutely, I'm down for anything
Her: Okay I'm making you a list right now`
  },
  {
    title: 'Interview Mode',
    text: `Me: So what do you do for work?
Her: I'm a designer
Me: Cool! What kind of design?
Her: Graphic design
Me: Nice! How long have you been doing that?
Her: A few years
Me: Where did you study?
Her: Local college
Me: What's your favorite project you've worked on?
Her: Idk`
  }
]

export default function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <div className="mb-8">
      <p className="text-xs text-gray-500 mb-4 tracking-wider uppercase text-center">
        Try a sample conversation
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelect(prompt.text)}
            className="p-3 bg-black bg-opacity-50 border border-gray-800 hover:border-purple-500 transition-all text-xs text-gray-400 hover:text-purple-400 tracking-wide"
          >
            {prompt.title}
          </button>
        ))}
      </div>
    </div>
  )
}
