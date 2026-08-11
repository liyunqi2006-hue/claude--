"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";

const LINK_CLASS =
  "rounded-full px-3 py-2 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white";

// 根据当前页面切换：在查询订单页显示「返回主页」，其他页面显示「查询订单」。
export default function NavContextLink() {
  const pathname = usePathname();
  const { dict } = useI18n();
  const onLookup = pathname?.startsWith("/orders/lookup");

  return onLookup ? (
    <Link href="/" className={LINK_CLASS}>
      {dict.nav.backHome}
    </Link>
  ) : (
    <Link href="/orders/lookup" className={LINK_CLASS}>
      {dict.nav.lookup}
    </Link>
  );
}
