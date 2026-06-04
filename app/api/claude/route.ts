import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import type { ClaudeRequestBody, CoverLetterFormData, ResumeAnalyzerFormData } from "@/types";
import { buildCoverLetterPrompt, buildCoverLetterPromptForPDF } from "@/prompts/coverLetter";
import { buildJobDescriptionPrompt } from "@/prompts/jobDescription";
import { buildResumeAnalyzerPrompt, buildResumeAnalyzerPromptForPDF } from "@/prompts/resumeAnalyzer";

// ═══════════════════════════════════════════════════════════
// SECURITY: Rate Limiter
// Простой in-memory ограничитель — сбрасывается при cold start
// (serverless). Для продакшена → Upstash Redis / Vercel KV.
// ═══════════════════════════════════════════════════════════
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX    = 20;         // запросов
const RATE_LIMIT_WINDOW = 60_000;     // 1 минута (мс)

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkRateLimit(ip: string): boolean {
  const now   = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// Чистим просроченные записи раз в 5 минут (утечка памяти)
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}, 5 * 60_000);

// ═══════════════════════════════════════════════════════════
// SECURITY: Input size limits
// ═══════════════════════════════════════════════════════════
const MAX_TEXT_CHARS     = 12_000;   // ~3 000 токенов на поле
const MAX_PDF_B64_BYTES  = 8_388_608; // 8 MB base64 ≈ 6 MB PDF

// ═══════════════════════════════════════════════════════════
// Anthropic Client — инициализируется один раз при старте модуля.
// process.env.ANTHROPIC_API_KEY доступен ТОЛЬКО server-side.
// ═══════════════════════════════════════════════════════════
if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error(
    "[Offerify] ANTHROPIC_API_KEY is not set. Add it to .env.local"
  );
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MAX_TOKENS = 1500;
const MODEL      = "claude-haiku-4-5"; // самая быстрая и дешёвая текущая модель

// ═══════════════════════════════════════════════════════════
// POST /api/claude
// Единственная точка входа — все запросы к Anthropic идут через сервер.
// Ключ никогда не попадает в браузер.
// ═══════════════════════════════════════════════════════════
export async function POST(request: NextRequest) {
  try {
    // ── 1. Rate limit ─────────────────────────────────────
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }),
        { status: 429, headers: { "Content-Type": "application/json", "Retry-After": "60" } }
      );
    }

    // ── 2. Body size guard ────────────────────────────────
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 10_000_000) {
      return new Response(
        JSON.stringify({ error: "Request too large. Maximum 10 MB." }),
        { status: 413, headers: { "Content-Type": "application/json" } }
      );
    }

    // ── 3. Parse body ─────────────────────────────────────
    const body: ClaudeRequestBody = await request.json();
    const { mode, data } = body;

    if (!mode || !data) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: mode and data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ── 4. Text field size validation ─────────────────────
    const TEXT_FIELDS = ["jobDescription", "resume", "role", "requirements"] as const;
    for (const key of TEXT_FIELDS) {
      const val = (data as unknown as Record<string, unknown>)[key];
      if (typeof val === "string" && val.length > MAX_TEXT_CHARS) {
        return new Response(
          JSON.stringify({ error: `Field "${key}" exceeds ${MAX_TEXT_CHARS} character limit.` }),
          { status: 413, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // ── 5. Build message content ──────────────────────────
    // Для обычных режимов — строка. Для PDF — массив content-блоков.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let messageContent: string | any[];

    switch (mode) {
      // ─── Cover Letter ───────────────────────────────────
      case "cover-letter": {
        const clData = data as CoverLetterFormData;
        if (clData.resumePdfBase64) {
          if (clData.resumePdfBase64.length > MAX_PDF_B64_BYTES) {
            return new Response(
              JSON.stringify({ error: "PDF file is too large. Maximum 5 MB." }),
              { status: 413, headers: { "Content-Type": "application/json" } }
            );
          }
          messageContent = [
            { type: "text", text: buildCoverLetterPromptForPDF(clData) },
            {
              type: "document",
              source: { type: "base64", media_type: "application/pdf", data: clData.resumePdfBase64 },
            },
          ];
        } else {
          messageContent = buildCoverLetterPrompt(clData);
        }
        break;
      }

      // ─── Job Description ────────────────────────────────
      case "job-description":
        messageContent = buildJobDescriptionPrompt(
          data as Parameters<typeof buildJobDescriptionPrompt>[0]
        );
        break;

      // ─── Resume Analyzer ────────────────────────────────
      case "resume-analyzer": {
        const raData = data as ResumeAnalyzerFormData;
        if (raData.resumePdfBase64) {
          if (raData.resumePdfBase64.length > MAX_PDF_B64_BYTES) {
            return new Response(
              JSON.stringify({ error: "PDF file is too large. Maximum 5 MB." }),
              { status: 413, headers: { "Content-Type": "application/json" } }
            );
          }
          messageContent = [
            { type: "text", text: buildResumeAnalyzerPromptForPDF(raData) },
            {
              type: "document",
              source: { type: "base64", media_type: "application/pdf", data: raData.resumePdfBase64 },
            },
          ];
        } else {
          messageContent = buildResumeAnalyzerPrompt(raData);
        }
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid mode" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    // ── 6. Stream to Anthropic ────────────────────────────
    const stream = await anthropic.messages.stream({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [
        {
          role: "user",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          content: messageContent as any,
        },
      ],
    });

    // ReadableStream — токены идут к пользователю сразу по мере генерации
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
        } catch (streamError) {
          controller.enqueue(
            encoder.encode(
              `\n\n[ERROR]: ${streamError instanceof Error ? streamError.message : "Stream error"}`
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-store",
        "Transfer-Encoding": "chunked",
        // Запрещаем встраивание в iframe (защита от clickjacking)
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[API/claude] Error:", error);

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
