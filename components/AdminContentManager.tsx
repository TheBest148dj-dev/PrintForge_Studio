"use client";

import { FormEvent, useState } from "react";

import type { AdminSession } from "@/lib/types";

type Props = {
  session: AdminSession;
  initialContent: unknown;
};

export function AdminContentManager({ session, initialContent }: Props) {
  const [contentValue, setContentValue] = useState(JSON.stringify(initialContent, null, 2));
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  if (session.role !== "superadmin") {
    return null;
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setNotice("");

    let parsed: unknown;
    try {
      parsed = JSON.parse(contentValue);
    } catch {
      setNotice("De JSON is ongeldig. Controleer komma's, haakjes en quotes.");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(parsed)
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        setNotice(payload.error || "Opslaan van websitecopy mislukt.");
        setSaving(false);
        return;
      }

      setNotice("Websitecopy opgeslagen. Herlaad publieke pagina's om je wijzigingen te zien.");
    } catch {
      setNotice("Er liep iets mis bij het opslaan van de websitecopy.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="glass-panel" style={{ borderRadius: 28, padding: 28 }}>
      <div className="section-heading">
        <span className="eyebrow">Website Teksten</span>
        <h2 style={{ margin: 0 }}>Pas alle publieke websitecopy aan als superadmin</h2>
        <p className="muted" style={{ margin: 0 }}>
          In dit JSON-bestand beheer je navigatie, footer, pagina-teksten, FAQ-antwoorden en uitlegblokken.
        </p>
      </div>
      <form className="form-grid" onSubmit={handleSave}>
        <label className="field">
          <span>Content JSON</span>
          <textarea
            value={contentValue}
            onChange={(event) => setContentValue(event.target.value)}
            style={{ minHeight: 520, fontFamily: "Consolas, monospace" }}
          />
        </label>
        <div className="button-row">
          <button className="button-secondary" type="submit" disabled={saving}>
            {saving ? "Opslaan..." : "Website teksten opslaan"}
          </button>
        </div>
        {notice ? <p style={{ margin: 0 }}>{notice}</p> : null}
      </form>
    </div>
  );
}
