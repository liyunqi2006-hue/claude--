import Link from "next/link";
import { Zap } from "lucide-react";
import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/server";
import ThemeToggle from "./theme-toggle";
import NavContextLink from "./nav-context-link";
import NavContactLink from "./nav-contact-link";
import LanguageToggle from "./language-toggle";

export default async function SiteHeader() {
  const session = await auth();
  const email = session?.user?.email;
  const dict = await getDictionary();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/70 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
            <Zap size={18} fill="currentColor" />
          </span>
          <span className="text-lg">{dict.nav.brand}</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          <NavContextLink />
          <NavContactLink />
          <LanguageToggle />
          <div className="ml-1 h-5 w-px bg-neutral-200 dark:bg-neutral-800" />
          <ThemeToggle />
          {email ? (
            <Link
              href="/dashboard"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white"
              aria-label={dict.nav.dashboard}
            >
              {email.charAt(0).toUpperCase()}
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
