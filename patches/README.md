# 依賴安全補丁

## node-forge 1.4.0：CVE-2026-85393

`node-forge@1.4.0.patch` 補上 RSA PKCS#1 v1.5 驗證時，巢狀
`DigestAlgorithm` SEQUENCE 的元素數量檢查。只允許演算法 OID 與可選的
NULL 參數，拒絕未被 ASN.1 validator 消耗的額外元素。

- 公告：[GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv)
- 修補來源：[上游 PR #1152](https://github.com/digitalbazaar/forge/pull/1152)，
  commit `ceba344`，截至 2026-10-02 尚未合併。
- 截至 2026-10-02，npm 最新版仍是 1.4.0；公告提到的 1.4.1 尚未發布。
- `pnpm-workspace.yaml` 的 `patchedDependencies` 與 lockfile 的 patch hash
  確保重新安裝時套用同一份補丁。
- 此專案的 Expo CLI 與 `@expo/code-signing-certificates` 使用 CommonJS
  `lib/rsa.js`；此補丁不修改套件預先打包的瀏覽器 `dist` 檔案。

回歸測試位於 `apps/web/src/lib/security/node-forge.spec.ts`，透過實際 Expo
依賴路徑載入套件，驗證正常簽章、省略 NULL 參數、摘要不符，以及含多餘元素的
巢狀 `DigestAlgorithm`。執行：

```sh
pnpm --filter @jacky-dev/web test:unit
```

`pnpm audit` 依版本判定風險，不會辨識此程式碼補丁，因此直接執行仍會報告
此項高風險漏洞。2026-10-02 經使用者確認，CI 將
`GHSA-86w9-cpqp-85rv` 列為暫時例外，由
`.github/workflows/scripts/run-cve-audit.sh` 統一處理：

1. 先執行上述安全回歸測試，核對補丁內容的 SHA-256、兩個 Expo 消費端的
   node-forge 版本及實際載入的 `lib/rsa.js` SHA-256，並驗證簽章行為。
2. 全部通過後才取得 `pnpm audit --json` 完整報告，僅排除同時符合此 GHSA
   與 `node-forge` 套件名稱的公告，並扣除該筆風險統計，不寫入全域例外設定。
   此處不用 `pnpm audit --ignore`，因為該命令用於新增設定，會提前回傳而不
   執行一般稽核結果判定。
3. 補丁遺失、版本或內容改變、測試失敗時立即停止；其他漏洞及 registry
   錯誤仍沿用 pnpm audit 的失敗結果。測試紀錄輸出至 stderr，保留 stdout
   的 JSON 報告格式供告警流程使用。`filterAuditReport.spec.ts` 另驗證其他
   公告、同套件的新公告與稽核錯誤仍會失敗。

每日稽核與部署流程皆使用此腳本。每日稽核安裝開發依賴以取得 Vitest，但仍
透過 `--prod` 僅掃描 production dependencies。檢查命令：

```sh
bash .github/workflows/scripts/run-cve-audit.sh --prod --audit-level high
bash .github/workflows/scripts/run-cve-audit.sh --prod --json
```

正式修補版本發布後，確認包含此項元素數量檢查，再升級、移除補丁與
`patchedDependencies` 設定、腳本中的例外及版本／雜湊檢查，保留簽章行為
回歸測試，並重跑測試與未排除公告的稽核。
