import Link from "next/link";

const TABS: { key: string; label: string }[] = [
  { key: "all", label: "所有订单" },
  { key: "subscription", label: "订阅" },
  { key: "api_credit", label: "API 额度" },
];

export default function DashboardTabs({ active }: { active: string }) {
  return (
    <nav className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white p-1 text-sm font-medium dark:border-neutral-800 dark:bg-neutral-900">
      {TABS.map((tab) => {
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
