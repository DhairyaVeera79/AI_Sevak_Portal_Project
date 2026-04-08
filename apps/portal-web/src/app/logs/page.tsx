import { PortalShell } from "@/components/portal-shell";
import { getImpactStories } from "@/lib/api-client";

export default async function LogsPage() {
  const stories = await getImpactStories();

  return (
    <PortalShell title="Logs & Timeline" subtitle="Daily execution records and impact storytelling feed">
      <div className="space-y-4">
        {stories.map((item, index) => (
          <article key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm uppercase tracking-wider text-zinc-400">Entry {index + 1}</p>
              <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300">{item.stage}</span>
            </div>
            <h2 className="mt-2 text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-zinc-300">{item.summary}</p>
          </article>
        ))}

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-lg font-semibold">Storytelling Output</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Moderated logs are transformed into monthly impact stories to show how seva efforts and contributions
            are helping beneficiaries with traceable evidence.
          </p>
        </div>
      </div>
    </PortalShell>
  );
}
