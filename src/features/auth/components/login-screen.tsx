"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Info, Loader2 } from "lucide-react";
import { FullPageLoader } from "@/design-system/patterns/full-page-loader";
import { Logo } from "@/design-system/patterns/logo";
import { UserAvatar } from "@/design-system/patterns/user-avatar";
import type { UserSummary } from "@/features/documents/types";
import { signInAction } from "../actions";

export function LoginScreen({ users }: { users: UserSummary[] }) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const signIn = (user: UserSummary) => {
    setPendingId(user.id);
    setError(null);
    startTransition(async () => {
      // Redirects on success; only returns when something went wrong.
      const res = await signInAction(user.id);
      if (res && !res.ok) {
        setError(res.error);
        setPendingId(null);
      }
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      {pendingId && <FullPageLoader message="Signing you in…" className="fixed inset-0 z-50" />}
      <div className="w-full max-w-sm animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
        <div className="mb-8 flex justify-center">
          <Logo className="text-lg" />
        </div>
        <div className="rounded-xl border bg-surface p-6">
          <h1 className="text-xl font-semibold tracking-tight">Choose a demo account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in as any user to try editing and sharing.</p>

          <ul className="mt-6 space-y-2" aria-label="Demo accounts">
            {users.map((user) => (
              <li key={user.id}>
                <button
                  type="button"
                  onClick={() => signIn(user)}
                  disabled={pendingId !== null}
                  className="group flex w-full items-center gap-3 rounded-lg border bg-surface p-3 text-left transition-colors duration-150 outline-none hover:border-primary/50 hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-60"
                >
                  <UserAvatar user={user} size="lg" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{user.name}</span>
                    <span className="block truncate text-[13px] text-muted-foreground">{user.email}</span>
                  </span>
                  {pendingId === user.id ? (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  ) : (
                    <ArrowRight className="size-4 text-subtle-foreground transition-[transform,color] duration-150 group-hover:translate-x-0.5 group-hover:text-primary" />
                  )}
                </button>
              </li>
            ))}
          </ul>
          {error && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="mt-6 flex gap-2 rounded-lg border bg-background p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            <p>Demo login, no passwords. To test sharing, sign in as Alice, share a document with Bob, then switch to Bob.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
