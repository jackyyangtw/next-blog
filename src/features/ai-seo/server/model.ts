import "server-only";

import { getOpenAiModel, AiModelConfigurationError } from "@/features/ai/model";

export type AiSeoMode = "mock" | "remote";

export class AiSeoConfigurationError extends AiModelConfigurationError {
  constructor(message: string) {
    super(message);
    this.name = "AiSeoConfigurationError";
  }
}

export function getAiSeoMode(): AiSeoMode {
  return process.env.AI_SEO_MODE === "remote" ? "remote" : "mock";
}

export function getAiSeoModel() {
  try {
    return getOpenAiModel();
  } catch (error) {
    if (error instanceof AiModelConfigurationError) {
      throw new AiSeoConfigurationError(error.message);
    }

    throw error;
  }
}
