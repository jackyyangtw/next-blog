/**
 * @typedef {{package: string, advisory: string, cve: string, versions: string[], reason: string, addedAt: string, expiresAt: string}} AllowlistEntry
 */

/**
 * Validate the checked-in policy and compute time windows using explicit offsets.
 * @param {AllowlistEntry[]} allowlist
 * @param {Date} now
 */
export function getAllowlistStatus(allowlist, now = new Date()) {
  if (!Array.isArray(allowlist) || !Number.isFinite(now.getTime())) {
    throw new Error("Invalid CVE allowlist or audit time");
  }
  const seen = new Set();
  return allowlist.map((entry) => {
    if (
      !entry ||
      typeof entry !== "object" ||
      !["package", "advisory", "cve", "reason"].every(
        (key) => typeof entry[key] === "string" && entry[key].trim(),
      ) ||
      !/^GHSA-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/.test(entry.advisory) ||
      !Array.isArray(entry.versions) ||
      entry.versions.length === 0 ||
      !entry.versions.every(
        (version) =>
          typeof version === "string" && /^\d+\.\d+\.\d+$/.test(version),
      )
    ) {
      throw new Error("Invalid CVE allowlist entry");
    }
    const key = `${entry.package}:${entry.advisory}`;
    const datePattern =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/;
    const addedAt = Date.parse(entry.addedAt);
    const expiresAt = Date.parse(entry.expiresAt);
    if (
      seen.has(key) ||
      !datePattern.test(entry.addedAt) ||
      !datePattern.test(entry.expiresAt) ||
      !Number.isFinite(addedAt) ||
      !Number.isFinite(expiresAt) ||
      expiresAt <= addedAt
    ) {
      throw new Error(`Invalid CVE allowlist dates or duplicate entry: ${key}`);
    }
    seen.add(key);
    const status =
      now.getTime() >= expiresAt
        ? "expired"
        : now.getTime() < addedAt
          ? "scheduled"
          : "active";
    return { ...entry, status, applied: false };
  });
}

/** @param {ReturnType<typeof getAllowlistStatus>} entries */
export function formatAllowlist(entries) {
  const cell = (value) =>
    String(value).replaceAll("|", "\\|").replace(/\r?\n/g, " ");
  return [
    "### CVE allowlist",
    "",
    "| Package / versions | Advisory / CVE | Added | Expires | Status | Applied | Reason |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...entries.map((entry) =>
      [
        entry.package + " / " + entry.versions.join(", "),
        entry.advisory + " / " + entry.cve,
        entry.addedAt,
        entry.expiresAt,
        entry.status,
        entry.applied ? "yes" : "no",
        entry.reason,
      ]
        .map(cell)
        .join(" | ")
        .replace(/^/, "| ")
        .concat(" |"),
    ),
    ...(entries.length === 0 ? ["Allowlist is empty."] : []),
  ].join("\n");
}
