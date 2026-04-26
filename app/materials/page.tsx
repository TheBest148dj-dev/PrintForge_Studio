import { PageHero } from "@/components/PageHero";
import { getSiteContent } from "@/lib/content";

export default async function MaterialsPage() {
  const content = await getSiteContent();
  const materials = content.materials as {
    hero: { eyebrow: string; title: string; description: string };
    items: { name: string; use: string }[];
  };

  return (
    <>
      <PageHero
        eyebrow={materials.hero.eyebrow}
        title={materials.hero.title}
        description={materials.hero.description}
      />
      <section className="page-section">
        <div className="container">
          <div className="card-grid">
            {materials.items.map((material) => (
              <div key={material.name} className="glass-panel" style={{ borderRadius: 24, padding: 24 }}>
                <span className="pill">{material.name}</span>
                <h3>{material.name}</h3>
                <p className="muted" style={{ marginBottom: 0 }}>
                  Geschikt voor: {material.use}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
