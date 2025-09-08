// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseUrl = rawBaseUrl.replace(/\/+$/, ""); // 去尾斜線，避免 //server-sitemap.xml
module.exports = {
  siteUrl: baseUrl,
  generateRobotsTxt: true,
  exclude: ["/server-sitemap.xml", "/*/user", "/*/auth"],
  robotsTxtOptions: {
    additionalSitemaps: [`${baseUrl}/server-sitemap.xml`],
  },
};
