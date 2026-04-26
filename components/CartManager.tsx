"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { StripeCheckoutButton } from "@/components/StripeCheckoutButton";
import { formatPrice } from "@/lib/utils";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  material: string;
};

export function CartManager({ initialItems }: { initialItems: CartItem[] }) {
  const [items, setItems] = useState(initialItems);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  function updateQuantity(id: string, quantity: number) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="split-layout">
      <div className="glass-panel" style={{ borderRadius: 28, padding: 28 }}>
        <h2 style={{ marginTop: 0 }}>Voorbeeld mandje</h2>
        {items.length === 0 ? (
          <div className="stack">
            <p className="muted" style={{ margin: 0 }}>
              Je winkelmand is leeg.
            </p>
            <div className="button-row">
              <Link href="/products" className="button">
                Bekijk producten
              </Link>
            </div>
          </div>
        ) : (
          <div className="stack">
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  paddingBottom: 16,
                  borderBottom: "1px solid var(--line)",
                  flexWrap: "wrap"
                }}
              >
                <div className="stack" style={{ gap: 4 }}>
                  <strong>{item.name}</strong>
                  <span className="muted">{item.material}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <label className="field" style={{ minWidth: 120 }}>
                    <span>Aantal</span>
                    <select
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                    >
                      <option value={1}>1 keer</option>
                      <option value={2}>2 keer</option>
                      <option value={3}>3 keer</option>
                      <option value={4}>4 keer</option>
                      <option value={5}>5 keer</option>
                    </select>
                  </label>
                  <strong style={{ minWidth: 110, textAlign: "right" }}>
                    {formatPrice(item.price * item.quantity)}
                  </strong>
                  <button className="button-ghost" type="button" onClick={() => removeItem(item.id)}>
                    Verwijder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass-panel" style={{ borderRadius: 28, padding: 28 }}>
        <h2 style={{ marginTop: 0 }}>Checkout overzicht</h2>
        <div className="stack">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <span className="muted">Subtotaal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <span className="muted">Verzending</span>
            <strong>{formatPrice(0)}</strong>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              paddingTop: 12,
              borderTop: "1px solid var(--line)"
            }}
          >
            <span>Totaal</span>
            <strong style={{ fontSize: "1.25rem" }}>{formatPrice(subtotal)}</strong>
          </div>
          <StripeCheckoutButton
            items={items.map((item) => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity
            }))}
          />
          <p className="muted" style={{ margin: 0 }}>
            Je kunt nu aantallen aanpassen met de dropdown of een item volledig uit de winkelmand verwijderen.
          </p>
          <div className="button-row">
            <Link href="/products" className="button-ghost">
              Verder shoppen
            </Link>
            <Link href="/contact" className="button-ghost">
              Stel een vraag
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
