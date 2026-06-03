"use client";

import { useState } from "react";
import styles from "./ResumeAnalyzer.module.scss";
import StreamingOutput from "@/components/StreamingOutput/StreamingOutput";
import { useStreaming } from "@/hooks/useStreaming";
import type { ResumeAnalyzerFormData } from "@/types";

const INITIAL: ResumeAnalyzerFormData = { jobDescription: "", resume: "" };

// Что анализирует инструмент — без emoji, только текст
const FEATURES = ["Match Score", "Strengths", "Gaps", "Recommendations", "ATS Keywords"];

export default function ResumeAnalyzer() {
  const [form, setForm] = useState<ResumeAnalyzerFormData>(INITIAL);
  const { content, status, generate, reset } = useStreaming();

  const isLoading  = status === "loading" || status === "streaming";
  const hasContent = status !== "idle" || !!content;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.jobDescription.trim() || !form.resume.trim()) return;
    await generate("resume-analyzer", form);
  };

  const handleReset = () => { setForm(INITIAL); reset(); };

  return (
    <div className={styles.wrapper}>
      <div className={styles.formPanel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Resume Analyzer</h2>
          <p className={styles.panelSub}>ATS-style analysis: match score, gaps, and specific recommendations.</p>
        </div>

        {/* Теги что входит в анализ — минималистично */}
        <div className={styles.features}>
          {FEATURES.map((f) => (
            <span key={f} className={styles.featureTag}>{f}</span>
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
              placeholder="Paste the job description you're applying for…"
              value={form.jobDescription}
              onChange={(e) => setForm((p) => ({ ...p, jobDescription: e.target.value }))}
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
              placeholder="Paste your full resume text here…"
              value={form.resume}
              onChange={(e) => setForm((p) => ({ ...p, resume: e.target.value }))}
              rows={7}
              required
              disabled={isLoading}
            />
            <span className={styles.charCount}>{form.resume.length} chars</span>
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading || !form.jobDescription.trim() || !form.resume.trim()}
            >
              {isLoading
                ? <><span className={styles.spinner} aria-hidden="true" />Analyzing…</>
                : "Analyze Resume"
              }
            </button>
            {hasContent && (
              <button type="button" className={styles.resetBtn} onClick={handleReset} disabled={isLoading}>
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      <div className={styles.outputPanel}>
        <StreamingOutput
          content={content}
          status={status}
          emptyMessage="Your analysis will appear here."
        />
      </div>
    </div>
  );
}
