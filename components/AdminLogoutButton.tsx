"use client";

export function AdminLogoutButton() {
  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST"
    });
    window.location.reload();
  }

  return (
    <button className="button-ghost" type="button" onClick={handleLogout}>
      Log uit
    </button>
  );
}
