"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Info, Loader2 } from "lucide-react";
import { Logo } from "@/design-system/patterns/logo";
import { UserAvatar } from "@/design-system/patterns/user-avatar";
import type { UserSummary } from "@/features/documents/types";

export function LoginScreen({ users }: { users: UserSummary[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const signIn = (user: UserSummary) => {
    setPendingId(user.id);
    // UI phase: navigates only. Integration phase sets the session cookie first.
    router.push("/");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo className="text-lg" />
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h1 className="text-xl font-semibold tracking-tight">Choose a demo account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in as any user to try editing and sharing.</p>

          <ul className="mt-6 space-y-2">
            {users.map((user) => (
              <li key={user.id}>
                <button
                  type="button"
                  onClick={() => signIn(user)}
                  disabled={pendingId !== null}
                  className="group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors outline-none hover:border-primary/40 hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
                >
                  <UserAvatar user={user} size="lg" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{user.name}</span>
                    <span className="block truncate text-sm text-muted-foreground">{user.email}</span>
                  </span>
                  {pendingId === user.id ? (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  ) : (
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            <p>Demo login, no passwords. To test sharing, sign in as Alice, share a document with Bob, then switch to Bob.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
