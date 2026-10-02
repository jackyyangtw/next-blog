import { describe, expect, test } from "vitest";
import { filterAuditReport } from "./filterAuditReport.mjs";

const patchedAdvisory = {
  github_advisory_id: "GHSA-86w9-cpqp-85rv",
  module_name: "node-forge",
  severity: "high",
};
const otherAdvisory = {
  github_advisory_id: "GHSA-other-advisory",
  module_name: "another-package",
  severity: "high",
};

describe("已驗證 node-forge 補丁的 CVE 稽核例外", () => {
  test("只剩指定公告時通過稽核並更新統計", () => {
    const report = {
      advisories: { patched: patchedAdvisory },
      metadata: { vulnerabilities: { high: 1 }, dependencies: 100 },
    };
    const result = filterAuditReport(report, 1);
    expect(result.exitCode).toBe(0);
    expect(result.ignoredCount).toBe(1);
    expect(result.report).toEqual({
      advisories: {},
      metadata: { vulnerabilities: { high: 0 }, dependencies: 100 },
    });
    expect(report.advisories.patched).toBe(patchedAdvisory);
    expect(report.metadata.vulnerabilities.high).toBe(1);
  });

  test("其他高風險公告仍阻擋部署", () => {
    const result = filterAuditReport(
      {
        advisories: { patched: patchedAdvisory, other: otherAdvisory },
        metadata: { vulnerabilities: { high: 2 } },
      },
      1,
    );
    expect(result.exitCode).toBe(1);
    expect(result.report.advisories).toEqual({ other: otherAdvisory });
    expect(result.report.metadata?.vulnerabilities?.high).toBe(1);
  });

  test("node-forge 的其他公告不在例外範圍", () => {
    const advisory = { ...otherAdvisory, module_name: "node-forge" };
    const result = filterAuditReport(
      {
        advisories: { other: advisory },
        metadata: { vulnerabilities: { high: 1 } },
      },
      1,
    );
    expect(result.exitCode).toBe(1);
    expect(result.ignoredCount).toBe(0);
  });

  test("同一公告識別碼若屬於其他套件不套用例外", () => {
    const result = filterAuditReport(
      {
        advisories: { other: { ...patchedAdvisory, module_name: "other" } },
        metadata: { vulnerabilities: { high: 1 } },
      },
      1,
    );
    expect(result.exitCode).toBe(1);
    expect(result.ignoredCount).toBe(0);
  });

  test("registry 錯誤保留原本的失敗狀態與報告", () => {
    const report = { error: { message: "registry unavailable" } };
    expect(filterAuditReport(report, 7)).toEqual({
      report,
      exitCode: 7,
      ignoredCount: 0,
    });
  });

  test("非漏洞造成的失敗即使附有指定公告也不得通過", () => {
    const report = {
      advisories: { patched: patchedAdvisory },
      metadata: { vulnerabilities: { high: 1 } },
    };
    expect(filterAuditReport(report, 2).exitCode).toBe(2);
  });

  test("缺少稽核明細或統計時不得通過", () => {
    expect(filterAuditReport({}, 0).exitCode).toBe(1);
    expect(filterAuditReport({ advisories: {} }, 1).exitCode).toBe(1);
  });

  test("沒有公告的異常失敗仍阻擋部署", () => {
    expect(
      filterAuditReport(
        { advisories: {}, metadata: { vulnerabilities: { high: 0 } } },
        1,
      ).exitCode,
    ).toBe(1);
  });

  test("無漏洞的成功稽核維持通過", () => {
    expect(
      filterAuditReport(
        { advisories: {}, metadata: { vulnerabilities: { high: 0 } } },
        0,
      ).exitCode,
    ).toBe(0);
  });
});
