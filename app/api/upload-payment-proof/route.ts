import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/prisma";
import { sendAdminPaymentProof } from "@/lib/email-service";
import { PAYMENT_CONFIG } from "@/lib/payment-config";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const orderId = formData.get("orderId") as string;

    if (!file || !orderId) {
      return NextResponse.json({ error: "Missing file or orderId" }, { status: 400 });
    }

    // 校验文件类型（只允许常见图片格式）
    const ALLOWED: Record<string, string> = {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/webp": "webp",
    };
    const ext = ALLOWED[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: "只支持 PNG / JPG / WEBP 图片" },
        { status: 400 }
      );
    }

    // 校验文件大小（上限 5MB）
    const MAX_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "文件不能超过 5MB" }, { status: 400 });
    }

    // 验证订单存在
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { product: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 保存文件
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 文件名由订单 ID（清洗后）+ 时间戳 + 受信任的扩展名组成，
    // 不使用用户提供的原始文件名，避免路径穿越/恶意扩展名
    const safeOrderId = orderId.replace(/[^a-zA-Z0-9_-]/g, "");
    const filename = `${safeOrderId}_${Date.now()}.${ext}`;
    const uploadDir = join(process.cwd(), "uploads", "payment-proofs");
    const filepath = join(uploadDir, filename);

    // 确保目录存在
    const fs = require("fs");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    await writeFile(filepath, buffer);

    // 更新订单备注（存储截图路径）
    await prisma.order.update({
      where: { id: orderId },
      data: {
        noteFromUser: order.noteFromUser
          ? `${order.noteFromUser}\n[付款截图: ${filename}]`
          : `[付款截图: ${filename}]`,
      },
    });

    // 把截图作为附件发到管理员邮箱，方便直接查看核对（异步，不阻塞响应）
    sendAdminPaymentProof(
      order.orderNo,
      order.product.name,
      order.totalUSD.toFixed(2),
      order.contactEmail,
      PAYMENT_CONFIG.USDT_TRC20_ADDRESS,
      { filename, content: buffer, contentType: file.type }
    ).catch((err) => console.error("Failed to send admin payment proof:", err));

    return NextResponse.json({ success: true, filename });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
