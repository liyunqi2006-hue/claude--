import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendVerificationCode } from "@/lib/resend";

const schema = z.object({
  email: z.string().email(),
  purpose: z.literal("order_lookup"),
});

const RESEND_COOLDOWN_MS = 60 * 1000;
const CODE_TTL_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "参数不正确" }, { status: 400 });
  }
  const { email, purpose } = parsed.data;

  const recent = await prisma.verificationCode.findFirst({
    where: { email, purpose },
    orderBy: { createdAt: "desc" },
  });
  if (recent && Date.now() - recent.createdAt.getTime() < RESEND_COOLDOWN_MS) {
    return NextResponse.json({ error: "请求过于频繁，请稍后再试" }, { status: 429 });
  }

  const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
  await prisma.verificationCode.create({
    data: { email, purpose, code, expiresAt: new Date(Date.now() + CODE_TTL_MS) },
  });

  await sendVerificationCode(email, code);

  return NextResponse.json({ ok: true });
}
