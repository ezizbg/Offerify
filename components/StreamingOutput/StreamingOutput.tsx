"use client";

import ReactMarkdown from "react-markdown";
import styles from "./StreamingOutput.module.scss";
import CopyButton from "@/components/CopyButton/CopyButton";
import type { StreamingStatus } from "@/types";

interface StreamingOutputProps {
  content: string;
  status: StreamingStatus;
  emptyMessage?: string;
}

const SKELETON_GROUPS = [
  [92, 87, 95, 78],
  [96, 82, 89, 71, 84],
  [88, 64, 75],
];

export default function StreamingOutput({
  content,
  status,
  emptyMessage = "Your result will appear here",
}: StreamingOutputProps) {

  // ── Idle ────────────────────────────────────────────────
  if (status === "idle" && !content) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon} aria-hidden="true">
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
            <rect x="5" y="8"  width="28" height="3" rx="1.5" fill="currentColor" />
            <rect x="5" y="16" width="21" height="3" rx="1.5" fill="currentColor" opacity="0.55" />
            <rect x="5" y="24" width="16" height="3" rx="1.5" fill="currentColor" opacity="0.25" />
          </svg>
        </div>
        <p className={styles.emptyText}>{emptyMessage}</p>
      </div>
    );
  }

  // ── Loading — animated skeleton ──────────────────────────
  if (status === "loading") {
    let delay = 0;
    return (
      <div className={`${styles.output} ${styles.outputLoading}`}>
        <div className={styles.outputHeader}>
          <span className={`${styles.statusBadge} ${styles.streamingBadge}`}>
            <span className={styles.streamingDot} aria-hidden="true" />
            Claude is thinking…
          </span>
        </div>
        <div className={styles.skeleton} aria-busy="true" aria-label="Generating">
          {SKELETON_GROUPS.map((group, gi) => (
            <div key={gi} className={styles.skeletonGroup}>
              {group.map((w, li) => {
                const d = delay;
                delay += 0.08;
                return (
                  <div
                    key={li}
                    className={styles.skeletonLine}
                    style={{ width: `${w}%`, animationDelay: `${d}s` }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────
  if (status === "error") {
    return (
      <div className={styles.errorWrap} role="alert">
        <div className={styles.errorIcon} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 6.5v4M10 13h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className={styles.errorTitle}>Something went wrong</p>
          <p className={styles.errorMsg}>{content || "An unexpected error occurred. Please try again."}</p>
        </div>
      </div>
    );
  }

  // ── Streaming / Done ─────────────────────────────────────
  const isStreaming = status === "streaming";

  return (
    <div className={`${styles.output} ${isStreaming ? styles.outputStreaming : styles.outputDone}`}>
      {/* Header */}
      <div className={styles.outputHeader}>
        {isStreaming ? (
          <span className={`${styles.statusBadge} ${styles.streamingBadge}`}>
            <span className={styles.streamingDot} aria-hidden="true" />
            Generating
          </span>
        ) : (
          <span className={`${styles.statusBadge} ${styles.doneBadge}`}>
            <span className={styles.doneIcon} aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5l3 3 5.5-6" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            Done
          </span>
        )}
        {content && !isStreaming && <CopyButton text={content} />}
      </div>

      {/* Rendered markdown content */}
      <div className={styles.outputContent}>
        <div className={`${styles.markdown} ${isStreaming ? styles.markdownStreaming : ""}`}>
          <ReactMarkdown>{content}</ReactMarkdown>
          {isStreaming && <span className={styles.cursor} aria-hidden="true" />}
        </div>
      </div>
    </div>
  );
}
