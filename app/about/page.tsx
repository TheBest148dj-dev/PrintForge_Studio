import { PageHero } from "@/components/PageHero";
import { getSiteContent } from "@/lib/content";

export default async function AboutPage() {
  const content = await getSiteContent();
  const about = content.about as {
    hero: { eyebrow: string; title: string; description: string };
    cards: { title: string; description: string }[];
  };

  return (
    <>
      <PageHero
        eyebrow={about.hero.eyebrow}
        title={about.hero.title}
        description={about.hero.description}
      />
      <section className="page-section">
        <div className="container">
          <div className="split-layout">
            {about.cards.map((card) => (
              <div key={card.title} className="glass-panel" style={{ borderRadius: 28, padding: 28 }}>
                <h2 style={{ marginTop: 0 }}>{card.title}</h2>
                <p className="muted">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
