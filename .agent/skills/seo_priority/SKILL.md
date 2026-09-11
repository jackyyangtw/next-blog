---
name: seo-priority
description: SEO 是本專案的最高優先事項之一。所有頁面與元件的開發都必須遵守 SEO 最佳實踐。
---

# SEO 優先策略

本專案是 **Jacky Dev 技術部落格**（monorepo 的 `apps/web`），技術文章的自然搜尋流量是主要曝光來源。**所有開發工作都必須將 SEO 納入考量，尤其是 `src/app/[lng]/` 下的公開頁面（首頁、文章列表、文章詳情），這些頁面會被爬蟲抓取。**

技術組成：Next.js App Router（PPR / `use cache`）＋ Sanity CMS ＋ i18next 多語系（`zh-TW` 為 fallback、`en`）＋ MUI。

> **📖 權威來源**：本技能的規則基於 `node_modules/next/dist/docs/` 中的官方文件。若有疑義，以該目錄下的文件為準。

---

## 強制執行項目

### 1. Metadata（每個頁面必備）

- 每個 `page.tsx` 都必須 export `metadata` 或使用 `generateMetadata`
- `metadata` 和 `generateMetadata` **僅在 Server Components 中支援**
- `metadataBase` 已在 `src/app/[lng]/layout.tsx` 以 `getSiteUrl()` 設定，子頁面不需重設
- 站名一律取自 i18n `common.json` 的 `site_name`（`Next.js 台灣前端工程師 | Jacky Dev`），**禁止在程式碼中寫死中英文站名**
- Title 慣例：
  - 首頁：直接用 `site_name`
  - 列表／功能頁：`Posts | ${siteName}`
  - 文章詳情頁：直接用 `post.title`（文章標題本身已具辨識度）
- Description 需具體描述頁面內容，100-160 字元；靜態頁取自 i18n，文章頁取自 `post.description`

**多語系頁面（本專案所有公開頁面都是）必須附上 canonical 與 hreflang：**

```tsx
import type { Metadata } from "next";
import { languageAlternates, localizedUrl, openGraphLocale } from "@/utils/seo";
import { getServerTranslation } from "@/i18n";
import { Locale } from "@/i18n/types";

type Props = { params: Promise<{ lng: Locale }> };

async function getSeoData(lng: Locale) {
  "use cache";
  const tCommon = await getServerTranslation(lng, "common");
  return {
    title: tCommon.t("site_name"),
    description: tCommon.t("site_description"),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lng } = await params;
  const { title, description } = await getSeoData(lng);

  return {
    title,
    description,
    alternates: {
      canonical: localizedUrl(lng, "/post"),
      languages: languageAlternates("/post"), // 自動含 x-default
    },
    openGraph: {
      title,
      description,
      url: localizedUrl(lng, "/post"),
      type: "website",
      locale: openGraphLocale(lng), // zh-TW → zh_TW
    },
  };
}
```

**動態 Metadata（文章詳情頁）：**

```tsx
export async function generateMetadata({ params }: PostPageProps) {
  const { slug, lng } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };

  const postPath = `/post/${slug}`;
  const canonicalUrl = localizedUrl(lng, postPath);
  const imageSrc = getPostBannerImageSrc(post, { width: 1200, height: 630 });
  const imageUrl = imageSrc ? absoluteUrl(imageSrc) : "";

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates(postPath),
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonicalUrl,
      type: "article",
      locale: openGraphLocale(lng),
      publishedTime: post._createdAt,
      modifiedTime: post._updatedAt ?? post._createdAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      tags: post.categories.map((category) => category.title),
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630, alt: post.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}
```

> **注意**：`params` 在此版本中是 `Promise`，必須 `await` 取得值。SEO 資料查詢函式請加 `"use cache"`（如 `getHomeSeoData`、`getLayoutMetadata`），避免 `generateMetadata` 與頁面元件重複請求同一資料。

### 2. 一律複用 `@/utils/seo`，禁止自行拼接 URL

| 函式                       | 用途                                                |
| -------------------------- | --------------------------------------------------- |
| `getSiteUrl()`             | 取得正規化後的站台 origin（處理 www、協定、尾斜線） |
| `absoluteUrl(path)`        | 相對路徑 → 絕對網址（OG 圖、sitemap 用）            |
| `localizedPath(lng, path)` | 產生 `/zh-TW/post/xxx` 形式的路徑                   |
| `localizedUrl(lng, path)`  | 產生含語系的絕對網址（canonical 用）                |
| `languageAlternates(path)` | 產生 hreflang 對照表，含 `x-default`                |
| `openGraphLocale(lng)`     | `zh-TW` → `zh_TW`                                   |

手寫 `${process.env.NEXT_PUBLIC_BASE_URL}/...` 或字串拼接語系前綴一律視為錯誤——會漏掉 www 正規化與尾斜線處理，造成重複內容。

### 3. 文件型 Metadata（File-based Metadata）

