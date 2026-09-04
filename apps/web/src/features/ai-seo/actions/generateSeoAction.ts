"use server";

import { getServerSession } from "next-auth";
import { ZodError } from "zod";

import { providerErrorMessage } from "@/features/ai/errors/providerErrorMessage";
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
  return providerErrorMessage(error.code, {
    featureName: "AI SEO",
    invalidOutputMessage: "AI 回傳格式不符合 SEO 建議規格，請重新產生一次。",
    failureMessage: "目前無法產生 SEO 建議，請稍後再試。",
  });
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
