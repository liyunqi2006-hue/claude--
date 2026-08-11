import { getAdminSession } from "@/lib/admin-session";
import Link from "next/link";
import { LogoutButton } from "./logout-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  return (
    <div className="flex min-h-screen flex-col">
      {session && (
        <header className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-lg font-bold">
                后台管理
              </Link>
              <nav className="flex gap-6 text-sm">
                <Link
                  href="/admin/orders"
                  className="text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                >
                  订单管理
                </Link>
                <span className="text-neutral-300 dark:text-neutral-700">
                  商品管理
                </span>
                <span className="text-neutral-300 dark:text-neutral-700">
                  系统设置
                </span>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {session.username}
              </span>
              <LogoutButton />
            </div>
          </div>
        </header>
      )}
      {children}
    </div>
  );
}
