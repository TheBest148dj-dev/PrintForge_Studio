"use client";

import { FormEvent, useState } from "react";

export function AdminLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: formData.get("username"),
        password: formData.get("password")
      })
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(payload?.error || "Login mislukt.");
      setLoading(false);
      return;
    }

    window.location.reload();
  }

  return (
    <div className="glass-panel" style={{ borderRadius: 28, padding: 28, maxWidth: 620 }}>
      <div className="section-heading">
        <span className="eyebrow">Admin Login</span>
        <h2 style={{ margin: 0 }}>Beveiligde toegang tot het beheerpaneel</h2>
        <p className="muted" style={{ margin: 0 }}>
          Log in met een adminaccount om producten, prijzen, uploads en berichten te beheren.
        </p>
      </div>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="field">
          <span>Gebruikersnaam</span>
          <input name="username" required placeholder="owner" />
        </label>
        <label className="field">
          <span>Wachtwoord</span>
          <input name="password" type="password" required placeholder="Voer wachtwoord in" />
        </label>
        <div className="button-row">
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Inloggen..." : "Log in"}
          </button>
        </div>
        {error ? (
          <p style={{ margin: 0, color: "#a72c17" }}>{error}</p>
        ) : null}
      </form>
    </div>
  );
}
