"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINK_CLASS =
  "rounded-full px-3 py-2 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white";

// 在联系我们页面显示「返回主页」，其他页面显示「联系我们」
export default function NavContactLink() {
  const pathname = usePathname();
  const onContact = pathname?.startsWith("/contact");

  return onContact ? (
    <Link href="/" className={LINK_CLASS}>
      返回主页
    </Link>
  ) : (
    <Link href="/contact" className={LINK_CLASS}>
      联系我们
    </Link>
  );
}
