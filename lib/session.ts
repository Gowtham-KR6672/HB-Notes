import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { env } from "@/lib/env";

export const SESSION_COOKIE = "hb-notes-session";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
};

function parseExpirationToSeconds(input: string) {
  const value = input.trim();
  const match = value.match(/^(\d+)([dhm])$/i);

  if (!match) {
    return 60 * 60 * 24 * 7;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  if (unit === "m") {
    return amount * 60;
  }

  if (unit === "h") {
    return amount * 60 * 60;
  }

  return amount * 60 * 60 * 24;
}

export const sessionMaxAge = parseExpirationToSeconds(env.JWT_EXPIRES_IN);

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${sessionMaxAge}s`)
    .sign(secret);
}

export async function verifySession(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as SessionPayload;
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAge
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

export async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifySession(token);
  } catch {
    return null;
  }
}
