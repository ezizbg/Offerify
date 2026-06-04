"use client";

import { useState, useRef, useCallback } from "react";
import styles from "./ResumeAnalyzer.module.scss";
import StreamingOutput from "@/components/StreamingOutput/StreamingOutput";
import { useStreaming } from "@/hooks/useStreaming";
import type { ResumeAnalyzerFormData } from "@/types";

const FEATURES = ["Match Score", "Strengths", "Gaps", "Recommendations", "ATS Keywords"];
const MAX_PDF_BYTES = 5 * 1024 * 1024; // 5 MB

/** Читает File как base64 без data: префикса */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]); // убираем "data:application/pdf;base64,"
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ResumeAnalyzer() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumePdf, setResumePdf]   = useState<{ file: File; base64: string } | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [textMode, setTextMode]     = useState(false);
  const [dragOver, setDragOver]     = useState(false);
  const [pdfError, setPdfError]     = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { content, status, generate, reset } = useStreaming();

  const isLoading  = status === "loading" || status === "streaming";
  const hasContent = status !== "idle" || !!content;
  const hasResume  = resumePdf !== null || (textMode && resumeText.trim().length > 0);
  const canSubmit  = jobDescription.trim().length > 0 && hasResume && !isLoading;

  // ─── Обработка файла ──────────────────────────────────
  const handleFile = useCallback(async (file: File) => {
    setPdfError("");
    if (file.type !== "application/pdf") {
      setPdfError("Please upload a PDF file.");
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      setPdfError("File too large. Maximum 5 MB.");
      return;
    }
    try {
      const base64 = await fileToBase64(file);
      setResumePdf({ file, base64 });
    } catch {
      setPdfError("Could not read file. Please try again.");
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (isLoading) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile, isLoading]
  );

  // ─── Submit ───────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const formData: ResumeAnalyzerFormData = {
      jobDescription,
      resume: resumeText,
      resumePdfBase64: resumePdf?.base64,
    };
    await generate("resume-analyzer", formData);
  };

  const handleReset = () => {
    setJobDescription("");
    setResumePdf(null);
    setResumeText("");
    setPdfError("");
    setTextMode(false);
    reset();
  };

  return (
    <div className={styles.wrapper}>
      {/* ─── Form Panel ─── */}
      <div className={styles.formPanel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Resume Analyzer</h2>
          <p className={styles.panelSub}>
            ATS-style analysis: match score, gaps, and specific recommendations.
          </p>
        </div>

        <div className={styles.features}>
          {FEATURES.map((f) => (
            <span key={f} className={styles.featureTag}>{f}</span>
          ))}
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Job Description */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ra-job">
              Job Description <span className={styles.required}>*</span>
            </label>
            <textarea
              id="ra-job"
              className={styles.textarea}
              placeholder="Paste the job description you're applying for…"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={7}
              required
              disabled={isLoading}
            />
            <span className={styles.charCount}>{jobDescription.length} chars</span>
          </div>

          {/* Resume — PDF upload or text fallback */}
          <div className={styles.field}>
            <label className={styles.label}>
              Your Resume <span className={styles.required}>*</span>
            </label>

            {!textMode ? (
              <>
                {/* ── Upload zone ── */}
                <div
                  className={[
                    styles.uploadZone,
                    dragOver          ? styles.uploadZoneDrag     : "",
                    resumePdf         ? styles.uploadZoneFilled   : "",
                    isLoading         ? styles.uploadZoneDisabled : "",
                  ].filter(Boolean).join(" ")}
                  onClick={() => !isLoading && !resumePdf && fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); if (!isLoading) setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  role="button"
                  tabIndex={isLoading ? -1 : 0}
                  aria-label="Upload PDF resume"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isLoading && !resumePdf)
                      fileInputRef.current?.click();
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                      e.target.value = ""; // сброс input
                    }}
                    disabled={isLoading}
                  />

                  {resumePdf ? (
                    /* ── File selected ── */
                    <div className={styles.uploadFilled}>
                      <svg className={styles.uploadFileIcon} width="20" height="20"
                        viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <rect x="3" y="2" width="14" height="18" rx="2"
                          stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M7 7h8M7 11h8M7 15h5"
                          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <div className={styles.uploadFileInfo}>
                        <span className={styles.uploadFileName}>{resumePdf.file.name}</span>
                        <span className={styles.uploadFileSize}>
                          {(resumePdf.file.size / 1024 / 1024).toFixed(1)} MB · Ready
                        </span>
                      </div>
                      <button
                        type="button"
                        className={styles.uploadRemove}
                        onClick={(e) => {
                          e.stopPropagation();
                          setResumePdf(null);
                          setPdfError("");
                        }}
                        aria-label="Remove file"
                        disabled={isLoading}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="M1.5 1.5l9 9M10.5 1.5l-9 9"
                            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    /* ── Empty state ── */
                    <div className={styles.uploadEmpty}>
                      <svg className={styles.uploadIcon} width="22" height="22"
                        viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M12 15V4M12 4L8 8M12 4l4 4"
                          stroke="currentColor" strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2"
                          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <span className={styles.uploadLabel}>
                        {dragOver ? "Release to upload" : "Drop PDF here or click to browse"}
                      </span>
                      <span className={styles.uploadHint}>Max 5 MB · PDF only</span>
                    </div>
                  )}
                </div>

                {pdfError && (
                  <span className={styles.uploadError} role="alert">{pdfError}</span>
                )}

                <button
                  type="button"
                  className={styles.modeToggle}
                  onClick={() => { setTextMode(true); setResumePdf(null); setPdfError(""); }}
                >
                  Or paste text instead →
                </button>
              </>
            ) : (
              /* ── Text mode ── */
              <>
                <textarea
                  className={styles.textarea}
                  placeholder="Paste your full resume text here…"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={7}
                  disabled={isLoading}
                />
                <div className={styles.textModeRow}>
                  <span className={styles.charCount}>{resumeText.length} chars</span>
                  <button
                    type="button"
                    className={styles.modeToggle}
                    onClick={() => { setTextMode(false); setResumeText(""); }}
                  >
                    ← Upload PDF instead
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!canSubmit}
            >
              {isLoading ? (
                <><span className={styles.spinner} aria-hidden="true" />Analyzing…</>
              ) : (
                "Analyze Resume"
              )}
            </button>
            {hasContent && (
              <button
                type="button"
                className={styles.resetBtn}
                onClick={handleReset}
                disabled={isLoading}
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ─── Output Panel ─── */}
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
