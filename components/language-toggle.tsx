"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/context";

// 语言切换：写入 cookie 后用 router.refresh() 让服务端组件以新语言重新渲染。
export default function LanguageToggle() {
  const { locale, dict } = useI18n();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next: Locale = locale === "zh" ? "en" : "zh";
    // 一年有效期，全站生效。
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-label={dict.nav.switchLanguage}
      className="flex items-center gap-1 rounded-full px-3 py-2 transition hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50 dark:hover:bg-neutral-800 dark:hover:text-white"
    >
      <Globe size={16} />
      {dict.nav.language}
    </button>
  );
}
