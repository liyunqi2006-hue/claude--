"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Upload } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { format } from "@/lib/i18n/config";
import QRCode from "qrcode";
import { useEffect } from "react";

interface PaymentClientProps {
  orderId: string;
  orderNo: string;
  usdAmount: string;
  usdtAmount: string;
  usdtAddress: string;
}

export default function PaymentClient({
  orderId,
  orderNo,
  usdAmount,
  usdtAmount,
  usdtAddress,
}: PaymentClientProps) {
  const { dict } = useI18n();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [proofUploaded, setProofUploaded] = useState(false);

  // 生成二维码
  useEffect(() => {
    const generateQr = async () => {
      try {
        // 生成 TRC20 USDT 转账 URI
        const uri = `tron:${usdtAddress}?amount=${usdtAmount}&token=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`;
        const dataUrl = await QRCode.toDataURL(uri, {
          width: 256,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error("Failed to generate QR code:", err);
      }
    };
    generateQr();
  }, [usdtAddress, usdtAmount]);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(usdtAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleConfirmPayment = async () => {
    setConfirming(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/confirm-payment`, {
        method: "POST",
      });
      if (res.ok) {
        router.push(`/orders/${orderId}/result`);
      } else {
        alert("确认失败，请稍后再试");
      }
    } catch (err) {
      console.error("Confirm failed:", err);
      alert("确认失败，请稍后再试");
    } finally {
      setConfirming(false);
    }
  };

  const handleUploadProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("orderId", orderId);

      const res = await fetch("/api/upload-payment-proof", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setProofUploaded(true);
        alert("截图上传成功！确认已完成转账后，请点击下方「我已付款」按钮。");
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "上传失败，请稍后再试");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("上传失败，请稍后再试");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <>
      {/* USDT 金额 */}
      <div className="mb-6 rounded-xl bg-brand-50 p-4 dark:bg-brand/10">
        <div className="text-sm text-neutral-600 dark:text-neutral-400">{dict.payment.usdtAmount}</div>
        <div className="mt-1 text-3xl font-bold text-brand">{usdtAmount} USDT</div>
        <div className="mt-1 text-xs text-neutral-500">≈ ${usdAmount} USD (含手续费)</div>
      </div>

      {/* 二维码 */}
      <div className="mb-6 flex justify-center">
        <div className="rounded-xl border-4 border-neutral-200 bg-white p-4 dark:border-neutral-700">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Payment QR Code" className="h-64 w-64" />
          ) : (
            <div className="h-64 w-64 animate-pulse bg-neutral-100 dark:bg-neutral-800" />
          )}
        </div>
      </div>

      <p className="mb-4 text-center text-sm text-neutral-600 dark:text-neutral-400">
        {dict.payment.scanQrCode}
      </p>

      {/* 收款地址 */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">{dict.payment.usdtAddress}</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={usdtAddress}
            readOnly
            className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 font-mono text-sm dark:border-neutral-700 dark:bg-neutral-800"
          />
          <button
            type="button"
            onClick={copyAddress}
            className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? dict.payment.copied : dict.payment.copyAddress}
          </button>
        </div>
      </div>

      {/* 支付说明 */}
      <div className="mb-8 rounded-xl bg-yellow-50 p-4 dark:bg-yellow-900/20">
        <h3 className="mb-3 font-semibold text-yellow-900 dark:text-yellow-200">
          {dict.payment.paymentInstructions}
        </h3>
        <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-300">
          <li>{dict.payment.instruction1}</li>
          <li>{dict.payment.instruction2}</li>
          <li>{format(dict.payment.instruction3, { orderNo })}</li>
          <li>{dict.payment.instruction4}</li>
        </ul>
      </div>

      {/* 操作按钮 */}
      <div className="space-y-3">
        <label className="block">
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadProof}
            disabled={uploading}
            className="hidden"
            id="upload-proof"
          />
          <span className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-brand bg-brand-50 px-6 py-3 font-medium text-brand transition hover:bg-brand-100 dark:bg-brand/10 dark:hover:bg-brand/20">
            <Upload size={20} />
            {uploading
              ? "上传中..."
              : proofUploaded
                ? "重新上传截图"
                : dict.payment.uploadProof}
          </span>
        </label>

        <button
          type="button"
          onClick={handleConfirmPayment}
          disabled={confirming}
          className="w-full rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
        >
          {confirming ? dict.payment.waitingConfirm : dict.payment.confirmPayment}
        </button>

        <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
          {dict.payment.paymentNote}
        </p>

        <button
          type="button"
          onClick={() => router.push(`/orders/${orderId}/result`)}
          className="w-full rounded-lg border border-neutral-200 px-6 py-2 text-sm transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          {dict.payment.backToOrder}
        </button>
      </div>
    </>
  );
}
