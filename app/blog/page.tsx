import { PageHero } from "@/components/PageHero";
import { getSiteContent } from "@/lib/content";

export default async function BlogPage() {
  const content = await getSiteContent();
  const blog = content.blog as {
    hero: { eyebrow: string; title: string; description: string };
    tagLabel: string;
    posts: { title: string; description: string }[];
  };

  return (
    <>
      <PageHero
        eyebrow={blog.hero.eyebrow}
        title={blog.hero.title}
        description={blog.hero.description}
      />
      <section className="page-section">
        <div className="container">
          <div className="card-grid">
            {blog.posts.map((post) => (
              <div key={post.title} className="glass-panel" style={{ borderRadius: 24, padding: 24 }}>
                <span className="pill">{blog.tagLabel}</span>
                <h3>{post.title}</h3>
                <p className="muted" style={{ marginBottom: 0 }}>{post.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
