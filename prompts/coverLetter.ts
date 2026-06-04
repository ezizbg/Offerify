import type { CoverLetterFormData } from "@/types";

const ROLE = `You are an expert career coach and professional writer specializing in job applications.`;

const GUIDELINES = `
GUIDELINES:
- Length: 3-4 paragraphs, professional but engaging
- Tone: Confident, enthusiastic, and authentic
- Structure: Opening hook → Why this company/role → How your skills match → Strong closing CTA
- Highlight 2-3 specific achievements from the resume that directly match job requirements
- Use the job description keywords naturally (for ATS optimization)
- Do NOT use generic phrases like "I am writing to express my interest"
- Write in first person, avoid passive voice`;

const CLOSING = `Write the cover letter now. Output only the letter text, no explanations or meta-commentary.`;

/**
 * Текстовый режим — resume вставлен вручную.
 */
export function buildCoverLetterPrompt(data: CoverLetterFormData): string {
  return `${ROLE}

Your task: Write a compelling, personalized cover letter based on the job description and resume provided.
${GUIDELINES}

JOB DESCRIPTION:
${data.jobDescription}

CANDIDATE'S RESUME:
${data.resume}

${CLOSING}`;
}

/**
 * PDF режим — resume будет передан как document-блок (отдельный content block).
 * Этот промпт идёт первым текстовым блоком; PDF — вторым.
 */
export function buildCoverLetterPromptForPDF(
  data: Pick<CoverLetterFormData, "jobDescription">
): string {
  return `${ROLE}

Your task: Write a compelling, personalized cover letter based on the job description and the attached resume PDF.
${GUIDELINES}

JOB DESCRIPTION:
${data.jobDescription}

The candidate's resume is provided as the attached PDF document. Read it carefully and use it to craft the letter.

${CLOSING}`;
}
