"use client";

import { Globe } from "lucide-react";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/context";

// 语言切换：写入 cookie 后用 window.location.reload() 让整个页面重新加载。
export default function LanguageToggle() {
  const { locale, dict } = useI18n();

  function toggle() {
    const next: Locale = locale === "zh" ? "en" : "zh";
    // 一年有效期，全站生效。
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    // 强制完整页面刷新以重新渲染服务端组件（包括 root layout）
    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dict.nav.switchLanguage}
      className="flex items-center gap-1 rounded-full px-3 py-2 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
    >
      <Globe size={16} />
      {dict.nav.language}
    </button>
  );
}
