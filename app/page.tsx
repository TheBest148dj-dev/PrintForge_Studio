import Link from "next/link";

import { ProductCard } from "@/components/ProductCard";
import { StatsStrip } from "@/components/StatsStrip";
import { getSiteContent } from "@/lib/content";
import { getFeaturedProducts, getSettings } from "@/lib/data";

export default async function HomePage() {
  const [products, settings, content] = await Promise.all([
    getFeaturedProducts(),
    getSettings(),
    getSiteContent()
  ]);

  const home = content.home as {
    eyebrow: string;
    primaryCta: string;
    secondaryCta: string;
    featuredEyebrow: string;
    featuredTitle: string;
    featuredDescription: string;
    whyEyebrow: string;
    whyTitle: string;
    whyDescription: string;
    adminButton: string;
    contactButton: string;
    highlightPills: string[];
  };

  return (
    <>
      <section className="page-section" style={{ paddingTop: 28 }}>
        <div className="container">
          <div
            className="glass-panel"
            style={{
              borderRadius: 34,
              padding: 34,
              display: "grid",
              gridTemplateColumns: "1.15fr 0.85fr",
              gap: 28
            }}
          >
            <div className="stack" style={{ gap: 22 }}>
              <span className="eyebrow">{home.eyebrow}</span>
              <h1 style={{ margin: 0, fontSize: "clamp(3rem, 7vw, 6rem)", lineHeight: 0.92 }}>
                {settings.shopName}
              </h1>
              <p className="muted" style={{ margin: 0, maxWidth: 680, fontSize: "1.12rem" }}>
                {settings.heroHeadline}
              </p>
              <div className="button-row">
                <Link href="/products" className="button">
                  {home.primaryCta}
                </Link>
                <Link href="/custom-quote" className="button-secondary">
                  {home.secondaryCta}
                </Link>
              </div>
            </div>
            <div
              style={{
                minHeight: 420,
                borderRadius: 28,
                background:
                  "linear-gradient(160deg, rgba(255,107,44,0.2), rgba(17,60,56,0.72)), url('https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1400&q=80') center/cover"
              }}
            />
          </div>
        </div>
      </section>

      <section className="page-section" style={{ paddingTop: 12 }}>
        <div className="container">
          <StatsStrip />
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">{home.featuredEyebrow}</span>
            <h2 style={{ margin: 0, fontSize: "clamp(2rem, 4vw, 3.3rem)" }}>{home.featuredTitle}</h2>
            <p style={{ margin: 0 }} className="muted">
              {home.featuredDescription}
            </p>
          </div>
          <div className="card-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="split-layout">
            <div className="glass-panel" style={{ borderRadius: 28, padding: 28 }}>
              <div className="section-heading">
                <span className="eyebrow">{home.whyEyebrow}</span>
                <h2 style={{ margin: 0 }}>{home.whyTitle}</h2>
              </div>
              <div className="stack">
                <p className="muted" style={{ margin: 0 }}>
                  {home.whyDescription}
                </p>
                <div className="button-row">
                  <Link href="/admin" className="button">
                    {home.adminButton}
                  </Link>
                  <Link href="/contact" className="button-ghost">
                    {home.contactButton}
                  </Link>
                </div>
              </div>
            </div>
            <div className="glass-panel" style={{ borderRadius: 28, padding: 28 }}>
              <div className="stack">
                {home.highlightPills.map((pill) => (
                  <span key={pill} className="pill">
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
