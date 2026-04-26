import Link from "next/link";

import { PageHero } from "@/components/PageHero";

export default function CheckoutCancelPage() {
  return (
    <>
      <PageHero
        eyebrow="Stripe Checkout"
        title="Betaling geannuleerd"
        description="De klant is teruggekeerd zonder de betaling af te ronden."
      />
      <section className="page-section">
        <div className="container">
          <div className="glass-panel" style={{ borderRadius: 28, padding: 28 }}>
            <div className="stack">
              <h2 style={{ margin: 0 }}>Geen probleem</h2>
              <p className="muted" style={{ margin: 0 }}>
                Je kunt de winkelmand opnieuw bekijken, de bestelling aanpassen of later opnieuw proberen.
              </p>
              <div className="button-row">
                <Link href="/cart" className="button">
                  Terug naar winkelmand
                </Link>
                <Link href="/products" className="button-ghost">
                  Bekijk producten
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
