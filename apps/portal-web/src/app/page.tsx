import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-20 text-zinc-100 md:px-10">
      <div className="mx-auto w-full max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8 md:p-12">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">SRLC Internal Platform</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">AI Sevak Portal · V1 Web Prototype</h1>
        <p className="mt-5 max-w-3xl text-zinc-300">
          Working prototype for registration, seva allocation, onboarding, logs, and expense flows.
          This release is web-first and optimized for MVP demonstration.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full border border-zinc-700 px-4 py-2">Auth: Get-Involved ID + Password (V1)</span>
          <span className="rounded-full border border-zinc-700 px-4 py-2">Role-aware Navigation</span>
          <span className="rounded-full border border-zinc-700 px-4 py-2">Impact Storytelling Ready</span>
        </div>

        <div className="mt-10">
          <Link
            href="/login"
            className="inline-flex rounded-lg bg-zinc-100 px-5 py-3 text-sm font-semibold text-zinc-900 hover:bg-white"
          >
            Enter Prototype
          </Link>
        </div>
      </div>
    </main>
  );
}
