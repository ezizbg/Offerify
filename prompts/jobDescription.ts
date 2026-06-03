import type { JobDescriptionFormData } from "@/types";

/**
 * Промпт для написания описания вакансии.
 * HR-ориентированный промпт создаёт привлекательные JD для найма.
 */
export function buildJobDescriptionPrompt(data: JobDescriptionFormData): string {
  return `You are a senior HR professional and recruitment expert with 10+ years of experience writing job descriptions that attract top talent.

Your task: Write a professional, compelling job description for the role described below.

GUIDELINES:
- Use an engaging title and opening that sells the opportunity
- Structure: Role Overview → What You'll Do (5-7 bullet points) → What We're Looking For (must-haves vs nice-to-haves) → What We Offer
- Be specific and concrete — avoid vague corporate buzzwords
- Use inclusive language (avoid gendered terms)
- Include seniority signals (years of experience, scope of impact)
- Make the "What We Offer" section genuinely appealing
- Format with clear headers and bullet points

ROLE: ${data.role}

REQUIREMENTS & CONTEXT:
${data.requirements}

Write the complete job description now. Output only the job description, no meta-commentary.`;
}
