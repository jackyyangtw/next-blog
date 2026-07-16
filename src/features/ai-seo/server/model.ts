import "server-only";

import { createOpenAI } from "@ai-sdk/openai";

export type AiSeoMode = "mock" | "remote";

export class AiSeoConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiSeoConfigurationError";
  }
}

export function getAiSeoMode(): AiSeoMode {
  return process.env.AI_SEO_MODE === "remote" ? "remote" : "mock";
}

export function getAiSeoModel() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new AiSeoConfigurationError("Missing OPENAI_API_KEY.");
  }

  const openai = createOpenAI({ apiKey });
  return openai(process.env.AI_SEO_MODEL || "gpt-5-mini");
}
