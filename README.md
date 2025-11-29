# 👻 Ghosted.gg

**AI Autopsy for Your Dead Conversations**

Ever wonder why someone ghosted you? Paste your chat and get a full forensic analysis: ghosting probability, cause of death, time of death, and a toxicology report of red flags.

Built for **Kiroween 2025 Hackathon** 🎃

---

## 🚀 Features

- **Ghosting Probability Score** (0-100%)
- **Cause of Death** - The fatal mistake that killed your conversation
- **Time of Death** - The exact message where it flatlined
- **Toxicology Report** - All the red flags detected
- **Autopsy Summary** - Final diagnosis with dating psychology insights
- **Spooky UI** - Halloween-themed with tombstone animations

---

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **OpenAI GPT-4**
- **Kiro AI** (for agent design and steering)

---

## 📦 Installation

1. Clone the repo:
```bash
git clone https://github.com/yourusername/ghosted-gg.git
cd ghosted-gg
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your OpenAI API key:
```
OPENAI_API_KEY=your_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

---

## 🎮 Usage

1. Paste a conversation from your dating app
2. Click "Perform Autopsy"
3. Get your diagnosis
4. Accept the truth 💀

---

## 🧪 Example

**Input:**
```
Me: Hey! How's your week going?
Her: Good!! You?
Me: Pretty good, just finished legs at the gym.
Her: Nicee
Me: Wanna hang this weekend?
```

**Output:**
- **Ghosting Probability:** 88%
- **Cause of Death:** Low engagement + gym selfie energy
- **Time of Death:** "Nicee" — that was a soft goodbye
- **Red Flags:** No follow-up question, Energy mismatch, Interview mode, Low rizz energy

---

## 🎃 Kiroween Themes

This project embodies:
- **Frankenstein** - Merging dating psychology + AI + spooky UI into one hybrid
- **Costume Contest** - The app "dresses up" boring chat analysis as a Halloween autopsy

---

## 📁 Project Structure

```
ghosted-gg/
├── app/
│   ├── api/autopsy/route.ts    # AI agent endpoint
│   ├── components/
│   │   ├── AutopsyResult.tsx   # Results display
│   │   └── Tombstone.tsx       # SVG animation
│   ├── page.tsx                # Main page
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Styles
├── .kiro/
│   ├── agent.md                # Agent documentation
│   ├── steering.md             # Development guidelines
│   └── spec.md                 # Technical spec
└── README.md
```

---

## 🤖 How the AI Works

The Ghosting Autopsy Agent uses GPT-4 with a specialized prompt that:
- Analyzes conversation dynamics and energy levels
- Identifies dating psychology patterns
- Detects red flags (double-texting, dry responses, etc.)
- Provides structured JSON output
- Maintains dark humor + empathy balance

See `.kiro/agent.md` for full details.

---

## 🚢 Deployment

Deploy to Vercel in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ghosted-gg)

Don't forget to add your `OPENAI_API_KEY` in Vercel environment variables.

---

## 📝 License

MIT License - feel free to fork and build your own version!

---

## 🙏 Credits

Built with [Kiro AI](https://kiro.ai) for Kiroween 2025 Hackathon.

May your next conversation live longer. 🕊️
