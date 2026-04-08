"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3002";

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!userId || !password) {
      setError("Please enter both Get-Involved ID and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ giId: userId, password }),
      });

      if (!response.ok) {
        setError("Login failed. Please verify credentials.");
        return;
      }

      const payload = (await response.json()) as {
        giId: string;
        role: string;
        sessionToken: string;
        expiresInSeconds: number;
      };

      document.cookie = `ai_sevak_session=${encodeURIComponent(payload.sessionToken)}; path=/; max-age=${payload.expiresInSeconds}; samesite=lax`;
      document.cookie = `ai_sevak_role=${encodeURIComponent(payload.role)}; path=/; max-age=${payload.expiresInSeconds}; samesite=lax`;
      document.cookie = `ai_sevak_user=${encodeURIComponent(payload.giId)}; path=/; max-age=${payload.expiresInSeconds}; samesite=lax`;

      router.push("/dashboard");
    } catch {
      setError("Login failed. API unavailable or request error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-12 text-zinc-100">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">V1 Access</p>
        <h1 className="mt-3 text-2xl font-semibold">Sign in with Get-Involved ID</h1>
        <p className="mt-2 text-sm text-zinc-400">
          V1 prototype keeps GI ID + password as the primary authentication path.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm text-zinc-300" htmlFor="userId">
              Get-Involved ID
            </label>
            <input
              id="userId"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none ring-0 focus:border-zinc-500"
              placeholder="GI-XXXX"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-zinc-300" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none ring-0 focus:border-zinc-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-white"
          >
            {isSubmitting ? "Signing in..." : "Continue"}
          </button>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}
        </form>
      </div>
    </main>
  );
}