| 檔案                  | 本專案現況                                                                  |
| --------------------- | --------------------------------------------------------------------------- |
| `src/app/favicon.ico` | ✅ 已存在                                                                   |
| `src/app/robots.ts`   | ✅ 已存在，disallow `/api/`、`/studio/`、`/*/auth`、`/*/user`               |
| `src/app/sitemap.ts`  | ✅ 已存在，靜態路徑 ＋ Sanity 文章動態產生，每筆都帶 `alternates.languages` |
| `opengraph-image`     | ⚠️ 未使用檔案慣例，改以 `public/images/home-og.jpg` 與文章 banner 提供      |

**新增公開路由時必須同步：**

1. 把路徑加進 `sitemap.ts` 的 `STATIC_PATHS`（目前為 `["", "/post"]`），否則不會被收錄
2. 若是私人／後台頁面，改為加進 `robots.ts` 的 `disallow`
3. sitemap 每筆 entry 都要走 `localizedUrl()` ＋ `languageAlternates()`，不可只輸出單一語系

### 4. 語意化 HTML 結構

- 每頁只能有**一個 `<h1>`**（文章頁的 `<h1>` 是文章標題，不要再用在 Header／Logo 上）
- 標題層級必須依序：`h1 > h2 > h3`，不可跳級；文章內文由 Portable Text 渲染，`RichText` 的 heading 對照表不可讓層級斷裂
- 使用語意標籤：`<header>`、`<main>`、`<article>`、`<section>`、`<footer>`、`<nav>`、`<figure>`、`<figcaption>`
- MUI 元件請用 `component` prop 指定語意標籤（例：`<Box component="article">`），不要讓整頁都是 `<div>`

### 5. 圖片最佳化

- 所有圖片使用 Next.js `<Image>` 元件（`next/image`）
- Sanity 圖片透過 `next-sanity-image` ／ `getPostBannerImageSrc(post, { width, height })` 取得，OG 圖固定 1200×630
- 必須提供有意義的 `alt` 文字（描述圖片內容，非裝飾用途）
- 設定適當的 `sizes` 屬性以支援 responsive loading
- **LCP 圖片**加上 `priority` prop（會自動注入 `<link rel="preload">`）——文章詳情頁的 banner、首頁主視覺屬於此類
- 其餘圖片預設 lazy loading（瀏覽器原生）
- 靜態 import 圖片時，`width`/`height`/`blurDataURL` 會自動推導；Sanity 圖可用 `metadata.lqip` 當 `blurDataURL`
- 遠端圖片必須手動提供 `width`/`height`，並在 `next.config` 的 `images.remotePatterns` 設定允許的來源（Sanity CDN）
- 使用 `fill` prop 時，父容器必須設定 `position: relative`

### 6. 結構化資料（JSON-LD）

本專案以 `@graph` 形式輸出多個 schema：

- 文章詳情頁：`BlogPosting` ＋ `BreadcrumbList`
- 首頁：見 `(home)/page.tsx` 的 `getHomeStructuredData`
- 文章列表頁：適用時可加 `CollectionPage` / `ItemList`
- 作者資訊使用 `Person`；`inLanguage` 必須帶入目前 `lng`

規則：

- 在 `page.tsx` 中以原生 `<script>` 標籤渲染（**不使用** `next/script`，JSON-LD 是結構化資料非可執行腳本）
- **必須防止 XSS**：將 `<` 字元替換為 `\\u003c`。文章標題、作者名、description 都來自 Sanity，屬於可被編輯者注入的內容
- 統一使用 `stringifyStructuredData()` 這個 helper，不要各頁自己寫 `JSON.stringify`

