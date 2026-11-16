import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { UserSummary } from "@/features/documents/types";
import { signSession, verifySession } from "./session-token";
import { findUserById } from "./users";

/**
 * Demo auth: one-click seeded accounts, no passwords (the brief allows simulated
 * users, and it keeps sharing quick to review). The session cookie is
 * HMAC-signed and httpOnly, so it can't be forged or read by scripts.
 * See ARCHITECTURE.md for the tradeoff.
 */
export const SESSION_COOKIE = "ajaia_session";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set (32+ characters) in production.");
  }
  return "dev-only-insecure-session-secret-change-me";
}

/** Signed-in user, or null. Cached for the duration of a request. */
export const getCurrentUser = cache(async (): Promise<UserSummary | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const userId = verifySession(token, sessionSecret());
  return userId ? findUserById(userId) : null;
});

/** Signed-in user; redirects to /login when there isn't a valid session. */
export async function requireUser(): Promise<UserSummary> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function startSession(userId: string) {
  (await cookies()).set(SESSION_COOKIE, signSession(userId, sessionSecret()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: THIRTY_DAYS,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}
