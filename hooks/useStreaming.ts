"use client";

import { useState, useCallback, useRef } from "react";
import type { TabMode, StreamingStatus, ClaudeRequestBody } from "@/types";

interface UseStreamingResult {
  content: string;
  status: StreamingStatus;
  generate: (mode: TabMode, data: ClaudeRequestBody["data"]) => Promise<void>;
  reset: () => void;
}

/**
 * Хук инкапсулирует всю логику стриминга:
 * - fetch к /api/claude
 * - чтение ReadableStream токен за токеном
 * - управление статусом (idle → loading → streaming → done/error)
 * - сброс состояния
 *
 * Используется во всех трёх компонентах-формах.
 */
export function useStreaming(): UseStreamingResult {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<StreamingStatus>("idle");
  // Ref для отмены текущего запроса при размонтировании или быстром сбросе
  const abortControllerRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (
    mode: TabMode,
    data: ClaudeRequestBody["data"]
  ) => {
    // Прерываем предыдущий запрос если он был
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setContent("");
    setStatus("loading");

    try {
      const response = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, data } satisfies ClaudeRequestBody),
        signal: abortController.signal,
      });

      // Если сервер вернул ошибку — читаем JSON и показываем
      if (!response.ok) {
        const errorData = await response.json();
        setContent(errorData.error ?? "An error occurred");
        setStatus("error");
        return;
      }

      if (!response.body) {
        setContent("No response body received");
        setStatus("error");
        return;
      }

      // Читаем стрим по кускам
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      setStatus("streaming");

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        // Декодируем бинарный чанк в строку и добавляем к контенту
        const chunk = decoder.decode(value, { stream: true });

        // Проверяем на inline-ошибку от сервера
        if (chunk.startsWith("\n\n[ERROR]:")) {
          setContent((prev) => prev + chunk);
          setStatus("error");
          return;
        }

        setContent((prev) => prev + chunk);
      }

      setStatus("done");
    } catch (error) {
      // AbortError — пользователь сбросил форму, это нормально
      if (error instanceof Error && error.name === "AbortError") return;

      setContent(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    // Прерываем активный запрос при сбросе
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setContent("");
    setStatus("idle");
  }, []);

  return { content, status, generate, reset };
}
