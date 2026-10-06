import { getAllowlistStatus } from "./auditAllowlist.mjs";

/**
 * @typedef {{github_advisory_id?: string, module_name?: string, severity?: string, findings?: {version?: string}[]}} Advisory
 * @typedef {{advisories?: Record<string, Advisory>, metadata?: {vulnerabilities?: Record<string, number>}, error?: unknown}} AuditReport
 */

/**
 * Keep accepted risks visible in the report; exceptions never claim to be fixes.
 * @param {AuditReport} report
 * @param {number} auditStatus
 * @param {import('./auditAllowlist.mjs').AllowlistEntry[]} allowlist
 * @param {Date} now
 */
export function filterAuditReport(
  report,
  auditStatus,
  allowlist,
  now = new Date(),
) {
  const entries = getAllowlistStatus(allowlist, now);
  const allowedAdvisories = {};
  if (
    !report ||
    typeof report !== "object" ||
    "error" in report ||
    !report.advisories ||
    typeof report.advisories !== "object" ||
    Array.isArray(report.advisories) ||
    !report.metadata?.vulnerabilities ||
    ![0, 1].includes(auditStatus)
  ) {
    return {
      report: { ...report, allowlist: entries, allowedAdvisories },
      exitCode: auditStatus || 1,
      allowedCount: 0,
    };
  }

  const advisories = { ...report.advisories };
  const vulnerabilities = { ...report.metadata.vulnerabilities };
  for (const [id, advisory] of Object.entries(advisories)) {
    const entry = entries.find(
      (candidate) =>
        candidate.status === "active" &&
        candidate.advisory === advisory.github_advisory_id &&
        candidate.package === advisory.module_name &&
        Array.isArray(advisory.findings) &&
        advisory.findings.length > 0 &&
        advisory.findings.every((finding) =>
          candidate.versions.includes(finding?.version ?? ""),
        ),
    );
    if (!entry) continue;
    entry.applied = true;
    allowedAdvisories[id] = advisory;
    delete advisories[id];
    if (advisory.severity && advisory.severity in vulnerabilities) {
      vulnerabilities[advisory.severity] = Math.max(
        0,
        vulnerabilities[advisory.severity] - 1,
      );
    }
  }

  const allowedCount = Object.keys(allowedAdvisories).length;
  // A failed audit without any advisory is an error, never a clean result.
  const unexplainedFailure = auditStatus !== 0 && allowedCount === 0;
  return {
    report: {
      ...report,
      advisories,
      metadata: { ...report.metadata, vulnerabilities },
      allowlist: entries,
      allowedAdvisories,
    },
    exitCode: Object.keys(advisories).length > 0 || unexplainedFailure ? 1 : 0,
    allowedCount,
  };
}
