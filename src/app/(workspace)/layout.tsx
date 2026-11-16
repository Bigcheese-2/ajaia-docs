import { FileText, FolderOpen, Users } from "lucide-react";
import { AppShell } from "@/design-system/layouts/app-shell";
import { UserMenu } from "@/features/auth/components/user-menu";
import { requireUser } from "@/features/auth/session";
import { listDocuments } from "@/features/documents/data";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const { owned, shared } = await listDocuments(user.id);

  return (
    <AppShell
      userMenu={<UserMenu user={user} />}
      nav={[
        { href: "/", label: "All documents", icon: <FolderOpen />, count: owned.length + shared.length },
        { href: "/?filter=owned", label: "Owned by me", icon: <FileText />, count: owned.length },
        { href: "/?filter=shared", label: "Shared with me", icon: <Users />, count: shared.length },
      ]}
    >
      {children}
    </AppShell>
  );
}
