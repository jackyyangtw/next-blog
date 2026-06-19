// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
const rawBaseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
  "http://localhost:3200";
const baseUrl = rawBaseUrl.replace(/\/+$/, ""); // 去尾斜線，避免 //server-sitemap.xml
module.exports = {
  siteUrl: baseUrl,
  generateRobotsTxt: true,
  exclude: ["/server-sitemap.xml", "/api/*", "/studio/*", "/*/user", "/*/auth"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/studio/", "/*/auth", "/*/user"],
      },
    ],
    additionalSitemaps: [`${baseUrl}/server-sitemap.xml`],
  },
};
