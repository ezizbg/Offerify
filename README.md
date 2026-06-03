# HR AI Assistant

> AI-powered tools for HR professionals and job seekers — built with Next.js 14 App Router and Anthropic Claude API.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Anthropic](https://img.shields.io/badge/Claude-3.5_Haiku-orange)](https://anthropic.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## What It Does

Three practical AI tools, one clean interface:

### ✍️ Cover Letter Generator
Paste a job description and your resume — Claude analyzes both and generates a personalized, ATS-optimized cover letter that highlights your most relevant achievements.

### 📋 Job Description Writer
Describe a role in plain language and get a structured, inclusive job posting with compelling copy that attracts top candidates.

### 🔍 Resume Analyzer
Get an honest ATS-style analysis: match percentage, what you're missing, which keywords to add, and specific actionable advice for this exact role.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 App Router |
| Language | TypeScript (strict mode) |
| Styling | SCSS Modules — no Tailwind |
| AI | Anthropic Claude 3.5 Haiku |
| AI SDK | `@anthropic-ai/sdk` |
| Streaming | Native `ReadableStream` + `fetch` |
| Deployment | Vercel |

---

## Architecture Decisions

### Why Server-Side Route Handler?
The Anthropic API key lives in `.env.local` and is **never exposed to the browser**. All requests flow:

```
Browser → POST /api/claude → Next.js Route Handler (server) → Anthropic API → Stream back
```

This is the production-grade approach — the client only ever talks to your own server.

### How Streaming Works
1. Browser sends `POST /api/claude` with form data
2. Route Handler starts an Anthropic streaming request
3. A native `ReadableStream` is created — each token from Claude is immediately piped to the response
4. On the client, `response.body.getReader()` reads chunks as they arrive
5. React state is updated on each chunk — text appears token by token

No websockets, no SSE setup — just native fetch streaming.

### SCSS Modules Architecture
Each component owns its styles. Global design tokens (colors, spacing, breakpoints) live in `app/variables.scss` and are injected into every module via `next.config.ts` `sassOptions.additionalData`.

---

## Getting Started

### Prerequisites
- Node.js 18.17+
- An Anthropic API key ([get one here](https://console.anthropic.com/))

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/hr-ai-assistant.git
cd hr-ai-assistant

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Anthropic API key

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-...
```

Get your key at [console.anthropic.com](https://console.anthropic.com/).

---

## Deploying to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project → select the repo
3. In **Environment Variables**, add:
   - `ANTHROPIC_API_KEY` = your key
4. Deploy — Vercel auto-detects Next.js

The API key stays on Vercel's servers, never in the browser bundle.

---

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page (Server Component)
│   ├── globals.scss        # Global styles + keyframe animations
│   ├── variables.scss      # Design tokens (colors, spacing, breakpoints)
│   └── api/claude/
│       └── route.ts        # ← API key lives here, server-only
│
├── components/
│   ├── Tabs/               # Tab navigation
│   ├── CoverLetterGenerator/
│   ├── JobDescriptionWriter/
│   ├── ResumeAnalyzer/
│   ├── StreamingOutput/    # Shared streaming result display
│   ├── CopyButton/         # Copy with animation
│   └── Loader/             # SVG animated spinner
│
├── hooks/
│   └── useStreaming.ts      # Shared streaming logic for all forms
│
├── prompts/
│   ├── coverLetter.ts      # Claude prompt for cover letters
│   ├── jobDescription.ts   # Claude prompt for JDs
│   └── resumeAnalyzer.ts   # Claude prompt for analysis
│
└── types/
    └── index.ts            # Shared TypeScript types
```

---

## Author

**Eziz Berdyev** — Frontend Developer  
Anthropic Certificate: *Building with the Claude API* (May 2026)

---

## License

MIT
