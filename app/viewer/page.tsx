import { PageHero } from "@/components/PageHero";
import { StlViewer } from "@/components/StlViewer";
import { getSiteContent } from "@/lib/content";

export default async function ViewerPage() {
  const content = await getSiteContent();
  const viewer = content.viewerPage as {
    hero: { eyebrow: string; title: string; description: string };
    sectionTitle: string;
    sectionDescription: string;
  };

  return (
    <>
      <PageHero
        eyebrow={viewer.hero.eyebrow}
        title={viewer.hero.title}
        description={viewer.hero.description}
      />
      <section className="page-section">
        <div className="container">
          <div className="glass-panel" style={{ borderRadius: 28, padding: 28 }}>
            <div className="section-heading">
              <span className="eyebrow">STL Viewer</span>
              <h2 style={{ margin: 0 }}>{viewer.sectionTitle}</h2>
              <p className="muted" style={{ margin: 0 }}>{viewer.sectionDescription}</p>
            </div>
            <StlViewer />
          </div>
        </div>
      </section>
    </>
  );
}
