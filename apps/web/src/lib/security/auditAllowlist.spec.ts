import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmdirSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { formatAllowlist, getAllowlistStatus } from "./auditAllowlist.mjs";

const entry = {
  package: "braces",
  advisory: "GHSA-vfj7-8cjw-p6xm",
  cve: "CVE-2026-93687",
  versions: ["3.0.3"],
  reason: "等待官方修復版",
  addedAt: "2026-10-06T00:00:00+08:00",
  expiresAt: "2026-11-06T00:00:00+08:00",
};
const now = new Date("2026-10-06T09:00:00+08:00");
const cli = fileURLToPath(
  new URL(
    "../../../../../.github/workflows/scripts/filter-cve-audit.mjs",
    import.meta.url,
  ),
);

describe("CVE allowlist 紀錄", () => {
  test.each([
    { name: "缺少原因", record: { ...entry, reason: "" } },
    { name: "無效公告編號", record: { ...entry, advisory: "anything" } },
    { name: "未指定版本", record: { ...entry, versions: [] } },
    { name: "版本使用萬用範圍", record: { ...entry, versions: ["*"] } },
    { name: "日期沒有時區", record: { ...entry, expiresAt: "2026-11-06" } },
    { name: "無效日期", record: { ...entry, expiresAt: "invalid" } },
    {
      name: "到期早於加入日",
      record: { ...entry, expiresAt: "2026-10-05T00:00:00+08:00" },
    },
  ])("$name 的 allowlist 紀錄不得放行", ({ record }) => {
    expect(() => getAllowlistStatus([record], now)).toThrow(
      /Invalid CVE allowlist/,
    );
  });

  test("拒絕同套件與公告的重複紀錄", () => {
    expect(() => getAllowlistStatus([entry, entry], now)).toThrow(/duplicate/);
  });

  test("CI 表格印出所有欄位及套用狀態並跳脫分隔符號", () => {
    const records = getAllowlistStatus(
      [{ ...entry, reason: "理由 | 第二行\n第三行" }],
      now,
    );
    records[0].applied = true;
    const table = formatAllowlist(records);
    for (const value of [
      entry.package,
      entry.advisory,
      entry.cve,
      "3.0.3",
      entry.addedAt,
      entry.expiresAt,
      "active",
      "yes",
      "第二行 第三行",
    ])
      expect(table).toContain(value);
    expect(table).toContain("\\|");
  });

  test("CLI 在零漏洞時仍印出清單、寫入 Actions 摘要且 stdout 保持有效 JSON", () => {
    const directory = mkdtempSync(join(tmpdir(), "cve-allowlist-"));
    const summary = join(directory, "summary.md");
    try {
      const result = spawnSync(process.execPath, [cli, "0"], {
        input: JSON.stringify({
          advisories: {},
          metadata: { vulnerabilities: { high: 0 } },
        }),
        encoding: "utf8",
        env: { ...process.env, GITHUB_STEP_SUMMARY: summary },
      });
      expect(result.status).toBe(0);
      const report = JSON.parse(result.stdout);
      expect(report.allowlist).toHaveLength(2);
      expect(report.allowedAdvisories).toEqual({});
      expect(result.stderr).toContain("CVE allowlist");
      expect(result.stderr).toContain("node-forge");
      expect(result.stderr).toContain("braces");
      expect(result.stderr).toContain(entry.expiresAt);
      expect(readFileSync(summary, "utf8")).toBe(result.stderr);
    } finally {
      unlinkSync(summary);
      rmdirSync(directory);
    }
  });

  test("CLI 遇到損壞報告仍印出清單並以錯誤結束", () => {
    const result = spawnSync(process.execPath, [cli, "1"], {
      input: "invalid JSON",
      encoding: "utf8",
      env: { ...process.env, GITHUB_STEP_SUMMARY: "" },
    });
    expect(result.status).toBe(1);
    expect(JSON.parse(result.stdout).error.message).toBeTruthy();
    expect(result.stderr).toContain("CVE allowlist");
    expect(result.stderr).toContain(entry.expiresAt);
  });
});
