import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { getSiteContent } from "@/lib/content";
import { getProducts } from "@/lib/data";

export default async function ProductsPage() {
  const [products, content] = await Promise.all([getProducts(), getSiteContent()]);
  const pageContent = content.productsPage as { eyebrow: string; title: string; description: string };

  return (
    <>
      <PageHero eyebrow={pageContent.eyebrow} title={pageContent.title} description={pageContent.description} />
      <section className="page-section">
        <div className="container">
          <div className="card-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
