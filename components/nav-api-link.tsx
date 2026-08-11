"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";

const LINK_CLASS =
  "rounded-full px-3 py-2 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white";

// 在 API 平台页显示「Claude 订阅」跳回首页，其他页面显示「API 平台」。
export default function NavApiLink() {
  const pathname = usePathname();
  const { dict } = useI18n();
  const onApiPlatform = pathname?.startsWith("/api-platform");

  return onApiPlatform ? (
    <Link href="/" className={LINK_CLASS}>
      {dict.nav.subscription}
    </Link>
  ) : (
    <Link href="/api-platform" className={LINK_CLASS}>
      {dict.nav.apiPlatform}
    </Link>
  );
}
