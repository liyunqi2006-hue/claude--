import { prisma } from "./prisma";

// 生成 6 位数字验证码
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 创建验证码记录
export async function createVerificationCode(
  email: string,
  purpose: "order_lookup" | "admin_login"
): Promise<string> {
  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 分钟后过期

  await prisma.verificationCode.create({
    data: {
      email,
      purpose,
      code,
      expiresAt,
    },
  });

  return code;
}

// 验证验证码
export async function verifyCode(
  email: string,
  purpose: string,
  code: string
): Promise<boolean> {
  const record = await prisma.verificationCode.findFirst({
    where: {
      email,
      purpose,
      code,
      expiresAt: { gte: new Date() },
      usedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    return false;
  }

  // 标记为已使用
  await prisma.verificationCode.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  return true;
}

// 清理过期验证码（定时任务可调用）
export async function cleanExpiredCodes() {
  await prisma.verificationCode.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  });
}
