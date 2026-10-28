// Stop：本回合有改到 apps/web 程式碼時跑一次 typecheck，失敗就請 Claude 修正。
// 已經是因本 hook 而繼續的回合（stop_hook_active）一律放行，避免無限循環。
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const WEB = path.join(ROOT, "apps", "web");
const MAX_LINES = 30;

const input = JSON.parse(readFileSync(0, "utf8") || "{}");
const marker = path.join(tmpdir(), `claude-next-blog-typecheck-${input.session_id}`);
if (!existsSync(marker)) process.exit(0);
rmSync(marker, { force: true });
if (input.stop_hook_active) process.exit(0);

const tsc = path.join(WEB, "node_modules/typescript/bin/tsc");
const output = [];
for (const args of [["--noEmit"], ["--noEmit", "--project", "tsconfig.tests.json"]]) {
  const res = spawnSync(process.execPath, [tsc, ...args], { cwd: WEB, encoding: "utf8" });
  if (res.status !== 0) output.push(...`${res.stdout}${res.stderr}`.trim().split("\n"));
}
if (!output.length) process.exit(0);

const shown = output.slice(0, MAX_LINES);
if (output.length > MAX_LINES) shown.push(`…（另有 ${output.length - MAX_LINES} 行）`);
process.stdout.write(
  JSON.stringify({ decision: "block", reason: `apps/web typecheck 失敗，請修正：\n${shown.join("\n")}` }),
);
