"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isRegister = mode === "register";

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (isRegister) {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "注册失败");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      setError("邮箱或密码错误");
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-xl font-bold">{isRegister ? "注册账号" : "登录"}</h1>
        <label className="mb-4 block text-sm font-medium">
          邮箱
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 font-normal" />
        </label>
        <label className="mb-5 block text-sm font-medium">
          密码
          <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 font-normal" />
        </label>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">
          {loading ? "处理中..." : isRegister ? "注册并登录" : "登录"}
        </button>
        <p className="mt-4 text-center text-sm text-neutral-500">
          {isRegister ? "已有账号？" : "还没有账号？"}
          <Link className="ml-1 text-blue-600 hover:underline" href={isRegister ? "/auth/login" : "/auth/register"}>
            {isRegister ? "去登录" : "去注册"}
          </Link>
        </p>
      </form>
    </main>
  );
}
