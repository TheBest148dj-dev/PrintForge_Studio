import { NextResponse } from "next/server";

import { getAdminSession, hashPassword } from "@/lib/auth";
import { deleteAdminAccount, getAdminAccounts, updateAdminAccount } from "@/lib/data";
import type { AdminAccountSafe } from "@/lib/types";

function toSafeAdmin(account: {
  id: string;
  username: string;
  displayName: string;
  role: string;
}): AdminAccountSafe {
  return {
    id: account.id,
    username: account.username,
    displayName: account.displayName,
    role: account.role
  };
}

async function requireSuperadmin() {
  const session = await getAdminSession();
  if (!session || session.role !== "superadmin") {
    return null;
  }
  return session;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSuperadmin();
  if (!session) {
    return NextResponse.json({ error: "Niet toegelaten." }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const updates: { role?: string; passwordHash?: string } = {};

  if (body.role) {
    updates.role = String(body.role);
  }

  if (body.password) {
    const password = String(body.password);
    if (password.length < 6) {
      return NextResponse.json({ error: "Wachtwoord moet minstens 6 tekens hebben." }, { status: 400 });
    }
    updates.passwordHash = hashPassword(password);
  }

  const updated = await updateAdminAccount(id, updates);
  if (!updated) {
    return NextResponse.json({ error: "Admin niet gevonden." }, { status: 404 });
  }

  return NextResponse.json({ admin: toSafeAdmin(updated) });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSuperadmin();
  if (!session) {
    return NextResponse.json({ error: "Niet toegelaten." }, { status: 403 });
  }

  const { id } = await params;
  if (session.id === id) {
    return NextResponse.json({ error: "Je kunt je eigen account niet verwijderen." }, { status: 400 });
  }

  const admins = await getAdminAccounts();
  const target = admins.find((admin) => admin.id === id);
  if (!target) {
    return NextResponse.json({ error: "Admin niet gevonden." }, { status: 404 });
  }

  await deleteAdminAccount(id);
  return NextResponse.json({ ok: true });
}
