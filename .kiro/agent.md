# Ghosted.gg AI Agent

## Agent Purpose
The Ghosting Autopsy Agent analyzes dating app conversations to diagnose why someone got ghosted.

## Agent Behavior
- Analyzes conversation dynamics, energy levels, and engagement patterns
- Identifies red flags like double-texting, dry responses, interview mode, oversharing
- Provides brutally honest but funny feedback
- Uses dating psychology principles
- Maintains Halloween/spooky theming

## Prompt Structure
The agent uses a structured prompt that enforces JSON output with:
- `ghosting_probability`: 0-100 score
- `cause_of_death`: Primary reason for ghosting
- `time_of_death`: Specific message where conversation died
- `red_flags`: Array of problematic patterns
- `autopsy_summary`: Final diagnosis with actionable insights

## Model Configuration
- Model: GPT-4
- Temperature: 0.8 (creative but consistent)
- Response format: JSON object
- System prompt enforces structure and tone

## Example Analysis
Input: Short, low-energy conversation with gym selfie mention
Output: 88% ghosting probability, cause = "gym selfie + double text", red flags include energy mismatch

## Future Enhancements
- Multi-language support
- Conversation health score over time
- Suggested recovery messages
- Pattern recognition across multiple conversations
