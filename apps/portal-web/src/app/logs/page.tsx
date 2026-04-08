import { PortalShell } from "@/components/portal-shell";
import { getLogs, updateLogStage } from "@/lib/api-client";
import { revalidatePath } from "next/cache";

export default async function LogsPage() {
  const stories = await getLogs();
  const reviewedStories = stories.filter((item) => item.stage === "reviewed");
  const moderationStories = stories.filter((item) => item.stage !== "reviewed");

  async function handleStageUpdate(formData: FormData) {
    "use server";

    const id = formData.get("id")?.toString();
    const stage = formData.get("stage")?.toString();

    if (!id || (stage !== "draft" && stage !== "moderation" && stage !== "reviewed")) {
      return;
    }

    await updateLogStage(id, stage);
    revalidatePath("/logs");
  }

  return (
    <PortalShell title="Logs & Timeline" subtitle="Daily execution records and impact storytelling feed">
      <div className="space-y-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-lg font-semibold">Moderation Queue</h2>
          <ul className="mt-4 space-y-3">
            {moderationStories.map((item) => (
              <li key={item.id} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm uppercase tracking-wider text-zinc-400">{item.sevaId}</p>
                  <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300">{item.stage}</span>
                </div>
                <h3 className="mt-2 text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-300">{item.summary}</p>
                <form action={handleStageUpdate} className="mt-4 flex flex-wrap gap-2">
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    name="stage"
                    value="moderation"
                    className="rounded-md border border-zinc-700 px-3 py-1 text-xs text-zinc-200 hover:bg-zinc-800"
                  >
                    Send to Moderation
                  </button>
                  <button
                    type="submit"
                    name="stage"
                    value="reviewed"
                    className="rounded-md bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-900"
                  >
                    Mark Reviewed
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>

        {reviewedStories.map((item, index) => (
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
