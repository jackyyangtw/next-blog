import "server-only";

import { cacheLife } from "next/cache";
import { bundledLanguages, codeToHtml, type BundledLanguage } from "shiki";

function getSupportedLanguage(language?: string): BundledLanguage | null {
  const normalizedLanguage = language?.trim().toLowerCase();

  return normalizedLanguage && normalizedLanguage in bundledLanguages
    ? (normalizedLanguage as BundledLanguage)
    : null;
}

export async function highlightCode(code: string, language?: string) {
  "use cache";
  cacheLife("max");

  const supportedLanguage = getSupportedLanguage(language);

  if (!supportedLanguage) {
    return undefined;
  }

  return codeToHtml(code, {
    lang: supportedLanguage,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    defaultColor: false,
  });
}
