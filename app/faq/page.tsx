import { PageHero } from "@/components/PageHero";
import { getSiteContent } from "@/lib/content";

export default async function FaqPage() {
  const content = await getSiteContent();
  const faq = content.faq as {
    hero: { eyebrow: string; title: string; description: string };
    items: { question: string; answer: string }[];
  };

  return (
    <>
      <PageHero
        eyebrow={faq.hero.eyebrow}
        title={faq.hero.title}
        description={faq.hero.description}
      />
      <section className="page-section">
        <div className="container">
          <div className="stack">
            {faq.items.map((item) => (
              <div key={item.question} className="glass-panel" style={{ borderRadius: 24, padding: 24 }}>
                <h3 style={{ marginTop: 0 }}>{item.question}</h3>
                <p className="muted" style={{ marginBottom: 0 }}>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
