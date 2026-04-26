import crypto from "node:crypto";

import { cookies } from "next/headers";

import { getAdminAccounts } from "@/lib/data";
import { AdminSession } from "@/lib/types";

const SESSION_COOKIE = "printforge_admin_session";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "printforge-local-dev-secret";

function sign(value: string) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
}

export function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function authenticateAdmin(username: string, password: string) {
  const admins = await getAdminAccounts();
  const account = admins.find((item) => item.username === username);

  if (!account) {
    return null;
  }

  const passwordHash = hashPassword(password);
  if (account.passwordHash !== passwordHash) {
    return null;
  }

  return {
    id: account.id,
    username: account.username,
    displayName: account.displayName,
    role: account.role
  } satisfies AdminSession;
}

export function createSessionValue(session: AdminSession) {
  const payload = JSON.stringify(session);
  const encoded = Buffer.from(payload, "utf8").toString("base64url");
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function verifySessionValue(value: string | undefined) {
  if (!value) {
    return null;
  }

  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) {
    return null;
  }

  if (sign(encoded) !== signature) {
    return null;
  }

  try {
    const payload = Buffer.from(encoded, "base64url").toString("utf8");
    return JSON.parse(payload) as AdminSession;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  return verifySessionValue(raw);
}

export async function setAdminSession(session: AdminSession) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionValue(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0)
  });
}
