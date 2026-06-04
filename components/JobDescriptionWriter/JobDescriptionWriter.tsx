"use client";

import { useState } from "react";
import styles from "./JobDescriptionWriter.module.scss";
import StreamingOutput from "@/components/StreamingOutput/StreamingOutput";
import Spinner from "@/components/Spinner/Spinner";
import { useStreaming } from "@/hooks/useStreaming";
import type { JobDescriptionFormData } from "@/types";

const INITIAL: JobDescriptionFormData = { role: "", requirements: "" };

export default function JobDescriptionWriter() {
  const [form, setForm] = useState<JobDescriptionFormData>(INITIAL);
  const { content, status, generate, reset } = useStreaming();

  const isLoading  = status === "loading" || status === "streaming";
  const hasContent = status !== "idle" || !!content;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.role.trim() || !form.requirements.trim()) return;
    await generate("job-description", form);
  };

  const handleReset = () => { setForm(INITIAL); reset(); };

  return (
    <div className={styles.wrapper}>
      <div className={styles.formPanel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Job Description Writer</h2>
          <p className={styles.panelSub}>Describe the role — get a structured, inclusive job posting.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="jd-role">
              Position Title <span className={styles.required}>*</span>
            </label>
            <input
              id="jd-role"
              type="text"
              className={styles.input}
              placeholder="e.g. Senior Frontend Engineer, Product Manager…"
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
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
              placeholder={`Describe what you're looking for — skills, experience, team size, remote/office, salary range, company stage…`}
              value={form.requirements}
              onChange={(e) => setForm((p) => ({ ...p, requirements: e.target.value }))}
              rows={12}
              required
              disabled={isLoading}
            />
            <span className={styles.charCount}>{form.requirements.length} chars</span>
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading || !form.role.trim() || !form.requirements.trim()}
            >
              {isLoading
                ? <><Spinner />Writing…</>
                : "Write Job Description"
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
          emptyMessage="Your job description will appear here."
        />
      </div>
    </div>
  );
}
