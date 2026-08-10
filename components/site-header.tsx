import Link from "next/link";
import { Zap, Globe } from "lucide-react";
import { auth } from "@/lib/auth";
import ThemeToggle from "./theme-toggle";

export default async function SiteHeader() {
  const session = await auth();
  const email = session?.user?.email;

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/70 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
            <Zap size={18} fill="currentColor" />
          </span>
          <span className="text-lg">Claude 代付</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          {email ? (
            <Link
              href="/dashboard"
              className="rounded-full px-3 py-2 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
            >
              我的仪表盘
            </Link>
          ) : (
            <Link
              href="/orders/lookup"
              className="rounded-full px-3 py-2 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
            >
              查询订单
            </Link>
          )}
          <Link
            href="/api-platform"
            className="rounded-full px-3 py-2 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            API 平台
          </Link>
          <button
            type="button"
            className="flex items-center gap-1 rounded-full px-3 py-2 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
            aria-label="切换语言"
          >
            <Globe size={16} />
            中文
          </button>
          <div className="ml-1 h-5 w-px bg-neutral-200 dark:bg-neutral-800" />
          <ThemeToggle />
          {email ? (
            <Link
              href="/dashboard"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white"
              aria-label="我的仪表盘"
            >
              {email.charAt(0).toUpperCase()}
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-lg border border-neutral-200 px-3 py-1.5 transition hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              登录
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
