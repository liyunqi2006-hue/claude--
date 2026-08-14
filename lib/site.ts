// 站点公开地址：用于 SEO（sitemap / robots / canonical / 结构化数据）。
// 上线前在环境变量里设 SITE_URL 为正式域名，如 https://claudepay.com。
// 未设置时回退到 localhost，仅用于本地开发。
const RAW = process.env.SITE_URL || "http://localhost:3000";

// 去掉结尾的斜杠，避免拼出 https://x.com//path
export const SITE_URL = RAW.replace(/\/+$/, "");

// 拼接绝对路径
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
