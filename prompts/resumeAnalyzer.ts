import type { ResumeAnalyzerFormData } from "@/types";

const ROLE =
  `You are an expert ATS (Applicant Tracking System) specialist and career coach ` +
  `who helps candidates optimize their resumes for specific job applications.\n\n` +
  `Your task: Analyze how well the candidate's resume matches the job description, ` +
  `then provide actionable feedback.`;

const OUTPUT_FORMAT = `
OUTPUT FORMAT (follow exactly):
## Match Score: [X]%

## ✅ Strong Matches
[List 3-5 skills/experiences that align well with the job requirements]

## ❌ Missing or Weak Areas
[List 3-5 important requirements from the job that are absent or underrepresented in the resume]

## 💡 Recommendations
[Give 4-6 specific, actionable steps to improve the resume for this specific role. Be concrete — not "add more achievements" but "add a metrics-driven bullet under your X role showing Y impact"]

## 🔑 Keywords to Add
[List 5-8 specific keywords/phrases from the job description that should be added to the resume for ATS optimization]

## Summary
[2-3 sentence honest assessment of candidacy and overall advice]

SCORING GUIDE:
- 85-100%: Strong candidate, minor gaps
- 70-84%: Good candidate, some important gaps to address
- 50-69%: Moderate fit, significant work needed
- Below 50%: Significant mismatch, consider if this role is the right target`;

/**
 * Текстовый режим — resume вставлен вручную.
 */
export function buildResumeAnalyzerPrompt(data: ResumeAnalyzerFormData): string {
  return `${ROLE}
${OUTPUT_FORMAT}

JOB DESCRIPTION:
${data.jobDescription}

CANDIDATE'S RESUME:
${data.resume}

Analyze now. Be honest, specific, and constructive.`;
}

/**
 * PDF режим — resume будет передан как document-блок (отдельный content block).
 * Этот промпт идёт первым текстовым блоком; PDF — вторым.
 */
export function buildResumeAnalyzerPromptForPDF(
  data: Pick<ResumeAnalyzerFormData, "jobDescription">
): string {
  return `${ROLE}
${OUTPUT_FORMAT}

JOB DESCRIPTION:
${data.jobDescription}

The candidate's resume is provided as the attached PDF document. Read it carefully.

Analyze now. Be honest, specific, and constructive.`;
}
