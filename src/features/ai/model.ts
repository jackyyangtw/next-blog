import "server-only";

import { createOpenAI } from "@ai-sdk/openai";

export class AiModelConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiModelConfigurationError";
  }
}

export function getOpenAiModel() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new AiModelConfigurationError("Missing OPENAI_API_KEY.");
  }

  const openai = createOpenAI({ apiKey });
  return openai(process.env.AI_MODEL || "gpt-5-mini");
}
