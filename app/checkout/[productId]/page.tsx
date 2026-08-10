import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { planLabels, durationLabels } from "@/lib/labels";
import { getUsdToCnyRate } from "@/lib/exchange";
import CheckoutForm from "./checkout-form";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.active) {
    notFound();
  }

  const session = await auth();

  const title =
    product.type === "subscription"
      ? `Claude ${planLabels[product.plan ?? ""]} · ${durationLabels[product.duration ?? ""]}`
      : `API 余额充值 · 额度 $${product.creditAmount?.toString()}`;

  return (
    <main className="flex-1 mx-auto w-full max-w-lg px-6 py-12">
      <h1 className="mb-2 text-2xl font-bold">{title}</h1>
      <p className="mb-8 text-neutral-500">单价 ${product.priceUSD.toString()}</p>

      {!session?.user ? (
        <p className="text-sm text-neutral-600">
          请先{" "}
          <a href="/auth/login" className="text-blue-600 hover:underline">
            登录
          </a>{" "}
          后下单。
        </p>
      ) : (
        <CheckoutForm
          productId={product.id}
          unitPrice={Number(product.priceUSD)}
          exchangeRate={getUsdToCnyRate()}
          defaultEmail={session.user.email ?? ""}
          isSubscription={product.type === "subscription"}
        />
      )}
    </main>
  );
}
