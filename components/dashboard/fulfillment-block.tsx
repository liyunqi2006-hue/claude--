"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function FulfillmentBlock({
  title,
  content,
  hint,
}: {
  title: string;
  content: string;
  hint?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950/40">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
          {title}
        </h3>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-brand-700 transition hover:bg-brand-50 dark:text-brand-100 dark:hover:bg-brand/10"
        >
          {copied ? (
            <>
              <Check size={14} /> 已复制
            </>
          ) : (
            <>
              <Copy size={14} /> 复制
            </>
          )}
        </button>
      </div>
      {hint && (
        <p className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">{hint}</p>
      )}
      <pre className="min-w-0 overflow-x-hidden whitespace-pre-wrap break-all rounded-lg bg-white p-3 text-xs text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
        {content}
      </pre>
    </div>
  );
}
