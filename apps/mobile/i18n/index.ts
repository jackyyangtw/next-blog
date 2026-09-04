export const supportedLocales = ["zh-TW", "en"] as const;

export type AppLocale = (typeof supportedLocales)[number];
export type TranslationValues = Record<string, number | string>;

const translations = {
  en: {
    "article.backToList":
      "Return to the article list to choose another article.",
    "article.notFound": "This article could not be found",
    "article.untitled": "Article",
    "auth.description": "Sign in to manage your saved articles and profile.",
    "auth.pending": "Sign-in integration is coming soon",
    "auth.title": "Sign in to Jacky Dev",
    "common.readArticle": "Read article",
    "featured.eyebrow": "Featured this week",
    "featured.read": "Start reading",
    "home.articleCount": "{{count}} articles",
    "home.exploreTopics": "Explore topics",
    "home.tagline": "For people who keep refining products",
    "nav.home": "Home",
    "nav.posts": "Articles",
    "nav.settings": "Settings",
    "nav.user": "Account",
    "posts.description":
      "Notes on product, frontend development, and AI in practice.",
    "posts.title": "All articles",
    "settings.appearance": "Appearance",
    "settings.darkMode": "Dark mode",
    "settings.darkModeDescription":
      "Use a darker surface for low-light reading.",
    "settings.language": "Language",
    "settings.languageDescription":
      "Choose the language for app interface text.",
    "settings.title": "Settings",
    "topic.all": "All",
    "topic.filter": "Filter topic: {{topic}}",
    "user.description": "Sign in to sync your saved articles.",
    "user.goToLogin": "Go to sign in",
    "user.notSignedIn": "Not signed in",
    "user.title": "Your account",
  },
  "zh-TW": {
    "article.backToList": "請返回文章列表，選擇其他文章。",
    "article.notFound": "找不到這篇文章",
    "article.untitled": "文章",
    "auth.description": "登入後可管理收藏文章與個人資料。",
    "auth.pending": "登入串接準備中",
    "auth.title": "登入 Jacky Dev",
    "common.readArticle": "閱讀文章",
    "featured.eyebrow": "本週精選",
    "featured.read": "開始閱讀",
    "home.articleCount": "{{count}} 篇文章",
    "home.exploreTopics": "探索主題",
    "home.tagline": "寫給持續打磨產品的人",
    "nav.home": "首頁",
    "nav.posts": "文章",
    "nav.settings": "設定",
    "nav.user": "我的",
    "posts.description": "持續累積產品、前端與 AI 的實作筆記。",
    "posts.title": "所有文章",
    "settings.appearance": "外觀",
    "settings.darkMode": "深色模式",
    "settings.darkModeDescription": "在低光環境使用較舒適的深色介面。",
    "settings.language": "語言",
    "settings.languageDescription": "選擇 App 介面文字使用的語言。",
    "settings.title": "設定",
    "topic.all": "全部",
    "topic.filter": "篩選主題：{{topic}}",
    "user.description": "登入後即可同步你的收藏文章。",
    "user.goToLogin": "前往登入",
    "user.notSignedIn": "尚未登入",
    "user.title": "我的帳號",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["zh-TW"];

export function getAppLocale(
  languageCode: string | null | undefined,
): AppLocale {
  return languageCode === "en" ? "en" : "zh-TW";
}

export function translate(
  locale: AppLocale,
  key: TranslationKey,
  values: TranslationValues = {},
): string {
  let message: string = translations[locale][key];

  for (const [name, value] of Object.entries(values)) {
    message = message.replace(`{{${name}}}`, String(value));
  }

  return message;
}
