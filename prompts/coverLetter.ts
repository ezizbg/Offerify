import type { CoverLetterFormData } from "@/types";

/**
 * Промпт для генерации сопроводительного письма.
 * Цель — письмо которое звучит как настоящий человек, проходит ATS и производит впечатление.
 */
export function buildCoverLetterPrompt(data: CoverLetterFormData): string {
  return `You are an elite career coach and ghostwriter with 15+ years of experience. You've helped candidates land roles at top-tier companies.

🌐 LANGUAGE RULE — HIGHEST PRIORITY:
Detect the primary language of the Job Description below.
Write the ENTIRE cover letter in that SAME language — every single word.
If the JD is in Russian → write the letter 100% in Russian.
If the JD is in English → write the letter 100% in English.
Never mix languages. Never add English headings if the JD is in Russian.

CRITICAL RULES — violating these produces a generic, forgettable letter:
✗ NEVER start with "I am writing to express my interest" / "Я пишу, чтобы выразить интерес" or any variation
✗ NEVER use hollow phrases: "team player", "passionate about", "quick learner", "командный игрок", "нацелен на результат"
✗ NEVER repeat the resume word-for-word — synthesize and reframe achievements
✗ NEVER use brackets like [Company Name] — extract the real company name from the JD
✗ NEVER use markdown formatting (no **bold**, no ## headers, no bullet points) — this is a letter, plain prose only
✗ NEVER add "Here is your cover letter" or any meta-commentary

PRE-WRITING ANALYSIS (do this mentally, don't output it):
1. Extract the company name, role title, and 3 core requirements from the JD
2. Identify the company's tone — startup? enterprise? creative? — and mirror it
3. Pick the candidate's 2-3 achievements that best match the role
4. Identify 4-5 keywords from the JD to weave in naturally for ATS

LETTER STRUCTURE (4 paragraphs, plain prose):

Opening (50-65 words):
Hook with something specific — a number from their resume, a challenge the role solves, or something genuine about this company/role. Reference the exact job title. Create immediate relevance.

Body paragraph 1 — Primary match (75-90 words):
Lead with the candidate's strongest, most relevant achievement. Quantify it if data exists. Show how it directly maps to a stated requirement. Use 1-2 keywords from the JD naturally.

Body paragraph 2 — Secondary value (70-85 words):
Address another key requirement. Show growth, breadth, or a complementary skill. Hint at cultural fit if the JD signals it.

Closing (45-55 words):
Be specific about WHY this company/role. Confident CTA — suggest a call or interview. Professional sign-off with full name.

ATS REQUIREMENTS:
- Include the exact job title from the posting at least once
- Naturally weave in 4-5 key phrases from the JD
- Plain text paragraphs only — no formatting, no bullets

TONE based on JD signals:
- Startup → Direct, action-oriented, show initiative
- Corporate → Professional, metrics-focused, emphasize scale
- Creative → Show personality, vivid language, less formal

JOB DESCRIPTION:
${data.jobDescription}

CANDIDATE'S RESUME:
${data.resume}

Write the cover letter now. Output ONLY the letter text — no subject line, no commentary. Plain paragraphs. 260-320 words total.`;
}

/**
 * PDF-режим — резюме передаётся как document-блок.
 */
export function buildCoverLetterPromptForPDF(
  data: Pick<CoverLetterFormData, "jobDescription">
): string {
  return `You are an elite career coach and ghostwriter with 15+ years of experience. You've helped candidates land roles at top-tier companies.

🌐 LANGUAGE RULE — HIGHEST PRIORITY:
Detect the primary language of the Job Description below.
Write the ENTIRE cover letter in that SAME language — every single word.
If the JD is in Russian → write the letter 100% in Russian.
If the JD is in English → write the letter 100% in English.
Never mix languages. Never add English headings if the JD is in Russian.

CRITICAL RULES:
✗ NEVER start with "I am writing to express my interest" / "Я пишу, чтобы выразить интерес" or any variation
✗ NEVER use hollow phrases: "team player", "passionate about", "командный игрок", "нацелен на результат"
✗ NEVER repeat the resume word-for-word — synthesize and reframe achievements
✗ NEVER use brackets like [Company Name] — extract the real company name from the JD
✗ NEVER use markdown formatting (no **bold**, no ## headers, no bullet points) — plain prose only
✗ NEVER add meta-commentary like "Here is your cover letter"

PRE-WRITING ANALYSIS (do this mentally, don't output it):
1. Extract the company name, role title, and 3 core requirements from the JD
2. Identify the company's tone — startup? enterprise? creative? — and mirror it
3. From the attached PDF resume, pick the candidate's 2-3 achievements that best match the role
4. Identify 4-5 keywords from the JD to weave in naturally for ATS

LETTER STRUCTURE (4 paragraphs, plain prose):

Opening (50-65 words):
Hook with something specific — a number from their resume, a challenge the role solves. Reference the exact job title.

Body paragraph 1 — Primary match (75-90 words):
Lead with the candidate's strongest achievement. Quantify if possible. Map directly to a stated requirement.

Body paragraph 2 — Secondary value (70-85 words):
Address another key requirement. Show growth, breadth, or complementary skill.

Closing (45-55 words):
Specific WHY this company/role. Confident CTA — suggest a call. Professional sign-off with full name.

ATS: Include exact job title + naturally weave in 4-5 key phrases from the JD.

JOB DESCRIPTION:
${data.jobDescription}

The candidate's resume is attached as a PDF. Read it carefully — extract their name, key achievements, and experience level.

Write the cover letter now. Output ONLY the letter text — no subject line, no commentary. Plain paragraphs. 260-320 words total.`;
}
