export type AiProviderErrorCode =
  | "MISSING_API_KEY"
  | "PROVIDER_QUOTA_EXCEEDED"
  | "PROVIDER_RATE_LIMIT"
  | "PROVIDER_TIMEOUT"
  | "INVALID_STRUCTURED_OUTPUT"
  | "PROVIDER_FAILURE";

type ProviderErrorMessageOptions = {
  featureName: string;
  failureMessage: string;
  invalidOutputMessage: string;
};

export function providerErrorMessage(
  code: AiProviderErrorCode,
  options: ProviderErrorMessageOptions,
) {
  switch (code) {
    case "MISSING_API_KEY":
      return `${options.featureName} 尚未設定 API key，請先確認後台環境變數。`;
    case "PROVIDER_QUOTA_EXCEEDED":
      return "OpenAI API 額度不足或 billing 尚未啟用，請檢查 OpenAI plan 與用量。";
    case "PROVIDER_RATE_LIMIT":
      return "AI 服務目前流量過高，請稍後再試。";
    case "PROVIDER_TIMEOUT":
      return "AI 服務回應逾時，請稍後再試。";
    case "INVALID_STRUCTURED_OUTPUT":
      return options.invalidOutputMessage;
    case "PROVIDER_FAILURE":
      return options.failureMessage;
  }
}
