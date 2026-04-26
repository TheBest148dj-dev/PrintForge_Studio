import Link from "next/link";

import { getSiteContent } from "@/lib/content";

export async function SiteFooter() {
  const content = await getSiteContent();
  const footer = (content.footer as {
    eyebrow: string;
    heading: string;
    description: string;
    columnOne: { href: string; label: string }[];
    columnTwo: { href: string; label: string }[];
    bottomLeft: string;
    bottomRight: string;
  }) || {
    eyebrow: "PrintForge Studio",
    heading: "",
    description: "",
    columnOne: [],
    columnTwo: [],
    bottomLeft: "",
    bottomRight: ""
  };

  return (
    <footer className="page-section" style={{ paddingTop: 24 }}>
      <div className="container">
        <div
          className="glass-panel"
          style={{ borderRadius: 28, padding: 28, display: "grid", gap: 20 }}
        >
          <div className="split-layout">
            <div className="stack">
              <div className="eyebrow">{footer.eyebrow}</div>
              <h3 style={{ margin: 0, fontSize: "2rem" }}>{footer.heading}</h3>
              <p className="muted" style={{ margin: 0 }}>{footer.description}</p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 16
              }}
            >
              <div className="stack">
                {footer.columnOne.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="stack">
                {footer.columnTwo.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: 12,
              paddingTop: 12,
              borderTop: "1px solid var(--line)"
            }}
          >
            <span className="muted">{footer.bottomLeft}</span>
            <span className="muted">{footer.bottomRight}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
