import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import UserSummary from "@/components/dashboard/user-summary";

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  return (
    <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-10">
      <UserSummary email={session.user.email ?? ""} />
      <div className="mt-8">{children}</div>
    </main>
  );
}
