import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Signed session token: "<userId>.<hmac>". The signature stops a visitor from
 * editing the cookie to impersonate another user. Pure functions, unit tested.
 */
function signature(userId: string, secret: string): string {
  return createHmac("sha256", secret).update(userId).digest("base64url");
}

export function signSession(userId: string, secret: string): string {
  return `${userId}.${signature(userId, secret)}`;
}

/** Returns the user id when the token is authentic, otherwise null. */
export function verifySession(token: string | undefined, secret: string): string | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const userId = token.slice(0, dot);
  const given = Buffer.from(token.slice(dot + 1));
  const expected = Buffer.from(signature(userId, secret));
  return given.length === expected.length && timingSafeEqual(given, expected) ? userId : null;
}
