import { getDictionary } from "@/lib/i18n/server";

export default async function PayRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNo: string }>;
  searchParams: Promise<{ url?: string }>;
}) {
  const { orderNo } = await params;
  const { url } = await searchParams;
  const dict = await getDictionary();

  return (
    <main className="flex-1 mx-auto w-full max-w-lg px-6 py-12 text-center">
      <h1 className="mb-4 text-xl font-bold">{dict.pay.orderCreated(orderNo)}</h1>
      <p className="mb-6 text-neutral-600">{dict.pay.redirectHint}</p>
      {url ? (
        <a
          href={url}
          className="inline-block rounded bg-blue-600 px-8 py-3 font-medium text-white hover:bg-blue-700"
        >
          {dict.pay.goToPay}
        </a>
      ) : (
        <p className="text-red-600">{dict.pay.noUrl}</p>
      )}
    </main>
  );
}
