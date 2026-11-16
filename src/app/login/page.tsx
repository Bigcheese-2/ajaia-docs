import type { Metadata } from "next";
import { LoginScreen } from "@/features/auth/components/login-screen";
import { listUsers } from "@/features/documents/data";

export const metadata: Metadata = { title: "Sign in · Ajaia Docs" };

export default async function LoginPage() {
  const users = await listUsers();
  return <LoginScreen users={users} />;
}
