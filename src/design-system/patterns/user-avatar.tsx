import { Avatar, AvatarFallback } from "@/design-system/primitives/avatar";
import { cn } from "@/lib/utils";

type Person = { name: string; avatarColor: string };

export function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function UserAvatar({
  user,
  size = "default",
  className,
}: {
  user: Person;
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  return (
    <Avatar size={size} className={className} title={user.name}>
      <AvatarFallback className="font-medium text-white" style={{ backgroundColor: user.avatarColor }}>
        {initials(user.name)}
      </AvatarFallback>
    </Avatar>
  );
}

/** Overlapping avatars, e.g. "people with access". */
export function AvatarStack({ users, max = 3, className }: { users: Person[]; max?: number; className?: string }) {
  const shown = users.slice(0, max);
  const extra = users.length - shown.length;
  return (
    <div className={cn("flex -space-x-2", className)}>
      {shown.map((u) => (
        <UserAvatar key={u.name} user={u} size="sm" className="ring-2 ring-surface" />
      ))}
      {extra > 0 && (
        <span className="flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium ring-2 ring-surface">
          +{extra}
        </span>
      )}
    </div>
  );
}
