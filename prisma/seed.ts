import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      // 官方订阅费 + 服务费，价格以美元计价，支付时按汇率折算为人民币
      { type: "subscription", plan: "pro", duration: "month", name: "Claude Pro 月付", priceUSD: 25 },
      { type: "subscription", plan: "pro", duration: "quarter", name: "Claude Pro 季付", priceUSD: 75 },
      { type: "subscription", plan: "pro", duration: "half_year", name: "Claude Pro 半年付", priceUSD: 149 },
      { type: "subscription", plan: "pro", duration: "year", name: "Claude Pro 年付", priceUSD: 298 },
      { type: "subscription", plan: "max5x", duration: "month", name: "Claude Max5x 月付", priceUSD: 123 },
      { type: "subscription", plan: "max5x", duration: "quarter", name: "Claude Max5x 季付", priceUSD: 369 },
      { type: "subscription", plan: "max5x", duration: "half_year", name: "Claude Max5x 半年付", priceUSD: 719 },
      { type: "subscription", plan: "max5x", duration: "year", name: "Claude Max5x 年付", priceUSD: 1428 },
      { type: "subscription", plan: "max20x", duration: "month", name: "Claude Max20x 月付", priceUSD: 240 },
      { type: "subscription", plan: "max20x", duration: "quarter", name: "Claude Max20x 季付", priceUSD: 719 },
      { type: "subscription", plan: "max20x", duration: "half_year", name: "Claude Max20x 半年付", priceUSD: 1428 },
      { type: "subscription", plan: "max20x", duration: "year", name: "Claude Max20x 年付", priceUSD: 2849 },
      { type: "api_credit", creditAmount: 50, name: "API 余额充值 $50 档", priceUSD: 55 },
      { type: "api_credit", creditAmount: 100, name: "API 余额充值 $100 档", priceUSD: 108 },
      { type: "api_credit", creditAmount: 300, name: "API 余额充值 $300 档", priceUSD: 318 },
      { type: "api_credit", creditAmount: 500, name: "API 余额充值 $500 档", priceUSD: 525 },
    ],
  });

  // 注意：不在种子数据中创建管理员账号，避免留下默认弱口令后门。
  // 管理员账号请通过专用脚本或手动方式安全创建。

  console.log("种子数据写入完成（商品目录）。");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
