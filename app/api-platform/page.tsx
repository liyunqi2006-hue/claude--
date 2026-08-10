import Link from "next/link";

export default function ApiPlatformComingSoonPage() {
  return (
    <main className="flex-1 mx-auto flex w-full max-w-lg flex-col items-center px-6 py-24 text-center">
      <h1 className="mb-3 text-2xl font-bold">API 平台即将上线</h1>
      <p className="mb-8 text-neutral-500 dark:text-neutral-400">
        按量付费的 Claude API 中转服务正在建设中，敬请期待。
      </p>
      <Link href="/" className="text-brand hover:underline">
        返回首页
      </Link>
    </main>
  );
}
