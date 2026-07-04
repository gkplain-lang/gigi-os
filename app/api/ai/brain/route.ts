import { NextResponse } from "next/server";
import { finalizeServerAiResponse } from "@/modules/ai/aiBrain";
import { getServerAiConfig } from "@/modules/ai/aiConfig";
import { buildOpenAiMessages } from "@/modules/ai/promptBuilder";
import { runLocalFallbackProvider } from "@/modules/ai/localFallbackProvider";
import type { AiBrainRequest, AiProviderJsonResponse } from "@/modules/ai/types";

const MAX_BODY_BYTES = 32_000;

export async function POST(req: Request) {
  const config = getServerAiConfig();

  if (!config.isConfigured) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "payload_too_large" }, { status: 413 });
  }

  let body: AiBrainRequest;
  try {
    body = JSON.parse(raw) as AiBrainRequest;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!body.userMessage?.trim()) {
    return NextResponse.json({ ok: false, error: "missing_message" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  try {
    const messages = buildOpenAiMessages(body);

    const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: 0.3,
        response_format: { type: "json_object" },
        max_tokens: 900,
      }),
    });

    if (!openAiRes.ok) {
      const fallback = runLocalFallbackProvider(body);
      return NextResponse.json({
        ok: true,
        response: { ...fallback, mode: "ai_unavailable" as const },
        error: "openai_http_error",
      });
    }

    const data = (await openAiRes.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      const fallback = runLocalFallbackProvider(body);
      return NextResponse.json({ ok: true, response: fallback, error: "empty_response" });
    }

    let parsed: AiProviderJsonResponse;
    try {
      parsed = JSON.parse(content) as AiProviderJsonResponse;
    } catch {
      const fallback = runLocalFallbackProvider(body);
      return NextResponse.json({ ok: true, response: fallback, error: "invalid_ai_json" });
    }

    const response = finalizeServerAiResponse(parsed, body);

    return NextResponse.json({
      ok: true,
      response: {
        ...response,
        rawProvider: process.env.NODE_ENV !== "production" ? parsed : undefined,
      },
    });
  } catch {
    const fallback = runLocalFallbackProvider(body);
    return NextResponse.json({
      ok: true,
      response: { ...fallback, mode: "ai_unavailable" as const },
      error: "provider_exception",
    });
  }
}
