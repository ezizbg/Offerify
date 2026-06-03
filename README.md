# Offerify — HR AI Assistant

**AI-powered tools for HR professionals and job seekers.**
Generate cover letters, write job descriptions, and analyze resume-to-job fit in seconds.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?logo=vercel)](https://offerify.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Claude](https://img.shields.io/badge/Claude_3.5_Haiku-Anthropic-D97706)](https://anthropic.com)

---

## Features

### ✍️ Cover Letter Generator
Paste a job description + your resume. Offerify reads both and generates a personalized, ATS-optimized cover letter that highlights your most relevant achievements — not a generic template.

### 📋 Job Description Writer
Describe a role in plain language. Get a structured, inclusive job posting with a compelling opening, clear requirements split by must-have vs nice-to-have, and an attractive benefits section.

### 🔍 Resume Analyzer
Get an honest ATS-style breakdown: **match score (%)**, what aligns well, what's missing, which keywords to add, and specific rewrite suggestions for each gap.

All tools stream responses **token by token** — you see results as they're generated, no waiting for the full response.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | **Next.js 14 App Router** | Server Components + Route Handlers for secure server-side API calls |
| Language | **TypeScript** (strict) | Full type safety across components, API, and prompts |
| Styling | **SCSS Modules** | Scoped styles, design tokens, zero runtime overhead |
| AI | **Anthropic Claude 3.5 Haiku** | Fast responses ideal for streaming UX |
| AI SDK | `@anthropic-ai/sdk` | Official streaming support, typed responses |
| Streaming | Native `ReadableStream` + `fetch` | No extra libraries — browser-native chunk-by-chunk delivery |
| Deployment | **Vercel** | Zero-config Next.js hosting, edge functions, env var management |

---

## Architecture

### Secure API Key Handling

The Anthropic API key **never reaches the browser**. Every request flows through a server-side Route Handler:

```
Browser  →  POST /api/claude  →  Next.js Route Handler (server)  →  Anthropic API
                                          ↓
Browser  ←  ReadableStream   ←─────────────────────────────────────────────────────
```

The Route Handler runs in Node.js — `process.env.ANTHROPIC_API_KEY` is inaccessible from client bundles. This is the production-grade approach used in real SaaS applications.

### Streaming Implementation

```ts
// Server: pipe Anthropic stream → ReadableStream → Response
const stream = await anthropic.messages.stream({ ... });
const readable = new ReadableStream({
  async start(controller) {
    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta') {
        controller.enqueue(encoder.encode(chunk.delta.text));
      }
    }
    controller.close();
  }
});
return new Response(readable, { headers: { 'Content-Type': 'text/plain' } });

// Client: read chunks as they arrive
const reader = response.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  setContent(prev => prev + decoder.decode(value));
}
```

### Component Architecture

```
app/
├── layout.tsx              # Root layout, metadata, fonts
├── page.tsx                # Shell (Server Component — no JS sent for static parts)
├── globals.scss            # Keyframe animations, CSS custom properties
├── variables.scss          # Design tokens: colors, spacing, breakpoints
└── api/claude/route.ts     # ← Only file that touches ANTHROPIC_API_KEY

components/
├── Tabs/                   # CSS Grid 3-column navigation, animated active state
├── CoverLetterGenerator/   # Form + StreamingOutput, useStreaming hook
├── JobDescriptionWriter/   # Form + StreamingOutput, useStreaming hook
├── ResumeAnalyzer/         # Form + StreamingOutput, useStreaming hook
├── StreamingOutput/        # Handles idle/loading/streaming/done/error states
├── CopyButton/             # Clipboard API, 4 visual states
└── Loader/                 # SVG dual-arc spinner with CSS animation

hooks/
└── useStreaming.ts          # Shared: fetch → ReadableStream → status management

prompts/
├── coverLetter.ts          # Claude prompt for cover letters
├── jobDescription.ts       # Claude prompt for job descriptions
└── resumeAnalyzer.ts       # Structured analysis prompt with scoring guide
```

---

## Getting Started

### Prerequisites
- Node.js 18.17+
- Anthropic API key → [console.anthropic.com](https://console.anthropic.com/)

### Run locally

```bash
# Clone
git clone https://github.com/ezizbg/Offerify.git
cd Offerify

# Install
npm install

# Set up API key
cp .env.example .env.local
# Add your key to .env.local:
# ANTHROPIC_API_KEY=sk-ant-...

# Start
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

1. Fork or clone this repo to your GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo
3. Add environment variable: `ANTHROPIC_API_KEY` = your key
4. Click **Deploy**

> ⚠️ GitHub Pages does **not** support this app — it requires a Node.js server for the API routes. Vercel is the correct platform.

---

## License

MIT © [Eziz Berdyev](https://github.com/ezizbg)
