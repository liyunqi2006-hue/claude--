export default async function PayRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNo: string }>;
  searchParams: Promise<{ url?: string }>;
}) {
  const { orderNo } = await params;
  const { url } = await searchParams;

  return (
    <main className="flex-1 mx-auto w-full max-w-lg px-6 py-12 text-center">
      <h1 className="mb-4 text-xl font-bold">订单 {orderNo} 已创建</h1>
      <p className="mb-6 text-neutral-600">请点击下方按钮跳转至支付页面完成付款</p>
      {url ? (
        <a
          href={url}
          className="inline-block rounded bg-blue-600 px-8 py-3 font-medium text-white hover:bg-blue-700"
        >
          前往支付
        </a>
      ) : (
        <p className="text-red-600">未获取到支付链接，请返回重新下单</p>
      )}
    </main>
  );
}
