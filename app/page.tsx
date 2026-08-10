import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { planLabels, durationLabels } from "@/lib/labels";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: [{ type: "asc" }, { priceUSD: "asc" }],
  });

  const subscriptions = products.filter((p) => p.type === "subscription");
  const credits = products.filter((p) => p.type === "api_credit");

  const plans = ["pro", "max5x", "max30x"] as const;

  return (
    <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-12">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold">Claude 订阅代付 &amp; API 余额充值</h1>
        <p className="mt-2 text-neutral-600">
          支持微信 / 支付宝 / 银行卡 / Apple Pay / Link 代付，付款后人工开通，最快数小时内到账
        </p>
        <nav className="mt-4 flex justify-center gap-4 text-sm">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            用户中心
          </Link>
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            登录 / 注册
          </Link>
        </nav>
      </header>

      {plans.map((plan) => {
        const items = subscriptions.filter((p) => p.plan === plan);
        if (items.length === 0) return null;
        return (
          <section key={plan} className="mb-10">
            <h2 className="mb-4 text-xl font-semibold">Claude {planLabels[plan]}</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/checkout/${item.id}`}
                  className="rounded-lg border border-neutral-200 bg-white p-4 text-center shadow-sm transition hover:border-blue-400 hover:shadow-md"
                >
                  <div className="text-sm text-neutral-500">
                    {item.duration ? durationLabels[item.duration] : ""}
                  </div>
                  <div className="mt-2 text-2xl font-bold">
                    ${item.priceUSD.toString()}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {credits.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">API 余额充值</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {credits.map((item) => (
              <Link
                key={item.id}
                href={`/checkout/${item.id}`}
                className="rounded-lg border border-neutral-200 bg-white p-4 text-center shadow-sm transition hover:border-blue-400 hover:shadow-md"
              >
                <div className="text-sm text-neutral-500">
                  额度 ¥{item.creditAmount?.toString()}
                </div>
                <div className="mt-2 text-2xl font-bold">
                  ${item.priceUSD.toString()}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer className="mt-16 border-t border-neutral-200 pt-6 text-center text-xs text-neutral-400">
        本站提供代付服务，不直接销售 Anthropic 官方产品，最终服务以官方条款为准。下单前请仔细核对账号信息。
      </footer>
    </main>
  );
}
