"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "登录失败");
      setLoading(false);
      return;
    }
    router.push("/admin/orders");
    router.refresh();
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-xl font-bold">后台登录</h1>
        <label className="mb-4 block text-sm font-medium">用户名
          <input required value={username} onChange={(event) => setUsername(event.target.value)} className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 font-normal" />
        </label>
        <label className="mb-5 block text-sm font-medium">密码
          <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 font-normal" />
        </label>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">
          {loading ? "登录中..." : "登录"}
        </button>
      </form>
    </main>
  );
}
