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

// Компонент вывода стримингового ответа.
// Рендерит разные состояния: пусто / загрузка / стриминг / готово / ошибка.
// Использует white-space: pre-wrap для сохранения переносов строк из ответа Claude.
export default function StreamingOutput({
  content,
  status,
  emptyMessage = "Your result will appear here",
}: StreamingOutputProps) {

  // Пустое состояние — нет ни контента, ни загрузки
  if (status === "idle" && !content) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon} aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="10" width="32" height="4" rx="2" fill="currentColor" opacity="0.2" />
            <rect x="8" y="20" width="28" height="4" rx="2" fill="currentColor" opacity="0.15" />
            <rect x="8" y="30" width="24" height="4" rx="2" fill="currentColor" opacity="0.1" />
          </svg>
        </div>
        <p className={styles.emptyText}>{emptyMessage}</p>
      </div>
    );
  }

  // Состояние загрузки (до первого токена)
  if (status === "loading") {
    return (
      <div className={styles.loadingWrapper}>
        <Loader text="Thinking" />
      </div>
    );
  }

  // Состояние ошибки
  if (status === "error") {
    return (
      <div className={styles.errorWrapper} role="alert">
        <div className={styles.errorIcon} aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className={styles.errorTitle}>Something went wrong</p>
          <p className={styles.errorMessage}>{content || "An unexpected error occurred. Please try again."}</p>
        </div>
      </div>
    );
  }

  // Основной вывод — стриминг или готовый результат
  const isStreaming = status === "streaming";

  return (
    <div className={`${styles.output} ${isStreaming ? styles.outputStreaming : styles.outputDone}`}>
      {/* Шапка с кнопкой копирования */}
      <div className={styles.outputHeader}>
        <div className={styles.outputMeta}>
          {isStreaming ? (
            <span className={styles.streamingBadge}>
              <span className={styles.streamingDot} aria-hidden="true" />
              Generating
            </span>
          ) : (
            <span className={styles.doneBadge}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2.5 7l3.5 3.5 5.5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Done
            </span>
          )}
        </div>

        {/* Кнопка копирования только когда есть контент */}
        {content && !isStreaming && (
          <CopyButton text={content} />
        )}
      </div>

      {/* Контент с печатающимся курсором во время стриминга */}
      <div className={styles.outputContent}>
        <pre className={styles.outputText}>
          {content}
          {/* Мигающий курсор — виден только во время стриминга */}
          {isStreaming && <span className={styles.cursor} aria-hidden="true" />}
        </pre>
      </div>
    </div>
  );
}
