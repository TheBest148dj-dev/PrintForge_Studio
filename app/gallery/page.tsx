import { PageHero } from "@/components/PageHero";
import { getSiteContent } from "@/lib/content";

export default async function GalleryPage() {
  const content = await getSiteContent();
  const gallery = content.gallery as {
    hero: { eyebrow: string; title: string; description: string };
    items: string[];
  };

  return (
    <>
      <PageHero
        eyebrow={gallery.hero.eyebrow}
        title={gallery.hero.title}
        description={gallery.hero.description}
      />
      <section className="page-section">
        <div className="container">
          <div className="card-grid">
            {gallery.items.map((item, index) => (
              <div
                key={item}
                className="glass-panel"
                style={{
                  borderRadius: 24,
                  padding: 24,
                  minHeight: 280,
                  background: `linear-gradient(180deg, rgba(255,255,255,0.2), rgba(0,0,0,0.15)), url('https://images.unsplash.com/photo-${1500000000000 + index * 1000000}?auto=format&fit=crop&w=1200&q=80') center/cover`
                }}
              >
                <div style={{ alignSelf: "end", display: "grid", height: "100%" }}>
                  <strong style={{ alignSelf: "end", color: "white", fontSize: "1.4rem" }}>{item}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
