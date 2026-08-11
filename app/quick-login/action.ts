"use server";

import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";

// 隐藏的免密快捷登录：签发固定账号 session，然后进入仪表盘。
export async function quickLogin() {
  await signIn("quick", { redirect: false });
  redirect("/dashboard");
}
