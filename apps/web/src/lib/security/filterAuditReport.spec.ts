import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { filterAuditReport } from "./filterAuditReport.mjs";

type Allowlist = Parameters<typeof filterAuditReport>[2];
type Advisory = {
  github_advisory_id: string;
  module_name: string;
  severity: string;
  findings?: { version?: string }[];
};

const allowlist: Allowlist = JSON.parse(
  readFileSync(
    new URL(
      "../../../../../.github/workflows/scripts/cve-allowlist.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
const now = new Date("2026-10-06T09:00:00+08:00");
const forge: Advisory = {
  github_advisory_id: "GHSA-86w9-cpqp-85rv",
  module_name: "node-forge",
  severity: "high",
  findings: [{ version: "1.4.0" }],
};
const braces: Advisory = {
  github_advisory_id: "GHSA-vfj7-8cjw-p6xm",
  module_name: "braces",
  severity: "high",
  findings: [{ version: "3.0.3" }],
};

function reportFor(advisories: Record<string, Advisory>) {
  return {
    advisories,
    metadata: { vulnerabilities: { high: Object.keys(advisories).length } },
  };
}

describe("有期限的 CVE allowlist", () => {
  test("只允許精確公告、套件與版本，並保留接受的漏洞明細", () => {
    const report = reportFor({ forge, braces });
    const before = structuredClone(report);
    const result = filterAuditReport(report, 1, allowlist, now);
    expect(result.exitCode).toBe(0);
    expect(result.allowedCount).toBe(2);
    expect(result.report.advisories).toEqual({});
    expect(result.report.allowedAdvisories).toEqual({ forge, braces });
    expect(result.report.metadata?.vulnerabilities?.high).toBe(0);
    expect(result.report.allowlist.every((entry) => entry.applied)).toBe(true);
    expect(report).toEqual(before);
    expect(allowlist.every((entry) => !("applied" in entry))).toBe(true);
  });

  test("台北時間到期前仍適用，到期當下恢復阻擋 CI", () => {
    const report = reportFor({ forge, braces });
    expect(
      filterAuditReport(
        report,
        1,
        allowlist,
        new Date("2026-11-05T15:59:59.999Z"),
      ).exitCode,
    ).toBe(0);
    const result = filterAuditReport(
      report,
      1,
      allowlist,
      new Date("2026-11-05T16:00:00Z"),
    );
    expect(result.exitCode).toBe(1);
    expect(result.allowedCount).toBe(0);
    expect(result.report.advisories).toEqual({ forge, braces });
    expect(result.report.allowedAdvisories).toEqual({});
    expect(
      result.report.allowlist.every((entry) => entry.status === "expired"),
    ).toBe(true);
  });

  test("加入日前尚未生效", () => {
    const result = filterAuditReport(
      reportFor({ forge }),
      1,
      allowlist,
      new Date("2026-10-05T15:59:59.999Z"),
    );
    expect(result.exitCode).toBe(1);
    expect(result.report.allowlist[0].status).toBe("scheduled");
  });

  test("沒有掃到漏洞時仍保留完整 allowlist 供 CI 印出", () => {
    const result = filterAuditReport(reportFor({}), 0, allowlist, now);
    expect(result.exitCode).toBe(0);
    expect(result.report.allowlist).toHaveLength(2);
    expect(result.report.allowlist.every((entry) => !entry.applied)).toBe(true);
  });

  test("到期但套件已修復時不會因歷史紀錄阻擋 CI", () => {
    expect(
      filterAuditReport(
        reportFor({}),
        0,
        allowlist,
        new Date("2026-11-06T00:00:00+08:00"),
      ).exitCode,
    ).toBe(0);
  });

  test.each([
    {
      name: "不同套件",
      advisory: { ...braces, module_name: "another-package" },
    },
    {
      name: "其他公告",
      advisory: { ...braces, github_advisory_id: "GHSA-abcd-efgh-ijkl" },
    },
    {
      name: "未列入的版本",
      advisory: { ...braces, findings: [{ version: "3.0.2" }] },
    },
    { name: "未提供版本", advisory: { ...braces, findings: undefined } },
    { name: "空版本明細", advisory: { ...braces, findings: [] } },
    {
      name: "混合未列入版本",
      advisory: {
        ...braces,
        findings: [{ version: "3.0.3" }, { version: "3.0.2" }],
      },
    },
  ])("$name 仍阻擋部署", ({ advisory }) => {
    const result = filterAuditReport(
      reportFor({ other: advisory }),
      1,
      allowlist,
      now,
    );
    expect(result.exitCode).toBe(1);
    expect(result.allowedCount).toBe(0);
    expect(result.report.advisories).toEqual({ other: advisory });
  });

  test("接受部分公告後其他漏洞仍阻擋部署", () => {
    const other = { ...forge, github_advisory_id: "GHSA-abcd-efgh-ijkl" };
    const result = filterAuditReport(
      reportFor({ braces, other }),
      1,
      allowlist,
      now,
    );
    expect(result.exitCode).toBe(1);
    expect(result.allowedCount).toBe(1);
    expect(result.report.advisories).toEqual({ other });
    expect(result.report.metadata?.vulnerabilities?.high).toBe(1);
  });

  test("空 allowlist 不會放行任何漏洞", () => {
    expect(filterAuditReport(reportFor({ forge }), 1, [], now).exitCode).toBe(
      1,
    );
  });

  test("registry 錯誤保留原本錯誤碼與清單", () => {
    const report = { error: { message: "registry unavailable" } };
    const result = filterAuditReport(report, 7, allowlist, now);
    expect(result.exitCode).toBe(7);
    expect(result.allowedCount).toBe(0);
    expect(result.report.error).toEqual(report.error);
    expect(result.report.allowlist).toHaveLength(2);
  });

  test("非漏洞造成的失敗不得套用 allowlist", () => {
    const result = filterAuditReport(reportFor({ forge }), 2, allowlist, now);
    expect(result.exitCode).toBe(2);
    expect(result.allowedCount).toBe(0);
  });

  test("缺少稽核明細或統計時不得通過", () => {
    expect(filterAuditReport({}, 0, allowlist, now).exitCode).toBe(1);
    expect(
      filterAuditReport({ advisories: {} }, 1, allowlist, now).exitCode,
    ).toBe(1);
  });

  test("沒有公告的異常失敗仍阻擋部署", () => {
    expect(filterAuditReport(reportFor({}), 1, allowlist, now).exitCode).toBe(
      1,
    );
  });
});
