import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 py-8 text-center text-xs text-neutral-400 dark:border-neutral-800 dark:text-neutral-500">
      <p className="mb-2">
        本站提供代付服务，不直接销售 Anthropic 官方产品，最终服务以官方条款为准。下单前请仔细核对账号信息。
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link href="/terms" className="hover:underline">
          服务条款
        </Link>
        <Link href="/refund-policy" className="hover:underline">
          退款政策
        </Link>
        <span>© {new Date().getFullYear()} Claude 代付</span>
      </div>
    </footer>
  );
}
