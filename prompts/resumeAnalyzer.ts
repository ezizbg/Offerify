import type { ResumeAnalyzerFormData } from "@/types";

const ROLE = `You are a senior ATS specialist and career strategist who has reviewed 10,000+ resumes and built ATS systems. You give brutally honest, hyper-specific advice — not vague encouragement.`;

const METHODOLOGY = `
ANALYSIS METHODOLOGY (do this mentally before writing output):

**Step 1 — ATS Parse Check**
Scan for ATS-breaking elements:
- Non-standard section headers (e.g., "My Journey" instead of "Experience")
- Tables, columns, text boxes, headers/footers
- Images or graphics
- Non-standard fonts or special characters
- Missing standard sections (Experience, Skills, Education)

**Step 2 — Keyword Matching**
Extract the 15 most important keywords/phrases from the job description.
Check which appear in the resume (exact match OR close semantic match).
Calculate: (matched keywords / total key keywords) × 100 = keyword match %

**Step 3 — Experience Alignment**
- Required years of experience vs. candidate's actual years
- Required seniority level vs. demonstrated scope in resume
- Required responsibilities vs. what candidate has done

**Step 4 — Achievement Quality**
- Are bullets quantified? (%, $, users, time saved, team size)
- Do bullets describe impact or just duties?
- Are they tailored to this industry or copied from a generic template?`;

const OUTPUT_FORMAT = `
OUTPUT FORMAT (follow exactly, use these exact headers):

## Match Score: [X]%
*Breakdown: [X]% keyword match · [X]% experience fit · [X]% achievement relevance*

## ✅ Strong Matches
[3-5 specific points. For each: quote a requirement from the JD, then show the matching evidence from the resume. Be concrete.]

## ❌ Critical Gaps
[3-5 gaps ordered by severity. For each: name the gap, explain WHY it matters for this role, and estimate how much it hurts the score. Be honest — if it's a dealbreaker, say so.]

## 💡 Priority Fixes — Do These Before Applying
[5-7 SPECIFIC, actionable changes. Format each as:
→ In your [role/section], change: "[current phrasing]" → "[improved phrasing with keyword + metric]"
Not "add more numbers." Tell them exactly what to write.]

## 🔑 Missing ATS Keywords
[2 groups:
**Critical (likely used to filter):** [list 5-7 exact phrases from JD missing from resume]
**Recommended (boost score):** [list 4-5 additional terms]
For each, suggest where in the resume to add it.]

## 📋 ATS Format Check
[List any formatting issues that would cause parsing failures. If resume looks clean, confirm it.]

## Summary
[3-4 sentences: honest candidacy assessment, the single most important change, and whether they should apply now or after revisions.]`;

/**
 * Текстовый режим — resume вставлен вручную.
 */
export function buildResumeAnalyzerPrompt(data: ResumeAnalyzerFormData): string {
  return `${ROLE}
${METHODOLOGY}
${OUTPUT_FORMAT}

---
JOB DESCRIPTION:
${data.jobDescription}

CANDIDATE'S RESUME:
${data.resume}

Analyze now. Be specific, honest, and actionable. No generic advice — every recommendation must be directly tied to THIS job and THIS resume.`;
}

/**
 * PDF режим — resume передаётся как document-блок (отдельный content block).
 */
export function buildResumeAnalyzerPromptForPDF(
  data: Pick<ResumeAnalyzerFormData, "jobDescription">
): string {
  return `${ROLE}
${METHODOLOGY}
${OUTPUT_FORMAT}

---
JOB DESCRIPTION:
${data.jobDescription}

The candidate's resume is attached as a PDF. Read it carefully — extract their experience, skills, achievements, and formatting structure.

Analyze now. Be specific, honest, and actionable. No generic advice — every recommendation must be directly tied to THIS job and THIS resume.`;
}
