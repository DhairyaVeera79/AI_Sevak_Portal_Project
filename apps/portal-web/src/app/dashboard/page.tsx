import { PortalShell } from "@/components/portal-shell";
import { getDashboardMetrics } from "@/lib/api-client";

export default async function DashboardPage() {
  const data = await getDashboardMetrics();

  const metrics = [
    { label: "Active Sevas", value: String(data.activeSevas) },
    { label: "Active Volunteers", value: String(data.activeVolunteers) },
    { label: "Pending Approvals", value: String(data.pendingApprovals) },
    { label: "Onboarding Completion", value: data.onboardingCompletion },
  ];
  return (
    <PortalShell title="Dashboard" subtitle="Snapshot of current seva operations">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="text-sm text-zinc-400">{metric.label}</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-100">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-lg font-semibold">Today’s Focus</h2>
          <ul className="mt-4 space-y-2 text-sm text-zinc-300">
            <li>• Review 14 pending seva allocation approvals.</li>
            <li>• Publish weekly impact summary from verified logs.</li>
            <li>• Complete onboarding for 9 newly registered volunteers.</li>
          </ul>
        </div>
      </div>
    </PortalShell>
  );
}
