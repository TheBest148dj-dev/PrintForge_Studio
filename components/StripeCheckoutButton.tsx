"use client";

import { useState } from "react";

type CheckoutItem = {
  name: string;
  price: number;
  quantity: number;
};

export function StripeCheckoutButton({ items }: { items: CheckoutItem[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");

     if (items.length === 0) {
      setError("Je winkelmand is leeg.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ items })
      });

      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        setError(payload.error || "Stripe checkout kon niet gestart worden.");
        setLoading(false);
        return;
      }

      window.location.href = payload.url;
    } catch {
      setError("Er liep iets mis bij het verbinden met Stripe.");
      setLoading(false);
    }
  }

  return (
    <div className="stack" style={{ gap: 12 }}>
      <button className="button" type="button" onClick={handleCheckout} disabled={loading}>
        {loading ? "Checkout starten..." : "Afrekenen met Stripe"}
      </button>
      {error ? (
        <p style={{ margin: 0, color: "#a72c17" }}>{error}</p>
      ) : null}
    </div>
  );
}
