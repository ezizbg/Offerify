import type { CoverLetterFormData } from "@/types";

const SHARED_RULES = `
🌐 LANGUAGE — TOP PRIORITY:
Detect the primary language of the Job Description.
Write the ENTIRE letter in that SAME language — every word.
Russian JD → 100% Russian. English JD → 100% English. No mixing.

MODERN COVER LETTER RULES (recruiter reads in 6 seconds — every word must earn its place):

✗ NEVER start with "I am writing…" / "Я пишу, чтобы…" or any variation
✗ NEVER use: "team player", "passionate", "quick learner", "нацелен на результат", "командный игрок"
✗ NEVER pad — no filler, no warm-up sentences, no generic company praise
✗ NEVER use markdown (no **bold**, no ## headers, no bullets) — plain prose only
✗ NEVER add subject lines, greetings like "Dear Hiring Manager", or meta-commentary
✗ NEVER repeat the resume verbatim — reframe and synthesize

PRE-WRITE (mental only, never output):
① Identify: company name, exact job title, top 2 requirements from JD
② Extract: candidate's single strongest quantified achievement relevant to this role
③ Pick: 3 ATS keywords from the JD to weave into paragraph 2

STRUCTURE — exactly 3 paragraphs, plain prose:

Paragraph 1 — The Hook (2-3 sentences, ~40 words):
Open with a direct, confident statement about the VALUE you bring to THIS role.
Reference the exact job title and something specific about the company or the role challenge.
No "I want to apply." Lead with what you deliver.

Paragraph 2 — The Proof (3-4 sentences, ~80 words):
State your strongest, most relevant achievement — with a number if the resume has one.
Connect it directly to a stated need from the JD.
Weave in 2-3 exact keywords from the JD naturally — not forced.
One additional skill or experience that addresses another requirement.

Paragraph 3 — The Close (1-2 sentences, ~30 words):
Confident, specific call to action. Suggest a conversation.
Sign off with full name on the next line.

TARGET: 140-180 words total. Tight. Scannable. Zero filler.`;

/**
 * Text mode — resume is pasted manually.
 */
export function buildCoverLetterPrompt(data: CoverLetterFormData): string {
  return `You are an elite cover letter writer. You write short, punchy letters that get callbacks — not walls of text that get ignored.
${SHARED_RULES}

JOB DESCRIPTION:
${data.jobDescription}

CANDIDATE'S RESUME:
${data.resume}

Write the cover letter now. Output ONLY the 3 paragraphs + name sign-off. No subject line. No commentary. 140-180 words maximum.`;
}

/**
 * PDF mode — resume is passed as a document content block.
 */
export function buildCoverLetterPromptForPDF(
  data: Pick<CoverLetterFormData, "jobDescription">
): string {
  return `You are an elite cover letter writer. You write short, punchy letters that get callbacks — not walls of text that get ignored.
${SHARED_RULES}

JOB DESCRIPTION:
${data.jobDescription}

The candidate's resume is attached as a PDF. Read it — extract their name, strongest quantified achievement, and experience level.

Write the cover letter now. Output ONLY the 3 paragraphs + name sign-off. No subject line. No commentary. 140-180 words maximum.`;
}
