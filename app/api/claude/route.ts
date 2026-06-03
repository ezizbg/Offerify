import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import type { ClaudeRequestBody } from "@/types";
import { buildCoverLetterPrompt } from "@/prompts/coverLetter";
import { buildJobDescriptionPrompt } from "@/prompts/jobDescription";
import { buildResumeAnalyzerPrompt } from "@/prompts/resumeAnalyzer";

// ═══════════════════════════════════
// API ROUTE HANDLER — /api/claude
//
// Этот файл запускается ТОЛЬКО на сервере (Node.js runtime).
// API ключ недоступен на клиенте — это production-подход.
//
// Архитектура:
//   Browser → POST /api/claude → (сервер) Anthropic API → Stream → Browser
//
// Streaming через ReadableStream: токены идут к пользователю
// сразу по мере генерации, без ожидания полного ответа.
// ═══════════════════════════════════

// Инициализируем клиент Anthropic один раз при старте модуля
// process.env.ANTHROPIC_API_KEY доступен только server-side
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Максимальное количество токенов в ответе
const MAX_TOKENS = 1500;

// Модель Claude — claude-3-5-haiku быстрее и дешевле для streaming UX
const MODEL = "claude-3-5-haiku-20241022";

export async function POST(request: NextRequest) {
  try {
    // Парсим тело запроса с валидацией типа
    const body: ClaudeRequestBody = await request.json();
    const { mode, data } = body;

    // Проверка наличия обязательных полей
    if (!mode || !data) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: mode and data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Выбираем нужный промпт в зависимости от режима
    let prompt: string;

    switch (mode) {
      case "cover-letter":
        prompt = buildCoverLetterPrompt(data as Parameters<typeof buildCoverLetterPrompt>[0]);
        break;
      case "job-description":
        prompt = buildJobDescriptionPrompt(data as Parameters<typeof buildJobDescriptionPrompt>[0]);
        break;
      case "resume-analyzer":
        prompt = buildResumeAnalyzerPrompt(data as Parameters<typeof buildResumeAnalyzerPrompt>[0]);
        break;
      default:
        return new Response(
          JSON.stringify({ error: "Invalid mode" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    // Запускаем стриминг запрос к Anthropic API
    const stream = await anthropic.messages.stream({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // ReadableStream — нативный Web API для стриминга данных
    // Каждый чанк текста сразу отправляется в браузер
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          for await (const chunk of stream) {
            // Обрабатываем только текстовые дельты (сами токены)
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              const text = chunk.delta.text;
              // Кодируем строку в Uint8Array — формат для ReadableStream
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (streamError) {
          // Передаём ошибку стрима в поток с префиксом для клиента
          controller.enqueue(
            encoder.encode(`\n\n[ERROR]: ${streamError instanceof Error ? streamError.message : "Stream error"}`)
          );
        } finally {
          controller.close();
        }
      },
    });

    // Возвращаем поток с правильными заголовками
    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        // Не кешировать — каждый запрос уникален
        "Cache-Control": "no-cache, no-store",
        // Chunked transfer — данные идут кусками без Content-Length
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("[API/claude] Error:", error);

    // Определяем тип ошибки для понятного сообщения пользователю
    const errorMessage =
      error instanceof Anthropic.APIError
        ? `Anthropic API error: ${error.message}`
        : error instanceof Error
        ? error.message
        : "An unexpected error occurred";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
