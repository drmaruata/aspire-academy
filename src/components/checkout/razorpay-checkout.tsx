"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, cb: (resp: unknown) => void) => void;
    };
  }
}

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
};

const SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

function loadScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_URL}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function RazorpayCheckout({
  orderId,
  amount,
  currency,
  keyId,
  courseName,
  prefill,
  siteName,
  successPath,
}: {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  courseName: string;
  prefill: { name?: string; email?: string; contact?: string };
  siteName: string;
  successPath: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setError(null);
    setLoading(true);

    const ok = await loadScript();
    if (!ok || !window.Razorpay) {
      setLoading(false);
      setError("Couldn't load the Razorpay checkout. Please retry.");
      return;
    }

    const rzp = new window.Razorpay({
      key: keyId,
      amount,
      currency,
      name: siteName,
      description: courseName,
      order_id: orderId,
      prefill,
      theme: { color: "#1A3C34" },
      modal: {
        ondismiss: () => setLoading(false),
      },
      handler: async (resp) => {
        try {
          const r = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(resp),
          });
          const json = (await r.json()) as { ok: boolean; message?: string };
          if (!r.ok || !json.ok) {
            setLoading(false);
            setError(
              json.message ??
                "Payment received, but verification failed. Our team will reconcile via webhook."
            );
            return;
          }
          router.push(successPath);
        } catch (err) {
          console.error("[checkout] verify failed", err);
          setLoading(false);
          setError(
            "Couldn't reach the verification endpoint. We'll reconcile via webhook."
          );
        }
      },
    });

    rzp.open();
  }

  return (
    <div className="mt-6">
      <button
        onClick={handlePay}
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-[0.95rem] font-semibold text-white shadow-[0_4px_16px_rgba(201,144,28,0.35)] transition-all hover:-translate-y-0.5 hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
      >
        <CreditCard className="h-4 w-4" />
        {loading ? "Opening Razorpay…" : "Pay securely"}
      </button>
      {error && (
        <p
          role="alert"
          className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[0.85rem] text-red-700"
        >
          {error}
        </p>
      )}
    </div>
  );
}
