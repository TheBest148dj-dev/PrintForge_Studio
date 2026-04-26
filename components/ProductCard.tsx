import Image from "next/image";
import Link from "next/link";

import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article
      className="glass-panel"
      style={{ borderRadius: 24, overflow: "hidden", display: "grid", minHeight: "100%" }}
    >
      <div style={{ position: "relative", aspectRatio: "4 / 3" }}>
        <Image src={product.image} alt={product.name} fill style={{ objectFit: "cover" }} />
      </div>
      <div style={{ padding: 22, display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span className="pill">{product.heroTag}</span>
          <span className="muted">{product.material}</span>
        </div>
        <div className="stack" style={{ gap: 8 }}>
          <h3 style={{ margin: 0, fontSize: "1.45rem" }}>{product.name}</h3>
          <p className="muted" style={{ margin: 0 }}>
            {product.shortDescription}
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <strong style={{ fontSize: "1.2rem" }}>{formatPrice(product.price)}</strong>
          <Link href={`/products/${product.slug}`} className="button-ghost">
            Bekijk product
          </Link>
        </div>
      </div>
    </article>
  );
}
