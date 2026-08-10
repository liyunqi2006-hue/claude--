import crypto from "crypto";

// 易支付（码支付类）通用签名与下单封装
// 文档约定：sign = MD5(按 key 升序拼接的 "k1=v1&k2=v2..." + 商户密钥)，
// 参与签名时排除 sign / sign_type，以及值为空的字段。

export type EpayType = "alipay" | "wxpay" | "bank" | "applepay" | "link";

interface EpaySubmitParams {
  pid: string;
  type: EpayType;
  out_trade_no: string;
  notify_url: string;
  return_url: string;
  name: string;
  money: string; // 保留两位小数的字符串，如 "19.90"
  [key: string]: string;
}

function getConfig() {
  const pid = process.env.EPAY_PID;
  const key = process.env.EPAY_KEY;
  const apiUrl = process.env.EPAY_API_URL;
  if (!pid || !key || !apiUrl) {
    throw new Error("易支付环境变量未配置完整（EPAY_PID / EPAY_KEY / EPAY_API_URL）");
  }
  return { pid, key, apiUrl };
}

export function sign(params: Record<string, string>, key: string): string {
  const filteredKeys = Object.keys(params)
    .filter((k) => k !== "sign" && k !== "sign_type" && params[k] !== "" && params[k] != null)
    .sort();
  const joined = filteredKeys.map((k) => `${k}=${params[k]}`).join("&");
  return crypto.createHash("md5").update(joined + key).digest("hex");
}

export function verifySign(params: Record<string, string>): boolean {
  const { key } = getConfig();
  const received = params.sign;
  if (!received) return false;
  const expected = sign(params, key);
  return expected === received;
}

// 构造跳转到易支付收银台的 URL（GET 方式，pagepay 接口）
export function buildPaymentUrl(order: {
  outTradeNo: string;
  name: string;
  money: string;
  type: EpayType;
}): string {
  const { pid, key, apiUrl } = getConfig();
  const notifyUrl = `${process.env.APP_URL}/api/pay/notify`;
  const returnUrl = `${process.env.APP_URL}/pay/result?orderNo=${order.outTradeNo}`;

  const params: EpaySubmitParams = {
    pid,
    type: order.type,
    out_trade_no: order.outTradeNo,
    notify_url: notifyUrl,
    return_url: returnUrl,
    name: order.name,
    money: order.money,
  };

  const signature = sign(params, key);
  const query = new URLSearchParams({ ...params, sign: signature, sign_type: "MD5" });
  return `${apiUrl}/submit.php?${query.toString()}`;
}

export interface EpayNotifyPayload {
  pid: string;
  trade_no: string;
  out_trade_no: string;
  type: string;
  name: string;
  money: string;
  trade_status: string;
  sign: string;
  sign_type: string;
  [key: string]: string;
}

export function isNotifyValid(payload: EpayNotifyPayload): boolean {
  const { pid } = getConfig();
  if (payload.pid !== pid) return false;
  if (payload.trade_status !== "TRADE_SUCCESS") return false;
  return verifySign(payload);
}
