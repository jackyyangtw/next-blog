// PostToolUse (Edit|Write)：對剛改的 apps/web 檔案跑 ESLint，並檢查元件 200 行拆分規則。
// 通過時不輸出；有 ESLint error 時以 exit 2 把錯誤回饋給 Claude；warning 與行數提醒走 additionalContext。
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const WEB = path.join(ROOT, "apps", "web");
const LINT_EXT = /\.(ts|tsx|js|jsx|mjs)$/;
const MAX_LINES = 200;
const MAX_REPORTED = 15;

const input = JSON.parse(readFileSync(0, "utf8") || "{}");
// Git Bash 風格的 /c/... 路徑轉成 C:/...
const filePath = input.tool_input?.file_path?.replace(/^\/([a-zA-Z])\//, "$1:/");
if (!filePath || !existsSync(filePath)) process.exit(0);

const abs = path.resolve(filePath);
const rel = path.relative(ROOT, abs).split(path.sep).join("/");
if (rel.startsWith("..") || /(^|\/)(node_modules|\.next)\//.test(rel)) process.exit(0);

const errors = [];
const notes = [];

if (rel.startsWith("apps/web/") && LINT_EXT.test(rel)) {
  // 讓 Stop hook 知道這回合動過 web 程式碼，需要跑 typecheck
  writeFileSync(path.join(tmpdir(), `claude-next-blog-typecheck-${input.session_id}`), "");

  const res = spawnSync(
    process.execPath,
    [path.join(WEB, "node_modules/eslint/bin/eslint.js"), "--format", "json", abs],
    { cwd: WEB, encoding: "utf8" },
  );
  let messages = [];
  try {
    messages = JSON.parse(res.stdout)[0]?.messages ?? [];
  } catch {
    // ESLint 無法執行（設定錯誤等）時不阻擋編輯
  }
  for (const m of messages.slice(0, MAX_REPORTED)) {
    const line = `${rel}:${m.line ?? 0} [${m.ruleId ?? "eslint"}] ${m.message}`;
    (m.severity === 2 ? errors : notes).push(line);
  }
}

if (rel.endsWith(".tsx")) {
  const lines = readFileSync(abs, "utf8").split("\n").length;
  if (lines > MAX_LINES) {
    notes.push(
      `${rel} 目前 ${lines} 行，超過 ${MAX_LINES} 行拆分規則：子元件拆為獨立 .tsx、工具函式拆為 utils.ts、主元件改為 index.tsx（見 docs/web/Components/CREATE_COMPONENT.md）。`,
    );
  }
}

if (errors.length) {
  process.stderr.write(`ESLint 錯誤，請修正：\n${[...errors, ...notes].join("\n")}\n`);
  process.exit(2);
}
if (notes.length) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: notes.join("\n") },
    }),
  );
}
