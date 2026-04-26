import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/PageHero";
import { StlViewer } from "@/components/StlViewer";
import { getProductBySlug } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <PageHero
        eyebrow={product.category}
        title={product.name}
        description={product.description}
        actionLabel="Ga naar winkelmand"
        actionHref="/cart"
      />
      <section className="page-section">
        <div className="container">
          <div className="split-layout">
            <div className="stack">
              <div style={{ position: "relative", aspectRatio: "4 / 3", borderRadius: 28, overflow: "hidden" }}>
                <Image src={product.image} alt={product.name} fill style={{ objectFit: "cover" }} />
              </div>
              <div className="card-grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
                {product.gallery.map((image) => (
                  <div key={image} style={{ position: "relative", aspectRatio: "4 / 3", borderRadius: 22, overflow: "hidden" }}>
                    <Image src={image} alt={product.name} fill style={{ objectFit: "cover" }} />
                  </div>
                ))}
              </div>
              {product.stlUrl ? (
                <div className="glass-panel" style={{ borderRadius: 28, padding: 22 }}>
                  <div className="section-heading" style={{ marginBottom: 18 }}>
                    <span className="eyebrow">3D Preview</span>
                    <h2 style={{ margin: 0 }}>Bekijk dit product als STL</h2>
                  </div>
                  <StlViewer initialUrl={product.stlUrl} allowUpload={false} />
                </div>
              ) : null}
            </div>
            <div className="stack">
              <div className="glass-panel" style={{ borderRadius: 28, padding: 28 }}>
                <div className="stack">
                  <span className="pill">{product.heroTag}</span>
                  <h2 style={{ margin: 0, fontSize: "2.4rem" }}>{formatPrice(product.price)}</h2>
                  <p className="muted" style={{ margin: 0 }}>
                    Materiaal: {product.material} | Voorraad: {product.stock} | Levertijd: {product.leadTimeDays} dagen
                  </p>
                  <div className="button-row">
                    <Link href="/cart" className="button">
                      Voeg toe aan mandje
                    </Link>
                    <Link href="/custom-quote" className="button-ghost">
                      Vraag variant aan
                    </Link>
                  </div>
                </div>
              </div>
              <div className="glass-panel" style={{ borderRadius: 28, padding: 28 }}>
                <h3 style={{ marginTop: 0 }}>Specificaties</h3>
                <div className="stack">
                  {product.specs.map((spec) => (
                    <div key={spec} className="pill" style={{ width: "fit-content" }}>
                      {spec}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
