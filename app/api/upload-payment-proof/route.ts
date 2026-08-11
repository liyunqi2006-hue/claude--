import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const orderId = formData.get("orderId") as string;

    if (!file || !orderId) {
      return NextResponse.json({ error: "Missing file or orderId" }, { status: 400 });
    }

    // 验证订单存在
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 保存文件
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 生成文件名：orderId_timestamp.ext
    const ext = file.name.split(".").pop();
    const filename = `${orderId}_${Date.now()}.${ext}`;
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

    return NextResponse.json({ success: true, filename });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
