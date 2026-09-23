export function getPostSearchPatterns(value: string | null) {
  const keyword = value?.trim().slice(0, 100);
  if (!keyword) {
    return { keyword: null, alternateKeyword: null };
  }

  const expanded = keyword
    .replace(/\bnextjs\b/gi, "next.js")
    .replace(/\bcicd\b/gi, "ci/cd");
  const compact = keyword
    .replace(/\bnext[.\s-]+js\b/gi, "nextjs")
    .replace(/\bci[/\s-]+cd\b/gi, "cicd");
  const alternate =
    expanded !== keyword ? expanded : compact !== keyword ? compact : null;

  return {
    keyword: `*${keyword}*`,
    alternateKeyword: alternate ? `*${alternate}*` : null,
  };
}
