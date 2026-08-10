export const planLabels: Record<string, string> = {
  pro: "Pro",
  max5x: "Max 5x",
  max20x: "Max 20x",
};

export const durationLabels: Record<string, string> = {
  month: "月付",
  quarter: "季付",
  half_year: "半年付",
  year: "年付",
};

export const payChannelLabels: Record<string, string> = {
  alipay: "支付宝",
  wxpay: "微信支付",
  bank: "银行卡",
  applepay: "Apple Pay",
  link: "Link",
};

export const orderStatusLabels: Record<string, string> = {
  pending: "待支付",
  paid: "已支付待处理",
  fulfilling: "处理中",
  completed: "已完成",
  refunded: "已退款",
  cancelled: "已取消",
};
