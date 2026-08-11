import Link from "next/link";
import { getDictionary } from "@/lib/i18n/server";

export default async function DashboardTabs({ active }: { active: string }) {
  const dict = await getDictionary();
  const tabs: { key: string; label: string }[] = [
    { key: "all", label: dict.dashboard.tabs.all },
    { key: "subscription", label: dict.dashboard.tabs.subscription },
    { key: "api_credit", label: dict.dashboard.tabs.apiCredit },
  ];

  return (
    <nav className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white p-1 text-sm font-medium dark:border-neutral-800 dark:bg-neutral-900">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Link
            key={tab.key}
            href={tab.key === "all" ? "/dashboard" : `/dashboard?tab=${tab.key}`}
            className={`rounded-full px-4 py-1.5 transition ${
              isActive
                ? "bg-brand-50 text-brand-700 dark:bg-brand/10 dark:text-brand-100"
                : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
