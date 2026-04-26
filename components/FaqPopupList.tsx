"use client";

import { useEffect, useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

export function FaqPopupList({ items }: { items: FaqItem[] }) {
  const [activeFaq, setActiveFaq] = useState<FaqItem | null>(null);

  useEffect(() => {
    if (!activeFaq) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveFaq(null);
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [activeFaq]);

  return (
    <>
      <div className="stack">
        {items.map((item) => (
          <button
            key={item.question}
            type="button"
            className="faq-chip"
            onClick={() => setActiveFaq(item)}
          >
            {item.question}
          </button>
        ))}
      </div>

      {activeFaq ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="faq-modal-title">
          <div className="modal-card glass-panel">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start" }}>
              <div className="stack" style={{ gap: 10 }}>
                <span className="eyebrow">Antwoord</span>
                <h3 id="faq-modal-title" style={{ margin: 0, fontSize: "2rem" }}>
                  {activeFaq.question}
                </h3>
              </div>
              <button type="button" className="button-ghost" onClick={() => setActiveFaq(null)}>
                Sluit
              </button>
            </div>
            <p className="muted" style={{ margin: 0, fontSize: "1.04rem", lineHeight: 1.7 }}>
              {activeFaq.answer}
            </p>
          </div>
          <button
            type="button"
            className="modal-overlay-close"
            aria-label="Sluit popup"
            onClick={() => setActiveFaq(null)}
          />
        </div>
      ) : null}
    </>
  );
}
