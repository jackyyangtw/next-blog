/**
 * @typedef {{github_advisory_id?: string, module_name?: string, severity?: string}} Advisory
 * @typedef {{advisories?: Record<string, Advisory>, metadata?: {vulnerabilities?: Record<string, number>}, error?: unknown}} AuditReport
 */

/**
 * Apply only after the installed node-forge patch passes its security tests.
 * @param {AuditReport} report
 * @param {number} auditStatus
 */
export function filterAuditReport(report, auditStatus) {
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
    return { report, exitCode: auditStatus || 1, ignoredCount: 0 };
  }

  const advisories = { ...report.advisories };
  const vulnerabilities = { ...report.metadata.vulnerabilities };
  let ignoredCount = 0;
  for (const [id, advisory] of Object.entries(advisories)) {
    if (
      advisory.github_advisory_id === "GHSA-86w9-cpqp-85rv" &&
      advisory.module_name === "node-forge"
    ) {
      delete advisories[id];
      if (advisory.severity && advisory.severity in vulnerabilities) {
        vulnerabilities[advisory.severity] = Math.max(
          0,
          vulnerabilities[advisory.severity] - 1,
        );
      }
      ignoredCount++;
    }
  }

  // A failed audit without any advisory is an error, never a clean result.
  const unexplainedFailure = auditStatus !== 0 && ignoredCount === 0;
  return {
    report: {
      ...report,
      advisories,
      metadata: { ...report.metadata, vulnerabilities },
    },
    exitCode: Object.keys(advisories).length > 0 || unexplainedFailure ? 1 : 0,
    ignoredCount,
  };
}
