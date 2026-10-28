// PreToolUse (Edit|Write)：擋下違反 CLAUDE.md / AGENTS.md 的寫入。
// - .claude/skills/ 是 .agents/skills/ 的 junction，skill 一律改 .agents/skills/
// - 禁止另建平行 token 檔（tokens.css 等），共用 token 在 packages/design-tokens
// - 禁止改 .env 類 secret 檔（.env.example / .env.sample 除外）
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const input = JSON.parse(readFileSync(0, "utf8") || "{}");
// Git Bash 風格的 /c/... 路徑轉成 C:/...
const filePath = input.tool_input?.file_path?.replace(/^\/([a-zA-Z])\//, "$1:/");
if (!filePath) process.exit(0);

const rel = path.relative(ROOT, path.resolve(filePath)).split(path.sep).join("/");
const base = path.posix.basename(rel);

let reason;
if (rel.startsWith(".claude/skills/")) {
  reason = `.claude/skills 是 .agents/skills 的 junction，請改寫 ${rel.replace(/^\.claude\//, ".agents/")}。`;
} else if (/tokens?\.(css|scss)$/i.test(base) && !rel.startsWith("packages/design-tokens/")) {
  reason = "禁止另建平行 token 檔；共用 token 請擴充 packages/design-tokens，Web 樣式沿用 MUI theme 語意值。";
} else if (/^\.env(\..+)?$/.test(base) && !/\.(example|sample)$/.test(base)) {
  reason = `${rel} 是 secret 設定檔，請由使用者自行修改。`;
}

if (reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
    }),
  );
}
