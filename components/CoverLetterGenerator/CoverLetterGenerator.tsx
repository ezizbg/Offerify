"use client";

import { useState } from "react";
import styles from "./CoverLetterGenerator.module.scss";
import StreamingOutput from "@/components/StreamingOutput/StreamingOutput";
import { useStreaming } from "@/hooks/useStreaming";
import type { CoverLetterFormData } from "@/types";

const INITIAL_FORM: CoverLetterFormData = {
  jobDescription: "",
  resume: "",
};

// Форма генератора сопроводительных писем
// useStreaming хук управляет состоянием запроса
export default function CoverLetterGenerator() {
  const [form, setForm] = useState<CoverLetterFormData>(INITIAL_FORM);
  const { content, status, generate, reset } = useStreaming();

  const isLoading = status === "loading" || status === "streaming";
  const hasContent = status !== "idle" || !!content;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.jobDescription.trim() || !form.resume.trim()) return;
    await generate("cover-letter", form);
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    reset();
  };

  return (
    <div className={styles.wrapper}>
      {/* Левая колонка — форма ввода */}
      <div className={styles.formPanel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Cover Letter Generator</h2>
          <p className={styles.panelSubtitle}>
            Paste the job description and your resume — Claude will craft a personalized letter.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="cl-job">
              Job Description <span className={styles.required}>*</span>
            </label>
            <textarea
              id="cl-job"
              className={styles.textarea}
              placeholder="Paste the full job description here..."
              value={form.jobDescription}
              onChange={(e) => setForm((prev) => ({ ...prev, jobDescription: e.target.value }))}
              rows={8}
              required
              disabled={isLoading}
            />
            <span className={styles.charCount}>{form.jobDescription.length} chars</span>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="cl-resume">
              Your Resume <span className={styles.required}>*</span>
            </label>
            <textarea
              id="cl-resume"
              className={styles.textarea}
              placeholder="Paste your resume text here..."
              value={form.resume}
              onChange={(e) => setForm((prev) => ({ ...prev, resume: e.target.value }))}
              rows={8}
              required
              disabled={isLoading}
            />
            <span className={styles.charCount}>{form.resume.length} chars</span>
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading || !form.jobDescription.trim() || !form.resume.trim()}
            >
              {isLoading ? (
                <>
                  <span className={styles.buttonSpinner} aria-hidden="true" />
                  Generating...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M8 2l1.5 4.5H14l-3.8 2.8 1.5 4.5L8 11l-3.7 2.8 1.5-4.5L2 6.5h4.5L8 2z"
                      fill="currentColor" />
                  </svg>
                  Generate Cover Letter
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

      {/* Правая колонка — результат */}
      <div className={styles.outputPanel}>
        <StreamingOutput
          content={content}
          status={status}
          emptyMessage="Your cover letter will appear here. Fill in the form and click Generate."
        />
      </div>
    </div>
  );
}
