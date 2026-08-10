import { signOut } from "@/lib/auth";

export default function UserSummary({ email }: { email: string }) {
  const initial = email.charAt(0).toUpperCase();

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
          {initial}
        </span>
        <div>
          <p className="font-medium text-neutral-900 dark:text-neutral-100">{email}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">欢迎回来</p>
        </div>
      </div>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          退出登录
        </button>
      </form>
    </div>
  );
}
