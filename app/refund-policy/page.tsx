export default function RefundPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <h1 className="mb-4 text-2xl font-bold">退款政策</h1>
      <p className="text-sm leading-7 text-neutral-600 dark:text-neutral-300">
        订单在支付完成、官方激活链接尚未发送前，可申请取消并退款。激活链接一经发送至您填写的接收邮箱，即视为服务已完成交付，不再支持退款。若订单超时未支付，系统将自动取消，不产生任何费用。如遇支付异常导致重复扣款，请联系客服核实处理。
      </p>
    </main>
  );
}
