import "server-only";

import {
  APICallError,
  LoadAPIKeyError,
  NoObjectGeneratedError,
  Output,
  generateText,
} from "ai";

import type { AiProviderErrorCode } from "@/features/ai/errors/providerErrorMessage";
import type { GenerateSeoRequest, SeoSuggestion } from "../types";
import { seoSuggestionSchema } from "../schemas/seoSuggestionSchema";
import { getAiSeoMode, getAiSeoModel, AiSeoConfigurationError } from "./model";
import { mockSeo } from "./mockSeo";

export type AiSeoErrorCode = AiProviderErrorCode;

export class AiSeoError extends Error {
  constructor(
    readonly code: AiSeoErrorCode,
    message = "AI SEO generation failed.",
  ) {
    super(message);
    this.name = "AiSeoError";
  }
}

function getLocaleInstruction(locale: GenerateSeoRequest["locale"]) {
  return locale === "en"
    ? "Write all fields in clear English."
    : "Write all fields in Traditional Chinese.";
}

function buildPrompt(input: GenerateSeoRequest) {
  return [
    `Locale: ${input.locale}`,
    `Current title: ${input.title || "(empty)"}`,
    `Current description: ${input.description || "(empty)"}`,
    `Categories: ${input.categories.join(", ") || "(none)"}`,
    "Article content:",
    input.content,
  ].join("\n\n");
}

function getApiCallError(error: unknown) {
  if (APICallError.isInstance(error)) {
    return error;
  }

  if (typeof error === "object" && error !== null) {
    const cause = "cause" in error ? error.cause : undefined;
    if (APICallError.isInstance(cause)) {
      return cause;
    }

    const errors = "errors" in error ? error.errors : undefined;
    if (Array.isArray(errors)) {
      return errors.find((item) => APICallError.isInstance(item));
    }
  }
}

function isQuotaExceeded(error: APICallError) {
  return /quota|billing|insufficient/i.test(error.message);
}

function toAiSeoError(error: unknown): AiSeoError {
  if (
    error instanceof AiSeoConfigurationError ||
    LoadAPIKeyError.isInstance(error)
  ) {
    return new AiSeoError("MISSING_API_KEY");
  }

  if (NoObjectGeneratedError.isInstance(error)) {
    return new AiSeoError("INVALID_STRUCTURED_OUTPUT");
  }

  const apiError = getApiCallError(error);
  if (apiError) {
    if (apiError.statusCode === 429) {
      return new AiSeoError(
        isQuotaExceeded(apiError)
          ? "PROVIDER_QUOTA_EXCEEDED"
          : "PROVIDER_RATE_LIMIT",
      );
    }
    if (apiError.statusCode === 408 || apiError.statusCode === 504) {
      return new AiSeoError("PROVIDER_TIMEOUT");
    }
  }

  return new AiSeoError("PROVIDER_FAILURE");
}

export async function generateSeo(
  input: GenerateSeoRequest,
): Promise<SeoSuggestion> {
  if (getAiSeoMode() === "mock") {
    return mockSeo(input);
  }

  try {
    const result = await generateText({
      model: getAiSeoModel(),
      output: Output.object({
        name: "SeoSuggestion",
        description: "SEO suggestions for a blog post editor.",
        schema: seoSuggestionSchema,
      }),
      maxRetries: 0,
      timeout: 20_000,
      system: [
        "You are an SEO editor assisting a human blog editor.",
        "Return only fields that match the schema.",
        "Do not generate or suggest a slug.",
        "Do not invent facts not supported by the article.",
        "Keep the suggestion editable and suitable for human approval.",
        getLocaleInstruction(input.locale),
      ].join(" "),
      prompt: buildPrompt(input),
    });

    return seoSuggestionSchema.parse(result.output);
  } catch (error) {
    throw toAiSeoError(error);
  }
}
