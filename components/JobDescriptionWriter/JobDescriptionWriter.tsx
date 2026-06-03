"use client";

import { useState } from "react";
import styles from "./JobDescriptionWriter.module.scss";
import StreamingOutput from "@/components/StreamingOutput/StreamingOutput";
import { useStreaming } from "@/hooks/useStreaming";
import type { JobDescriptionFormData } from "@/types";

const INITIAL_FORM: JobDescriptionFormData = {
  role: "",
  requirements: "",
};

// Форма для написания описания вакансии
// Использует тот же паттерн что и CoverLetterGenerator — через useStreaming
export default function JobDescriptionWriter() {
  const [form, setForm] = useState<JobDescriptionFormData>(INITIAL_FORM);
  const { content, status, generate, reset } = useStreaming();

  const isLoading = status === "loading" || status === "streaming";
  const hasContent = status !== "idle" || !!content;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.role.trim() || !form.requirements.trim()) return;
    await generate("job-description", form);
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    reset();
  };

  return (
    <div className={styles.wrapper}>
      {/* Форма ввода */}
      <div className={styles.formPanel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Job Description Writer</h2>
          <p className={styles.panelSubtitle}>
            Describe the role and requirements — get a professional, inclusive job posting.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="jd-role">
              Role / Position Title <span className={styles.required}>*</span>
            </label>
            <input
              id="jd-role"
              type="text"
              className={styles.input}
              placeholder="e.g. Senior Frontend Engineer, Product Manager, UX Designer..."
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
              required
              disabled={isLoading}
              maxLength={200}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="jd-req">
              Requirements & Context <span className={styles.required}>*</span>
            </label>
            <textarea
              id="jd-req"
              className={styles.textarea}
              placeholder={`Describe what you're looking for in free form. Include:
• Key skills and technologies
• Years of experience
• Team size and structure
• Company stage (startup, enterprise...)
• Salary range (optional)
• Remote / hybrid / office
• Any unique perks or selling points`}
              value={form.requirements}
              onChange={(e) => setForm((prev) => ({ ...prev, requirements: e.target.value }))}
              rows={11}
              required
              disabled={isLoading}
            />
            <span className={styles.charCount}>{form.requirements.length} chars</span>
          </div>

          {/* Быстрые подсказки */}
          <div className={styles.tips}>
            <span className={styles.tipsLabel}>Tip:</span>
            <span className={styles.tipsText}>
              More context = better JD. Include tech stack, team culture, and what makes this role unique.
            </span>
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading || !form.role.trim() || !form.requirements.trim()}
            >
              {isLoading ? (
                <>
                  <span className={styles.buttonSpinner} aria-hidden="true" />
                  Writing...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M2 12V3a1 1 0 011-1h7l3 3v7a1 1 0 01-1 1H3a1 1 0 01-1-1z"
                      stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M9 2v3h3M5 7h6M5 9.5h6M5 12h4"
                      stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  Write Job Description
                </>
              )}
            </button>

            {hasContent && (
              <button
                type="button"
                className={styles.resetButton}
                onClick={handleReset}
                disabled={isLoading}
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Результат */}
      <div className={styles.outputPanel}>
        <StreamingOutput
          content={content}
          status={status}
          emptyMessage="Your job description will appear here. Describe the role and click Write."
        />
      </div>
    </div>
  );
}
