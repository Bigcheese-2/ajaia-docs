import { describe, expect, it } from "vitest";
import { signSession, verifySession } from "@/features/auth/session-token";

const SECRET = "test-secret-that-is-at-least-32-chars";

describe("session token", () => {
  it("round-trips a user id", () => {
    expect(verifySession(signSession("user_123", SECRET), SECRET)).toBe("user_123");
  });

  it("rejects a token whose user id was swapped (impersonation)", () => {
    const signature = signSession("alice", SECRET).split(".")[1];
    expect(verifySession(`bob.${signature}`, SECRET)).toBeNull();
  });

  it("rejects a token signed with a different secret", () => {
    expect(verifySession(signSession("alice", "another-secret-also-32-characters!"), SECRET)).toBeNull();
  });

  it.each([undefined, "", "no-dot", ".sig-only", "alice.", "alice.not-the-signature"])(
    "rejects malformed token %j",
    (token) => {
      expect(verifySession(token, SECRET)).toBeNull();
    },
  );
});
