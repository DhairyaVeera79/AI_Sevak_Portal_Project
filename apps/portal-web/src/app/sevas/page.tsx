import { PortalShell } from "@/components/portal-shell";
import { getSevas } from "@/lib/api-client";

export default async function SevasPage() {
  const sevas = await getSevas();

  return (
    <PortalShell title="Seva Allocation" subtitle="AI-guided seva discovery and assignment">
      <div className="space-y-4">
        {sevas.map((seva) => (
          <article key={seva.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-400">{seva.id}</p>
                <h2 className="mt-1 text-lg font-semibold">{seva.title}</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  {seva.mode === "open" ? "Open to all" : "Approval required"}
                </p>
              </div>
              <div className="text-sm text-zinc-300">
                <p>AI Match: {seva.aiMatchScore}%</p>
                <p>Seats left: {seva.seatsLeft}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900">Join</button>
              <button className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200">
                Request Approval
              </button>
            </div>
          </article>
        ))}
      </div>
    </PortalShell>
  );
}
