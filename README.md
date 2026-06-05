# Offerify — AI Career Tools

**AI-powered tools for job seekers and HR professionals.**  
Generate cover letters, analyze resumes, and write job descriptions — in seconds.

[![Live Demo](https://img.shields.io/badge/Live_Demo-offerify--seven.vercel.app-black?logo=vercel&logoColor=white)](https://offerify-seven.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Claude Haiku 4.5](https://img.shields.io/badge/Claude_Haiku_4.5-Anthropic-D97706)](https://anthropic.com)
[![SCSS](https://img.shields.io/badge/SCSS_Modules-CC6699?logo=sass&logoColor=white)](https://sass-lang.com/)

---

## Features

### ✍️ Cover Letter Generator
Paste a job description + resume — get a personalized, ATS-optimized cover letter that highlights your relevant achievements. Not a generic template.

### 🔍 Resume Analyzer
Upload your resume and a job description. Get a match score, missing keywords, and specific rewrite suggestions to pass ATS filters.

### 📋 Job Description Writer
Describe a role in plain language. Get a structured, inclusive job posting with must-have vs. nice-to-have requirements and a compelling benefits section.

> All tools stream responses **token by token** — results appear as they're generated, no waiting.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 14** App Router — Server Components + Route Handlers |
| Language | **TypeScript** (strict mode) |
| Styling | **SCSS Modules** + CSS Custom Properties (dark/light theming) |
| AI | **Anthropic Claude Haiku 4.5** via `@anthropic-ai/sdk` |
| Streaming | Native `ReadableStream` — zero extra libraries |
| Deployment | **Vercel** — edge functions, env var management |

---

## Architecture

### API key never reaches the browser

All Claude requests go through a server-side Route Handler — `process.env.ANTHROPIC_API_KEY` is inaccessible from client bundles. Production-grade approach used in real SaaS.

```
Browser → POST /api/claude → Next.js Route Handler → Anthropic API
                                      ↓
Browser ← ReadableStream  ←──────────────────────────────────────
```

### Streaming pipeline

```ts
// Server: pipe Anthropic stream → ReadableStream → Response
const stream = await anthropic.messages.stream({ model: "claude-haiku-4-5", ... });
const readable = new ReadableStream({
  async start(controller) {
    for await (const chunk of stream) {
      if (chunk.type === "content_block_delta")
        controller.enqueue(encoder.encode(chunk.delta.text));
    }
    controller.close();
  },
});
return new Response(readable, { headers: { "Content-Type": "text/plain" } });
```

### Project structure

```
app/
├── page.tsx                 # Shell — tab navigation, layout
├── globals.scss             # Design tokens, keyframes, resets
├── variables.scss           # Spacing, breakpoints, typography
└── api/claude/route.ts      # ← Only file that touches ANTHROPIC_API_KEY

components/
├── Tabs/                    # Tab bar + panel switching
├── CoverLetterGenerator/    # Form + streaming output
├── ResumeAnalyzer/          # Form + PDF upload + streaming output
├── JobDescriptionWriter/    # Form + streaming output
├── StreamingOutput/         # idle / loading / streaming / done / error states
├── CopyButton/              # Clipboard API, 4 visual states
└── ThemeToggle/             # Dark / light theme switcher

hooks/
└── useStreaming.ts           # Shared: fetch → ReadableStream → status

prompts/
├── coverLetter.ts
├── jobDescription.ts
└── resumeAnalyzer.ts        # Structured prompt with ATS scoring guide
```

---

## Live Demo

**[offerify-seven.vercel.app](https://offerify-seven.vercel.app)** — no sign-up required.

---

MIT © [Eziz Berdiyev](https://github.com/ezizbg)
