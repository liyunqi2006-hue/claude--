import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      { type: "subscription", plan: "pro", duration: "month", name: "Claude Pro 月付", priceCNY: 89 },
      { type: "subscription", plan: "pro", duration: "quarter", name: "Claude Pro 季付", priceCNY: 249 },
      { type: "subscription", plan: "pro", duration: "half_year", name: "Claude Pro 半年付", priceCNY: 469 },
      { type: "subscription", plan: "pro", duration: "year", name: "Claude Pro 年付", priceCNY: 869 },
      { type: "subscription", plan: "max5x", duration: "month", name: "Claude Max5x 月付", priceCNY: 449 },
      { type: "subscription", plan: "max5x", duration: "quarter", name: "Claude Max5x 季付", priceCNY: 1269 },
      { type: "subscription", plan: "max5x", duration: "half_year", name: "Claude Max5x 半年付", priceCNY: 2399 },
      { type: "subscription", plan: "max5x", duration: "year", name: "Claude Max5x 年付", priceCNY: 4499 },
      { type: "subscription", plan: "max30x", duration: "month", name: "Claude Max30x 月付", priceCNY: 2249 },
      { type: "subscription", plan: "max30x", duration: "quarter", name: "Claude Max30x 季付", priceCNY: 6299 },
      { type: "subscription", plan: "max30x", duration: "half_year", name: "Claude Max30x 半年付", priceCNY: 11999 },
      { type: "subscription", plan: "max30x", duration: "year", name: "Claude Max30x 年付", priceCNY: 22499 },
      { type: "api_credit", creditAmount: 50, name: "API 余额充值 ¥50 档", priceCNY: 55 },
      { type: "api_credit", creditAmount: 100, name: "API 余额充值 ¥100 档", priceCNY: 108 },
      { type: "api_credit", creditAmount: 300, name: "API 余额充值 ¥300 档", priceCNY: 318 },
      { type: "api_credit", creditAmount: 500, name: "API 余额充值 ¥500 档", priceCNY: 525 },
    ],
    skipDuplicates: true,
  });

  const adminPasswordHash = await bcrypt.hash("ChangeMe123!", 10);
  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", passwordHash: adminPasswordHash, role: "admin" },
  });

  console.log("种子数据写入完成，默认管理员账号 admin / ChangeMe123!（请上线前修改）");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
