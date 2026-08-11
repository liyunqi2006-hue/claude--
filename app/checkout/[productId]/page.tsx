import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/server";
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
  const dict = await getDictionary();

  const title =
    product.type === "subscription"
      ? dict.checkout.subscriptionTitle(
          product.plan ? dict.enums.plan[product.plan] : "",
          product.duration ? dict.enums.duration[product.duration] : "",
        )
      : dict.checkout.apiTitle(product.creditAmount?.toString() ?? "");

  return (
    <main className="flex-1 mx-auto w-full max-w-lg px-6 py-12">
      <h1 className="mb-2 text-2xl font-bold">{title}</h1>
      <p className="mb-8 text-neutral-500">{dict.checkout.unitPrice(product.priceUSD.toString())}</p>

      <CheckoutForm
        productId={product.id}
        unitPrice={Number(product.priceUSD)}
        exchangeRate={getUsdToCnyRate()}
        defaultEmail={session?.user?.email ?? ""}
        isSubscription={product.type === "subscription"}
      />
    </main>
  );
}
