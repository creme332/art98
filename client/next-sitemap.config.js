/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://art98.vercel.app",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  sitemapSize: 10,
};
