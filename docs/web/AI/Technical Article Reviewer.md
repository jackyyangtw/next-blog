# AI Technical Article Reviewer Implementation Plan

## Goal

建立一個 **AI Technical Article Reviewer**。

目的不是產生文章，而是在文章發布前協助作者檢查：

- 技術內容是否完整
- 可讀性
- SEO
- Markdown 結構
- Code Example 品質
- 教學流程是否合理

AI 永遠只提供建議。

作者永遠保有最終決定權。

---

# Existing Stack

- Next.js App Router
- TypeScript
- Sanity CMS
- React Hook Form
- Zod
- TanStack Query
- AI SDK

---

# Architecture

採用：

```text
Editor

↓

Review Article

↓

Server Action

↓

AI Reviewer

↓

Structured Output

↓

Zod Validation

↓

Review Report

↓

Author fixes article

↓

Publish
```

第一版：

- 使用 Server Action
- 不建立 Route Handler

---

# Required Packages

```bash
pnpm add ai @ai-sdk/openai
```

沿用：

- zod
- react-hook-form
- tanstack query

---

# Folder Structure

```text
features/
└── article-review/
    ├── actions/
    │   reviewArticleAction.ts
    │
    ├── server/
    │   reviewArticle.ts
    │   mockReview.ts
    │   model.ts
    │
    ├── schemas/
    │   reviewSchema.ts
    │
    ├── components/
    │   ReviewButton.tsx
    │   ReviewReport.tsx
    │   ReviewIssueCard.tsx
    │
    └── hooks/
        useReviewArticle.ts
```

---

# Workflow

作者：

```text
寫文章

↓

Review Article
```

AI：

分析：

- Markdown
- Heading
- Code
- Explanation
- SEO
- Structure

↓

回傳 Report

↓

作者修正

↓

重新 Review

↓

Publish

---

# Review Categories

第一版：

## 1. Readability

例如：

- Paragraph 太長
- 建議拆段
- 缺少小標題

---

## 2. Technical Explanation

例如：

AI：

> 這裡直接介紹 useQuery enabled。

但沒有先解釋：

> 為什麼需要 enabled。

建議補充背景。

---

## 3. Code Example

例如：

AI：

- 缺少範例
- Code 太長
- 沒有說明每段作用

---

## 4. SEO

例如：

- Title 太長
- Description 建議
- 缺少關鍵字

注意：

第一版：

不要直接生成。

只給：

Suggestion。

---

## 5. Missing Content

例如：

AI：

> 建議補充：

- Error Handling
- Loading State
- Edge Cases
- Performance

---

## 6. Overall Quality

例如：

```text
Technical Accuracy

★★★★☆

Readability

★★★☆☆

SEO

★★★★☆

Completeness

★★★★★
```

---

# Structured Output

```ts
interface ReviewReport {
  summary: string;

  score: {
    readability: number;

    technicalAccuracy: number;

    completeness: number;

    seo: number;
  };

  issues: ReviewIssue[];
}
```

---

```ts
interface ReviewIssue {
  severity: "low" | "medium" | "high";

  category: "readability" | "seo" | "code" | "technical" | "content";

  title: string;

  suggestion: string;
}
```

---

# Example Output

```text
Overall Score

8.7 / 10

────────────

High

缺少 useQuery enabled 的背景介紹。

建議先解釋：

為什麼不用 useEffect。

────────────

Medium

第三段超過 12 行。

建議拆成兩段。

────────────

Low

Code Block 建議增加註解。

────────────

SEO

Title 長度 OK

Description 建議縮短 20 字。
```

---

# UI

Button：

```text
✨ Review Article
```

Loading：

```text
Reviewing...
```

Result：

```text
Overall Score

9.1

────────────────

High Priority

...

────────────────

Medium

...

────────────────

Low

...
```

---

# Human in the Loop

AI：

不能：

- 修改文章
- 修改 Markdown
- 修改 Sanity

只能：

提出建議。

作者：

決定：

- 接受
- 忽略

---

# Mock Mode

預設：

```env
AI_REVIEW_MODE=mock
```

平常：

不用花 token。

Demo：

切：

```env
AI_REVIEW_MODE=remote
```

即可。

---

# Cost Control

禁止：

- Auto Review

禁止：

- 每打一個字就呼叫 AI

只能：

```text
Click

Review Article
```

一次。

---

# Error Handling

至少：

- Empty article

- Too large

- Timeout

- Rate limit

- Invalid AI output

---

# Acceptance Criteria

- Review Button

- Server Action

- Structured Output

- Zod Validation

- Review Report

- Human Review

- Mock Mode

- Remote Mode

- Loading

- Error State

- Unit Test

- Playwright

---

# Non Goals

第一版：

不要：

- Rewrite Article

- Auto Fix

- Translation

- AI Chat

- RAG

- Multi Agent

- Streaming

- Auto Publish

---

# Future Roadmap

V2：

- AI Rewrite Suggestion

V3：

- AI Summary

V4：

- AI SEO Generator

V5：

- AI Translation

V6：

- AI Related Posts

---

# Design Principles

- AI 提供建議，不直接修改內容。
- 所有 AI 輸出都經過 Zod 驗證。
- 作者永遠擁有最終決定權。
- 預設使用 Mock Mode，降低開發成本。
- 功能應與既有 Sanity 編輯流程整合，而不是取代它。
