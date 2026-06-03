import type { CoverLetterFormData } from "@/types";

/**
 * Промпт для генерации сопроводительного письма.
 * Структурированный промпт даёт предсказуемый, профессиональный результат.
 */
export function buildCoverLetterPrompt(data: CoverLetterFormData): string {
  return `You are an expert career coach and professional writer specializing in job applications.

Your task: Write a compelling, personalized cover letter based on the job description and resume provided.

GUIDELINES:
- Length: 3-4 paragraphs, professional but engaging
- Tone: Confident, enthusiastic, and authentic
- Structure: Opening hook → Why this company/role → How your skills match → Strong closing CTA
- Highlight 2-3 specific achievements from the resume that directly match job requirements
- Use the job description keywords naturally (for ATS optimization)
- Do NOT use generic phrases like "I am writing to express my interest"
- Write in first person, avoid passive voice

JOB DESCRIPTION:
${data.jobDescription}

CANDIDATE'S RESUME:
${data.resume}

Write the cover letter now. Output only the letter text, no explanations or meta-commentary.`;
}
