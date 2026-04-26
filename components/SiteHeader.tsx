import Link from "next/link";

import { getSiteContent } from "@/lib/content";

export async function SiteHeader() {
  const content = await getSiteContent();
  const navItems = (content.navigation as { href: string; label: string }[]) || [];
  const brand = String(content.siteBrand || "PrintForge Studio");
  const cartLabel = String(content.cartLabel || "Winkelmand");

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 40, padding: "18px 0" }}>
      <div className="container">
        <div
          className="glass-panel"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            borderRadius: 999,
            padding: "14px 18px"
          }}
        >
          <Link href="/" style={{ fontSize: "1.15rem", fontWeight: 700 }}>
            {brand}
          </Link>
          <nav style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="muted">
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/cart" className="button">
            {cartLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
