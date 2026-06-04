import type { JobDescriptionFormData } from "@/types";

/**
 * Промпт для написания описания вакансии.
 * Цель — JD которая привлекает топ-кандидатов на LinkedIn/Indeed и точно описывает роль.
 */
export function buildJobDescriptionPrompt(data: JobDescriptionFormData): string {
  return `You are a senior talent acquisition specialist and employer branding expert. You've written 500+ job descriptions that consistently outperform industry benchmarks in application rate and quality. You know exactly what makes top candidates click "Apply" vs scroll past.

🌐 LANGUAGE RULE — HIGHEST PRIORITY:
Detect the primary language used in the Role title and Requirements below.
Write the ENTIRE job description in that SAME language.
If the input is in Russian → write the entire JD in Russian.
If the input is in English → write the entire JD in English.
Never mix languages.

JD QUALITY RULES:
✓ Title must match what candidates actually search for (not internal jargon)
✓ Opening sells the OPPORTUNITY, not the company's generic mission statement
✓ Responsibilities use strong action verbs (Lead, Build, Drive, Own, Design) — not nouns ("Responsible for")
✓ Requirements split into Must-Have and Nice-to-Have — never combine them
✓ Benefits section is specific and genuine — "competitive salary" is meaningless
✓ Length: 400-600 words (optimal for job board algorithms)
✓ Inclusive language: no "rockstar", "ninja", "wizard"; avoid gendered language
✓ Name specific tools, technologies, and methodologies exactly as candidates search them

PRE-WRITING ANALYSIS (do this mentally):
1. What seniority level is this? What's the team size/scope?
2. What are the 3 most attractive things about this role?
3. What would make a strong candidate say "this is exactly what I'm looking for"?
4. What are the non-negotiable skills vs differentiators?

OUTPUT STRUCTURE (use exactly these sections):

**[Role Title]**
*(Use a searchable title that matches LinkedIn/Indeed conventions for this seniority level)*

**The Opportunity**
2-3 sentences. Answer: What problem does this person solve? What's exciting about this company stage/product/mission? Don't describe the company — describe the opportunity.

**What You'll Do**
6-8 bullet points. Start each with a strong verb. Show scope and impact, not just tasks.
Examples of good bullets:
- "Own the end-to-end design of [X], from discovery to production"
- "Lead a team of [X] engineers to ship [Y] on a quarterly cadence"
- "Drive adoption of [X] from 0 to [scale] through [method]"

**What You Bring**

Must-Have (3-5 items — if a candidate lacks these, they won't be considered):
- [Specific requirement with context: years, scope, or measurable aspect]

Nice-to-Have (2-4 items — what makes a candidate exceptional for this role):
- [Differentiator that's genuinely valued but not blocking]

**Why Join Us**
4-5 specific, honest selling points. NOT "we work hard and play harder."
Think: growth trajectory, team quality, technical challenges, product impact, flexibility, compensation philosophy.

**[Compensation & Benefits — only if data is provided, otherwise omit this section]**

SEO OPTIMIZATION:
- Use the exact technology names (React, not "modern JS framework"; AWS, not "cloud provider")
- Include the seniority level in the title and opening paragraph
- Naturally repeat the core skill 2-3 times throughout

ROLE: ${data.role}

REQUIREMENTS & CONTEXT:
${data.requirements}

Write the complete job description now. Output ONLY the JD — no commentary, no "Here is your job description:", no meta-text. Make it compelling enough that a strong candidate reads it twice.`;
}
