import Link from "next/link";

import { PageHero } from "@/components/PageHero";

export default function CheckoutSuccessPage() {
  return (
    <>
      <PageHero
        eyebrow="Stripe Checkout"
        title="Betaling succesvol ontvangen"
        description="De klant heeft Stripe Checkout afgerond en is veilig teruggekeerd naar je webshop."
      />
      <section className="page-section">
        <div className="container">
          <div className="glass-panel" style={{ borderRadius: 28, padding: 28 }}>
            <div className="stack">
              <h2 style={{ margin: 0 }}>Bedankt voor je bestelling</h2>
              <p className="muted" style={{ margin: 0 }}>
                Volgende logische stap: orders bewaren in een database en een automatische bevestigingsmail sturen.
              </p>
              <div className="button-row">
                <Link href="/products" className="button">
                  Verder winkelen
                </Link>
                <Link href="/contact" className="button-ghost">
                  Contact opnemen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
