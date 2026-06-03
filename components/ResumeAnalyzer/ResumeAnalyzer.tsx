"use client";

import { useState } from "react";
import styles from "./ResumeAnalyzer.module.scss";
import StreamingOutput from "@/components/StreamingOutput/StreamingOutput";
import { useStreaming } from "@/hooks/useStreaming";
import type { ResumeAnalyzerFormData } from "@/types";

const INITIAL_FORM: ResumeAnalyzerFormData = {
  jobDescription: "",
  resume: "",
};

// Resume Analyzer — самый сложный режим с структурированным выводом
// Промпт возвращает markdown с процентом совпадения и разбивкой по категориям
export default function ResumeAnalyzer() {
  const [form, setForm] = useState<ResumeAnalyzerFormData>(INITIAL_FORM);
  const { content, status, generate, reset } = useStreaming();

  const isLoading = status === "loading" || status === "streaming";
  const hasContent = status !== "idle" || !!content;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.jobDescription.trim() || !form.resume.trim()) return;
    await generate("resume-analyzer", form);
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
          <h2 className={styles.panelTitle}>Resume Analyzer</h2>
          <p className={styles.panelSubtitle}>
            Get an ATS-style analysis: match score, gaps, and specific recommendations.
          </p>
        </div>

        {/* Что анализирует инструмент */}
        <div className={styles.features}>
          {[
            { icon: "📊", label: "Match Score" },
            { icon: "✅", label: "Strengths" },
            { icon: "❌", label: "Gaps" },
            { icon: "💡", label: "Recommendations" },
          ].map(({ icon, label }) => (
            <div key={label} className={styles.feature}>
              <span className={styles.featureIcon}>{icon}</span>
              <span className={styles.featureLabel}>{label}</span>
            </div>
          ))}
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ra-job">
              Job Description <span className={styles.required}>*</span>
            </label>
            <textarea
              id="ra-job"
              className={styles.textarea}
              placeholder="Paste the job description you're applying for..."
              value={form.jobDescription}
              onChange={(e) => setForm((prev) => ({ ...prev, jobDescription: e.target.value }))}
              rows={7}
              required
              disabled={isLoading}
            />
            <span className={styles.charCount}>{form.jobDescription.length} chars</span>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="ra-resume">
              Your Resume <span className={styles.required}>*</span>
            </label>
            <textarea
              id="ra-resume"
              className={styles.textarea}
              placeholder="Paste your full resume text here..."
              value={form.resume}
              onChange={(e) => setForm((prev) => ({ ...prev, resume: e.target.value }))}
              rows={7}
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
                  Analyzing...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M5 7h4M7 5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Analyze Resume
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
          emptyMessage="Your resume analysis will appear here. Paste both texts and click Analyze."
        />
      </div>
    </div>
  );
}
