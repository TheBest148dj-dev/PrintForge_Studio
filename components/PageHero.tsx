type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref
}: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="glass-panel page-hero-card">
          <div className="stack">
            <span className="eyebrow">{eyebrow}</span>
            <h1 style={{ margin: 0, fontSize: "clamp(2.5rem, 5vw, 4.8rem)", lineHeight: 1 }}>
              {title}
            </h1>
            <p className="muted" style={{ margin: 0, maxWidth: 760, fontSize: "1.08rem" }}>
              {description}
            </p>
            {actionLabel && actionHref ? (
              <div className="button-row">
                <a href={actionHref} className="button">
                  {actionLabel}
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
