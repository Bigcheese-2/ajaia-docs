"use server";

import { redirect } from "next/navigation";
import { endSession, startSession } from "./session";
import { findUserById } from "./users";

export async function signInAction(userId: string): Promise<{ ok: false; error: string } | void> {
  const user = await findUserById(userId);
  if (!user) return { ok: false, error: "That account doesn't exist. Refresh and try again." };
  await startSession(user.id);
  redirect("/");
}

export async function signOutAction() {
  await endSession();
  redirect("/login");
}
