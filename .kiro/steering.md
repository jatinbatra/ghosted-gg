# Ghosted.gg Development Steering

## Project Philosophy
Keep it simple, funny, and viral. This is a weekend project meant to make people laugh while providing real insights.

## Code Standards
- Minimal dependencies
- TypeScript strict mode
- Tailwind for all styling
- No external UI libraries
- Server components where possible
- Client components only when needed (forms, interactivity)

## Design Principles
- Spooky Halloween aesthetic (black, purple, neon green)
- Smooth animations but fast load times
- Mobile-first responsive design
- Clear visual hierarchy
- Tombstone and flatline motifs

## API Design
- Single endpoint: POST /api/autopsy
- Input: { conversation: string }
- Output: Structured JSON autopsy report
- Error handling with user-friendly messages
- Rate limiting considerations for production

## Tone & Voice
- Brutally honest but not mean
- Dark humor with empathy
- Dating psychology insights
- Spooky/Halloween themed language
- Conversational and relatable

## Testing Approach
- Test with real conversation examples
- Edge cases: very short convos, one-sided, perfect convos
- Verify JSON structure consistency
- Check UI responsiveness
- Validate animation performance

## Deployment
- Vercel for hosting (Next.js native)
- Environment variable for OpenAI key
- Public repo with MIT license
- Clear README with setup instructions
