"use client";

import { FormEvent, useState } from "react";

import type { AdminAccountSafe, AdminSession } from "@/lib/types";

type Props = {
  session: AdminSession;
  initialAdmins: AdminAccountSafe[];
};

type Notice = {
  type: "success" | "error";
  text: string;
} | null;

export function AdminAccountManager({ session, initialAdmins }: Props) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [notice, setNotice] = useState<Notice>(null);
  const [loading, setLoading] = useState(false);

  if (session.role !== "superadmin") {
    return (
      <div className="glass-panel" style={{ borderRadius: 28, padding: 28 }}>
        <div className="section-heading">
          <span className="eyebrow">Admin Accounts</span>
          <h2 style={{ margin: 0 }}>Alleen zichtbaar voor superadmins</h2>
        </div>
        <p className="muted" style={{ margin: 0 }}>
          Je bent ingelogd als beheerder, maar accountbeheer is beperkt tot superadmin-accounts.
        </p>
      </div>
    );
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setNotice(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formData.get("username"),
          displayName: formData.get("displayName"),
          role: formData.get("role"),
          password: formData.get("password")
        })
      });

      const payload = (await response.json()) as { error?: string; admin?: AdminAccountSafe };

      if (!response.ok || !payload.admin) {
        setNotice({ type: "error", text: payload.error || "Admin aanmaken mislukt." });
        return;
      }

      setAdmins((current) => [payload.admin, ...current]);
      form.reset();
      setNotice({ type: "success", text: "Nieuw adminaccount aangemaakt." });
    } catch {
      setNotice({ type: "error", text: "Er liep iets mis bij het aanmaken van de admin." });
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordReset(id: string) {
    const password = window.prompt("Nieuw wachtwoord voor deze admin:");
    if (!password) {
      return;
    }

    const response = await fetch(`/api/admin/accounts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    });

    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setNotice({ type: "error", text: payload.error || "Wachtwoord wijzigen mislukt." });
      return;
    }

    setNotice({ type: "success", text: "Wachtwoord aangepast." });
  }

  async function handleRoleChange(id: string, role: string) {
    const response = await fetch(`/api/admin/accounts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ role })
    });

    const payload = (await response.json()) as { error?: string; admin?: AdminAccountSafe };
    if (!response.ok || !payload.admin) {
      setNotice({ type: "error", text: payload.error || "Rol wijzigen mislukt." });
      return;
    }

    setAdmins((current) => current.map((admin) => (admin.id === id ? payload.admin! : admin)));
    setNotice({ type: "success", text: "Rol bijgewerkt." });
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Wil je deze admin echt verwijderen?")) {
      return;
    }

    const response = await fetch(`/api/admin/accounts/${id}`, {
      method: "DELETE"
    });

    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setNotice({ type: "error", text: payload.error || "Verwijderen mislukt." });
      return;
    }

    setAdmins((current) => current.filter((admin) => admin.id !== id));
    setNotice({ type: "success", text: "Admin verwijderd." });
  }

  return (
    <div className="stack" style={{ gap: 28 }}>
      <div className="glass-panel" style={{ borderRadius: 28, padding: 28 }}>
        <div className="section-heading">
          <span className="eyebrow">Nieuwe Admin</span>
          <h2 style={{ margin: 0 }}>Maak extra adminaccounts aan vanuit het dashboard</h2>
        </div>
        <form className="form-grid" onSubmit={handleCreate}>
          <div className="form-grid two">
            <label className="field">
              <span>Gebruikersnaam</span>
              <input name="username" required placeholder="nieuwe-admin" />
            </label>
            <label className="field">
              <span>Weergavenaam</span>
              <input name="displayName" required placeholder="Nieuwe Admin" />
            </label>
          </div>
          <div className="form-grid two">
            <label className="field">
              <span>Rol</span>
              <select name="role" defaultValue="catalog-manager">
                <option value="catalog-manager">catalog-manager</option>
                <option value="support-admin">support-admin</option>
                <option value="superadmin">superadmin</option>
              </select>
            </label>
            <label className="field">
              <span>Tijdelijk wachtwoord</span>
              <input name="password" type="password" required placeholder="Sterk wachtwoord" />
            </label>
          </div>
          <div className="button-row">
            <button className="button" type="submit" disabled={loading}>
              {loading ? "Aanmaken..." : "Admin aanmaken"}
            </button>
          </div>
          {notice ? (
            <p style={{ margin: 0, color: notice.type === "error" ? "#a72c17" : "#145c47" }}>{notice.text}</p>
          ) : null}
        </form>
      </div>

      <div className="glass-panel" style={{ borderRadius: 28, padding: 28 }}>
        <div className="section-heading">
          <span className="eyebrow">Bestaande Accounts</span>
          <h2 style={{ margin: 0 }}>Beheer rollen en wachtwoorden</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Gebruikersnaam</th>
                <th>Naam</th>
                <th>Rol</th>
                <th>Acties</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.username}</td>
                  <td>{admin.displayName}</td>
                  <td>
                    <select
                      value={admin.role}
                      onChange={(event) => handleRoleChange(admin.id, event.target.value)}
                      disabled={admin.id === session.id}
                    >
                      <option value="catalog-manager">catalog-manager</option>
                      <option value="support-admin">support-admin</option>
                      <option value="superadmin">superadmin</option>
                    </select>
                  </td>
                  <td>
                    <div className="button-row">
                      <button className="button-ghost" type="button" onClick={() => handlePasswordReset(admin.id)}>
                        Wachtwoord
                      </button>
                      <button
                        className="button-ghost"
                        type="button"
                        onClick={() => handleDelete(admin.id)}
                        disabled={admin.id === session.id}
                      >
                        Verwijder
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
