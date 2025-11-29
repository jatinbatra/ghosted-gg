# Ghosted.gg - Technical Specification

## Overview
Ghosted.gg is an AI-powered web application that performs "autopsies" on dating app conversations to diagnose why someone got ghosted.

## Architecture

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Components**:
  - `page.tsx`: Main landing page with input form
  - `AutopsyResult.tsx`: Displays autopsy report
  - `Tombstone.tsx`: Animated SVG tombstone graphic
- **State Management**: React useState (no external state library needed)

### Backend
- **API Route**: `/api/autopsy/route.ts`
- **LLM Integration**: OpenAI GPT-4
- **Input**: Raw conversation text
- **Output**: Structured JSON autopsy report

### Data Flow
1. User pastes conversation into textarea
2. Clicks "Perform Autopsy" button
3. Frontend sends POST request to `/api/autopsy`
4. Backend constructs prompt with conversation
5. OpenAI analyzes and returns structured JSON
6. Frontend displays results with animations

## API Specification

### POST /api/autopsy
**Request Body**:
```json
{
  "conversation": "string"
}
```

**Response**:
```json
{
  "ghosting_probability": 0-100,
  "cause_of_death": "string",
  "time_of_death": "string",
  "red_flags": ["string", "string", ...],
  "autopsy_summary": "string"
}
```

**Error Response**:
```json
{
  "error": "string",
  "details": "string"
}
```

## UI Components

### Main Page
- Hero section with title and tagline
- Large textarea for conversation input
- CTA button with loading state
- Results section (conditional render)

### Autopsy Result Card
- Ghosting probability with progress bar
- Cause of death (highlighted)
- Time of death (highlighted)
- Red flags grid
- Final diagnosis box
- Footer message

### Tombstone Animation
- SVG-based tombstone graphic
- Flatline animation using stroke-dasharray
- Fade-in on result display

## Styling Theme
- **Colors**:
  - Background: Dark gradient (#0a0a0a to #1a0a2e)
  - Primary: Neon green (#39ff14)
  - Secondary: Purple (#8b5cf6)
  - Accent: Red (#ef4444)
- **Typography**: Monospace (Courier New)
- **Effects**: Glowing borders, smooth transitions

## Environment Variables
- `OPENAI_API_KEY`: Required for API calls

## Dependencies
- next: ^14.0.0
- react: ^18.2.0
- openai: ^4.20.0
- tailwindcss: ^3.3.5
- typescript: ^5.0.0

## Deployment Requirements
- Node.js 18+
- OpenAI API key
- Vercel account (recommended)

## Future Considerations
- Rate limiting
- Conversation history storage
- Social sharing features
- Multiple language support
- Conversation health tracking over time
