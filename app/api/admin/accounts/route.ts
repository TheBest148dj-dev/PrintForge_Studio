import { NextResponse } from "next/server";

import { getAdminSession, hashPassword } from "@/lib/auth";
import { createAdminAccount, getAdminAccounts } from "@/lib/data";
import type { AdminAccountSafe } from "@/lib/types";
import { createId } from "@/lib/utils";

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

export async function GET() {
  const session = await requireSuperadmin();
  if (!session) {
    return NextResponse.json({ error: "Niet toegelaten." }, { status: 403 });
  }

  const admins = await getAdminAccounts();
  return NextResponse.json(admins.map(toSafeAdmin));
}

export async function POST(request: Request) {
  const session = await requireSuperadmin();
  if (!session) {
    return NextResponse.json({ error: "Niet toegelaten." }, { status: 403 });
  }

  const body = await request.json();
  const username = String(body.username || "").trim();
  const displayName = String(body.displayName || "").trim();
  const role = String(body.role || "").trim();
  const password = String(body.password || "");

  if (!username || !displayName || !role || password.length < 6) {
    return NextResponse.json({ error: "Vul alle velden correct in. Wachtwoord moet minstens 6 tekens hebben." }, { status: 400 });
  }

  const existing = await getAdminAccounts();
  if (existing.some((account) => account.username === username)) {
    return NextResponse.json({ error: "Gebruikersnaam bestaat al." }, { status: 409 });
  }

  const admin = await createAdminAccount({
    id: createId("admin"),
    username,
    displayName,
    role,
    passwordHash: hashPassword(password)
  });

  return NextResponse.json({ admin: toSafeAdmin(admin) }, { status: 201 });
}