```tsx
function stringifyStructuredData(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "@id": `${canonicalUrl}#article`,
      headline: post.title,
      description: post.description,
      image: imageUrl ? [imageUrl] : undefined,
      author: { "@type": "Person", name: post.author?.name ?? "" },
      datePublished: post._createdAt,
      dateModified: post._updatedAt ?? post._createdAt,
      inLanguage: lng,
      keywords: post.categories.map((category) => category.title),
      mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: localizedUrl(lng),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Posts",
          item: localizedUrl(lng, "/post"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: canonicalUrl,
        },
      ],
    },
  ],
};

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: stringifyStructuredData(structuredData) }}
/>;
```

> **TypeScript 型別提示**：可使用 `schema-dts` 套件提供 JSON-LD 類型。

### 7. 連結與導航

- 內部連結使用 Next.js `<Link>` 元件，**路徑一律經過 `localizedPath(lng, path)`**，不可寫死 `/post/xxx`（會掉語系並觸發 middleware 轉址）
- 外部連結加上 `target="_blank"` 和 `rel="noopener noreferrer"`
- 確保所有導航連結可被爬蟲抓取（非純 JavaScript 渲染）；文章列表的「載入更多」必須保留可被抓取的連結
- 錨點連結需有對應的 `id`（`PostScrollSpy` 的目錄依賴 heading id）

### 8. 效能與 Core Web Vitals

效能直接影響 SEO 排名。以下規則對應 Google 的 Core Web Vitals 指標：

**CLS（Cumulative Layout Shift）：**

- 圖片設定固定尺寸或 `aspect-ratio`
- Suspense fallback 的尺寸應與最終內容匹配（例：`PostPageSkeleton` 要貼近 `PostDetailContent` 的實際高度）
- 使用 `min-height` 容器包裹 `<Suspense>` 區域預留空間

**LCP（Largest Contentful Paint）：**

- 首屏關鍵內容盡早渲染
- LCP 元素（主標題、主圖）應位於 `<Suspense>` 邊界**之外**，作為 static shell 的一部分
- LCP 圖片使用 `<Image priority />` 自動注入 preload
- 使用 Next.js `Font Module` 載入字型，避免 layout shift

**INP（Interaction to Next Paint）：**

- 善用 `<Suspense>` 邊界實現 selective hydration
- 每個 `<Suspense>` 是一個獨立的 hydration 單元

**JS Bundle 最小化：**

- 預設使用 Server Components
- 只在需要互動（`useState`、`useEffect`）、瀏覽器 API、event handler 時才使用 `"use client"`
- `"use client"` 應設定在最小粒度的互動元件上，而非整個頁面或大型佈局；MUI 元件容易把整棵樹拉進 client bundle，務必控制邊界

### 9. Streaming / PPR 與 SEO 的交互

- `generateMetadata` 對 bot（Twitterbot、Slackbot、Bingbot）會在 streaming 開始前解析完畢
- 一般瀏覽器中 metadata 可與頁面內容同步 streaming
- 可透過 `next.config.js` 的 `htmlLimitedBots` 設定自訂哪些 bot 接收阻塞式 metadata
- 若在 streaming 開始後呼叫 `notFound()`，HTTP status 無法變更為 404，Next.js 會改為注入 `<meta name="robots" content="noindex">`
- **最佳實踐**：將 `notFound()` 放在任何 `await` 或 `<Suspense>` 之前，以確保回傳正確的 HTTP 404 狀態碼

> **本專案現況**：`post/[slug]/page.tsx` 為了支援 PPR，把內容包在 `<Suspense>` 內，`notFound()` 因此在 streaming 之後才呼叫——失效文章會拿到 200 ＋ `noindex` 而非 404。這是已知取捨；若要改回真 404，需把 `getPost` 的存在性檢查提到 Suspense 之外。動到此頁時請保持認知，不要無意間改變現有行為。

### 10. 無障礙（Accessibility = SEO 加分）

- 互動元素設定 `aria-label`
- 表單元素搭配 `<label>`
- 確保鍵盤可操作
- 色彩對比度符合 WCAG AA 標準（深／淺色模式都要檢查）
- 使用內建 `eslint-plugin-jsx-a11y` 提早捕捉無障礙問題

---

## 檢查清單（每次建立新頁面時）

### 必須完成

- [ ] 設定 `generateMetadata`（title + description + OG）— 僅在 Server Component 中
- [ ] `alternates.canonical` 用 `localizedUrl()`、`alternates.languages` 用 `languageAlternates()`
- [ ] `openGraph.locale` 用 `openGraphLocale(lng)`
- [ ] 站名／描述取自 i18n，未寫死字串
- [ ] 單一 `<h1>`，標題層級正確
- [ ] 圖片全部使用 `<Image>` + 有意義的 `alt`
- [ ] 語意化 HTML 標籤（MUI 以 `component` prop 指定）
- [ ] 結構化資料 JSON-LD（如適用）— 使用原生 `<script>` + `stringifyStructuredData()` XSS 防護
- [ ] LCP 圖片設定 `priority`，且位於 `<Suspense>` 邊界之外
- [ ] 內部連結經過 `localizedPath()`
- [ ] 外部連結有 `rel="noopener noreferrer"`
- [ ] 新路由已加入 `sitemap.ts` 的 `STATIC_PATHS` 或 `robots.ts` 的 `disallow`

### 專案層級（已完成，異動時複查）

- [x] `robots.ts` 已建立
- [x] `sitemap.ts` 已建立（含 hreflang alternates）
- [x] `favicon.ico` 已放置於 `src/app/` 根目錄
- [x] 首頁 OG 圖 `public/images/home-og.jpg`
- [x] Sanity 圖片來源已在 `next.config` 的 `images.remotePatterns` 中設定

---

## 已知待修項目

- `post/[slug]/page.tsx` 的 JSON-LD 直接用 `JSON.stringify`，**未做 `\\u003c` 跳脫**；首頁的 `stringifyStructuredData` 才有。修到該頁時請一併統一。
- 全站缺少 `title.template`，文章詳情頁的 `<title>` 不含站名。若要補，應在 `[lng]/layout.tsx` 的 `generateMetadata` 加 `title: { default: siteName, template: "%s | Jacky Dev" }`，並移除列表頁手動拼接的 `| ${siteName}`。
