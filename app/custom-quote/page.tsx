import { ContactForm } from "@/components/ContactForm";
import { FaqPopupList } from "@/components/FaqPopupList";
import { PageHero } from "@/components/PageHero";
import { StlViewer } from "@/components/StlViewer";
import { getSiteContent } from "@/lib/content";

export default async function CustomQuotePage() {
  const content = await getSiteContent();
  const pageContent = content.customQuote as {
    hero: { eyebrow: string; title: string; description: string };
    intakeTitle: string;
    intakeDescription: string;
    faqTitle: string;
    faqDescription: string;
    viewerTitle: string;
    viewerDescription: string;
    faqItems: { question: string; answer: string }[];
  };

  return (
    <>
      <PageHero
        eyebrow={pageContent.hero.eyebrow}
        title={pageContent.hero.title}
        description={pageContent.hero.description}
      />
      <section className="page-section">
        <div className="container">
          <div className="split-layout">
            <div className="glass-panel" style={{ borderRadius: 28, padding: 28 }}>
              <h2 style={{ marginTop: 0 }}>{pageContent.intakeTitle}</h2>
              <p className="muted">{pageContent.intakeDescription}</p>
              <ContactForm />
            </div>
            <div className="glass-panel" style={{ borderRadius: 28, padding: 28 }}>
              <h2 style={{ marginTop: 0 }}>{pageContent.faqTitle}</h2>
              <p className="muted">{pageContent.faqDescription}</p>
              <FaqPopupList items={pageContent.faqItems} />
            </div>
          </div>
          <div className="glass-panel" style={{ borderRadius: 28, padding: 28, marginTop: 28 }}>
            <div className="section-heading">
              <span className="eyebrow">3D Viewer</span>
              <h2 style={{ margin: 0 }}>{pageContent.viewerTitle}</h2>
              <p className="muted" style={{ margin: 0 }}>{pageContent.viewerDescription}</p>
            </div>
            <StlViewer />
          </div>
        </div>
      </section>
    </>
  );
}
