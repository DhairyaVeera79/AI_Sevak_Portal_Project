"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

type PortalShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

type UserRole = "C1" | "C2" | "C3" | "C4" | "ADMIN";

type NavItem = {
  href: string;
  label: string;
  minRole: UserRole;
};

const navItems = [
  { href: "/dashboard", label: "Dashboard", minRole: "C4" },
  { href: "/sevas", label: "Seva Allocation", minRole: "C4" },
  { href: "/onboarding", label: "Onboarding", minRole: "C4" },
  { href: "/logs", label: "Logs & Timeline", minRole: "C4" },
  { href: "/expenses", label: "Expenses", minRole: "C3" },
] satisfies NavItem[];

const roleWeight: Record<UserRole, number> = {
  C4: 1,
  C3: 2,
  C2: 3,
  C1: 4,
  ADMIN: 5,
};

function readCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }
  const prefixed = `${name}=`;
  const found = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(prefixed));
  if (!found) {
    return null;
  }
  return decodeURIComponent(found.slice(prefixed.length));
}

function getCurrentRole(): UserRole {
  const raw = readCookie("ai_sevak_role");
  if (raw === "C1" || raw === "C2" || raw === "C3" || raw === "ADMIN") {
    return raw;
  }
  return "C4";
}

export function PortalShell({ title, subtitle, children }: PortalShellProps) {
  const router = useRouter();
  const role = useMemo(() => getCurrentRole(), []);
  const visibleNavItems = navItems.filter(
    (item) => roleWeight[role] >= roleWeight[item.minRole],
  );

  const handleSignOut = async () => {
    const sessionToken = readCookie("ai_sevak_session");
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3002";

    if (sessionToken) {
      try {
        await fetch(`${apiBaseUrl}/v1/auth/logout`, {
          method: "POST",
          headers: {
            "x-session-token": sessionToken,
          },
        });
      } catch {
        // no-op: local session clear still proceeds
      }
    }

    document.cookie = "ai_sevak_session=; path=/; max-age=0; samesite=lax";
    document.cookie = "ai_sevak_role=; path=/; max-age=0; samesite=lax";
    document.cookie = "ai_sevak_user=; path=/; max-age=0; samesite=lax";
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 md:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">AI Sevak Portal · V1 Prototype</p>
            <h1 className="text-lg font-semibold">{title}</h1>
            {subtitle ? <p className="text-sm text-zinc-400">{subtitle}</p> : null}
            <p className="text-xs text-zinc-500">Role: {role}</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-6 md:grid-cols-[220px_1fr] md:px-10">
        <aside className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
          <nav className="space-y-1">
            {visibleNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}
