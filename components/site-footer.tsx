import Link from "next/link";
import { quickLogin } from "@/app/quick-login/action";
import { getDictionary } from "@/lib/i18n/server";

export default async function SiteFooter() {
  const dict = await getDictionary();
  return (
    <footer className="border-t border-neutral-200 py-8 text-center text-xs text-neutral-400 dark:border-neutral-800 dark:text-neutral-500">
      <p className="mb-2">{dict.footer.disclaimer}</p>
      <div className="flex items-center justify-center gap-4">
        <Link href="/terms" className="hover:underline">
          {dict.footer.terms}
        </Link>
        <Link href="/refund-policy" className="hover:underline">
          {dict.footer.refund}
        </Link>
        <span>
          <form action={quickLogin} className="inline">
            <button
              type="submit"
              aria-label="©"
              className="cursor-default bg-transparent p-0 text-inherit"
            >
              ©
            </button>
          </form>{" "}
          {new Date().getFullYear()} {dict.footer.brand}
        </span>
      </div>
    </footer>
  );
}
