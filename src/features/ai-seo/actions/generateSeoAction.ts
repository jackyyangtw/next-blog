"use server";

import { getServerSession } from "next-auth";
import { ZodError } from "zod";

import { authOptions } from "@/lib/auth/auth";
import {
  AI_SEO_CONTENT_MAX_LENGTH,
  generateSeoRequestSchema,
} from "../schemas/generateSeoRequestSchema";
import { generateSeo, AiSeoError } from "../server/generateSeo";
import type { GenerateSeoActionResult } from "../types";

function inputErrorMessage(error: ZodError) {
  return error.issues[0]?.message || "SEO request input is invalid.";
}

function generationErrorMessage(error: AiSeoError) {
  switch (error.code) {
    case "MISSING_API_KEY":
      return "AI SEO 尚未設定 API key，請先確認後台環境變數。";
    case "PROVIDER_QUOTA_EXCEEDED":
      return "OpenAI API 額度不足或 billing 尚未啟用，請檢查 OpenAI plan 與用量。";
    case "PROVIDER_RATE_LIMIT":
      return "AI 服務目前流量過高，請稍後再試。";
    case "PROVIDER_TIMEOUT":
      return "AI 服務回應逾時，請稍後再試。";
    case "INVALID_STRUCTURED_OUTPUT":
      return "AI 回傳格式不符合 SEO 建議規格，請重新產生一次。";
    case "PROVIDER_FAILURE":
      return "目前無法產生 SEO 建議，請稍後再試。";
  }
}

export async function generateSeoAction(
  input: unknown,
): Promise<GenerateSeoActionResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "請先登入後再產生 SEO 建議。",
      },
    };
  }

  if (session.user.role !== "admin") {
    return {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "你沒有產生 SEO 建議的權限。",
      },
    };
  }

  const parsed = generateSeoRequestSchema.safeParse(input);

  if (!parsed.success) {
    const isContentTooLarge = parsed.error.issues.some(
      (issue) =>
        issue.path[0] === "content" &&
        issue.code === "too_big" &&
        issue.maximum === AI_SEO_CONTENT_MAX_LENGTH,
    );

    return {
      success: false,
      error: {
        code: isContentTooLarge ? "CONTENT_TOO_LARGE" : "INVALID_INPUT",
        message: inputErrorMessage(parsed.error),
      },
    };
  }

  try {
    return {
      success: true,
      data: await generateSeo(parsed.data),
    };
  } catch (error) {
    const mappedError =
      error instanceof AiSeoError ? error : new AiSeoError("PROVIDER_FAILURE");

    return {
      success: false,
      error: {
        code: "AI_SEO_GENERATION_FAILED",
        message: generationErrorMessage(mappedError),
      },
    };
  }
}
