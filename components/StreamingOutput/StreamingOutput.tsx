"use client";

import styles from "./StreamingOutput.module.scss";
import CopyButton from "@/components/CopyButton/CopyButton";
import Loader from "@/components/Loader/Loader";
import type { StreamingStatus } from "@/types";

interface StreamingOutputProps {
  content: string;
  status: StreamingStatus;
  emptyMessage?: string;
}

export default function StreamingOutput({ content, status, emptyMessage = "Your result will appear here" }: StreamingOutputProps) {

  if (status === "idle" && !content) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon} aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="6" y="9"  width="28" height="3" rx="1.5" fill="currentColor" />
            <rect x="6" y="17" width="22" height="3" rx="1.5" fill="currentColor" opacity="0.6" />
            <rect x="6" y="25" width="18" height="3" rx="1.5" fill="currentColor" opacity="0.3" />
          </svg>
        </div>
        <p className={styles.emptyText}>{emptyMessage}</p>
      </div>
    );
  }

  if (status === "loading") {
    return <div className={styles.loadingWrap}><Loader text="Thinking" /></div>;
  }

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

  const isStreaming = status === "streaming";

  return (
    <div className={`${styles.output} ${isStreaming ? styles.outputStreaming : styles.outputDone}`}>
      {/* Шапка со статусом и кнопкой копирования */}
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
                <path d="M2 6.5l3 3 5.5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            Done
          </span>
        )}

        {content && !isStreaming && <CopyButton text={content} />}
      </div>

      {/* Контент */}
      <div className={styles.outputContent}>
        <pre className={styles.outputText}>
          {content}
          {isStreaming && <span className={styles.cursor} aria-hidden="true" />}
        </pre>
      </div>
    </div>
  );
}
