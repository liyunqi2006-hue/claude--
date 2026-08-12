import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactMessage } from "@/lib/email-service";

const schema = z.object({
  email: z.string().email(),
  orderNo: z.string().max(64).optional(),
  message: z.string().min(1).max(2000),
});

// 简单的内存级限流：同一 IP 30 秒内只能提交一次
const lastSubmit = new Map<string, number>();
const COOLDOWN_MS = 30 * 1000;

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const prev = lastSubmit.get(ip);
  if (prev && now - prev < COOLDOWN_MS) {
    return NextResponse.json({ error: "提交过于频繁，请稍后再试" }, { status: 429 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "参数不正确" }, { status: 400 });
  }

  lastSubmit.set(ip, now);

  try {
    await sendContactMessage({
      fromEmail: parsed.data.email,
      orderNo: parsed.data.orderNo,
      message: parsed.data.message,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send contact message:", error);
    return NextResponse.json({ error: "发送失败，请稍后重试" }, { status: 500 });
  }
}
