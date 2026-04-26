import { CartManager } from "@/components/CartManager";
import { PageHero } from "@/components/PageHero";
import { getSiteContent } from "@/lib/content";
import { getFeaturedProducts } from "@/lib/data";

export default async function CartPage() {
  const [products, content] = await Promise.all([getFeaturedProducts(), getSiteContent()]);
  const cartContent = content.cart as {
    hero: { eyebrow: string; title: string; description: string };
    stripeHint: string;
  };

  const cartItems = products.slice(0, 2).map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1,
    material: product.material
  }));

  return (
    <>
      <PageHero
        eyebrow={cartContent.hero.eyebrow}
        title={cartContent.hero.title}
        description={cartContent.hero.description}
      />
      <section className="page-section">
        <div className="container">
          <CartManager initialItems={cartItems} />
          <div style={{ marginTop: 18 }}>
            <p className="muted" style={{ margin: 0 }}>{cartContent.stripeHint}</p>
          </div>
        </div>
      </section>
    </>
  );
}
