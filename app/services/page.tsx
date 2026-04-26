import { PageHero } from "@/components/PageHero";
import { getSiteContent } from "@/lib/content";

export default async function ServicesPage() {
  const content = await getSiteContent();
  const services = content.services as {
    hero: { eyebrow: string; title: string; description: string };
    cards: { title: string; description: string }[];
  };

  return (
    <>
      <PageHero
        eyebrow={services.hero.eyebrow}
        title={services.hero.title}
        description={services.hero.description}
      />
      <section className="page-section">
        <div className="container">
          <div className="card-grid">
            {services.cards.map((service) => (
              <div key={service.title} className="glass-panel" style={{ borderRadius: 24, padding: 26 }}>
                <h3 style={{ marginTop: 0 }}>{service.title}</h3>
                <p className="muted" style={{ marginBottom: 0 }}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
