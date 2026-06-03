"use client";

import { useState } from "react";
import styles from "./CoverLetterGenerator.module.scss";
import StreamingOutput from "@/components/StreamingOutput/StreamingOutput";
import { useStreaming } from "@/hooks/useStreaming";
import type { CoverLetterFormData } from "@/types";

const INITIAL: CoverLetterFormData = { jobDescription: "", resume: "" };

export default function CoverLetterGenerator() {
  const [form, setForm] = useState<CoverLetterFormData>(INITIAL);
  const { content, status, generate, reset } = useStreaming();

  const isLoading  = status === "loading" || status === "streaming";
  const hasContent = status !== "idle" || !!content;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.jobDescription.trim() || !form.resume.trim()) return;
    await generate("cover-letter", form);
  };

  const handleReset = () => { setForm(INITIAL); reset(); };

  return (
    <div className={styles.wrapper}>
      {/* Форма */}
      <div className={styles.formPanel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Cover Letter Generator</h2>
          <p className={styles.panelSub}>Paste the job description and your resume — Claude crafts a personalized letter.</p>
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
              onChange={(e) => setForm((p) => ({ ...p, jobDescription: e.target.value }))}
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
              onChange={(e) => setForm((p) => ({ ...p, resume: e.target.value }))}
              rows={8}
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
                ? <><span className={styles.spinner} aria-hidden="true" />Generating…</>
                : "Generate Cover Letter"
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

      {/* Результат */}
      <div className={styles.outputPanel}>
        <StreamingOutput
          content={content}
          status={status}
          emptyMessage="Your cover letter will appear here."
        />
      </div>
    </div>
  );
}
