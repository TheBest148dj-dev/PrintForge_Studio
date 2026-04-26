import { NextResponse } from "next/server";

import { authenticateAdmin, setAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const username = String(body.username || "").trim();
  const password = String(body.password || "");

  if (!username || !password) {
    return NextResponse.json({ error: "Gebruikersnaam en wachtwoord zijn verplicht." }, { status: 400 });
  }

  const session = await authenticateAdmin(username, password);
  if (!session) {
    return NextResponse.json({ error: "Ongeldige login." }, { status: 401 });
  }

  await setAdminSession(session);
  return NextResponse.json({ ok: true, session });
}
