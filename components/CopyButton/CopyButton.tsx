"use client";

import { useState, useCallback } from "react";
import styles from "./CopyButton.module.scss";

interface CopyButtonProps {
  text: string;
  /** Дополнительный CSS класс для позиционирования из родителя */
  className?: string;
}

type CopyState = "idle" | "copying" | "success" | "error";

// Кнопка копирования с анимацией подтверждения
// Использует Clipboard API — работает только на HTTPS или localhost
export default function CopyButton({ text, className }: CopyButtonProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const handleCopy = useCallback(async () => {
    if (copyState === "copying" || copyState === "success") return;

    setCopyState("copying");

    try {
      await navigator.clipboard.writeText(text);
      setCopyState("success");

      // Через 2 секунды возвращаемся в исходное состояние
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("error");
      setTimeout(() => setCopyState("idle"), 2000);
    }
  }, [text, copyState]);

  const labels: Record<CopyState, string> = {
    idle: "Copy",
    copying: "Copying...",
    success: "Copied!",
    error: "Failed",
  };

  return (
    <button
      className={`${styles.button} ${styles[copyState]} ${className ?? ""}`}
      onClick={handleCopy}
      disabled={copyState === "copying"}
      aria-label={labels[copyState]}
      title={labels[copyState]}
    >
      {/* Иконка меняется в зависимости от состояния */}
      <span className={styles.icon} aria-hidden="true">
        {copyState === "success" ? (
          // Галочка
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8l4 4 6-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : copyState === "error" ? (
          // Крестик
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          // Иконка копирования (два прямоугольника)
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="5" y="5" width="8" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M3 11V3.5A1.5 1.5 0 014.5 2H11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
      <span className={styles.label}>{labels[copyState]}</span>
    </button>
  );
}
