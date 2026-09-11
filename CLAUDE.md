# CLAUDE.md

## 修改前置檢查流程

本專案的程式碼修改規範以 AGENTS.md 為單一來源，完整內容如下匯入：

@AGENTS.md

## 專案文件索引

AGENTS.md 第 1 節「查閱專案文件與索引」指的是以下文件：

- [docs/web/Components/CREATE_COMPONENT.md](docs/web/Components/CREATE_COMPONENT.md) — 元件建立規範，含「200 行拆分規則」的完整範例
- [docs/web/Performance/BUNDLE_OPTIMIZATION.md](docs/web/Performance/BUNDLE_OPTIMIZATION.md) — Bundle 體積優化
- [docs/web/AI/SEO.md](docs/web/AI/SEO.md) — SEO 規範
- [docs/web/AI/Technical Article Reviewer.md](docs/web/AI/Technical%20Article%20Reviewer.md) — 技術文章審閱
- [docs/AGENT_SKILLS.md](docs/AGENT_SKILLS.md) — Agent skills 說明

## Skills

`.claude/skills` 是指向 `.agents/skills` 的目錄 junction（同一份檔案，兩個路徑）。
新增或修改 skill 請直接動 `.agents/skills/`，不要在 `.claude/skills/` 下另建檔案。
