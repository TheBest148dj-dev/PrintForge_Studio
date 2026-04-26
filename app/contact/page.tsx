import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageHero";
import { getSiteContent } from "@/lib/content";

export default async function ContactPage() {
  const content = await getSiteContent();
  const contact = content.contact as {
    hero: { eyebrow: string; title: string; description: string };
    formTitle: string;
    detailsTitle: string;
    details: string[];
  };

  return (
    <>
      <PageHero
        eyebrow={contact.hero.eyebrow}
        title={contact.hero.title}
        description={contact.hero.description}
      />
      <section className="page-section">
        <div className="container">
          <div className="split-layout">
            <div className="glass-panel" style={{ borderRadius: 28, padding: 28 }}>
              <h2 style={{ marginTop: 0 }}>{contact.formTitle}</h2>
              <ContactForm />
            </div>
            <div className="glass-panel" style={{ borderRadius: 28, padding: 28 }}>
              <h2 style={{ marginTop: 0 }}>{contact.detailsTitle}</h2>
              <div className="stack">
                {contact.details.map((detail) => (
                  <div key={detail} className="pill">
                    {detail}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
