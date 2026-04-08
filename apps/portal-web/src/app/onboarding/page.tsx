import { PortalShell } from "@/components/portal-shell";

const onboardingSections = [
  "Mission and values orientation",
  "Seva-specific SOP and expectations",
  "Current progress briefing for mid-cycle joiners",
  "POC and escalation contacts",
  "App module walkthrough",
];

export default function OnboardingPage() {
  return (
    <PortalShell title="Onboarding" subtitle="General kit + seva-specific guided setup">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-lg font-semibold">AI Briefing Assistant (V1)</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Pulls approved onboarding notes and provides contextual Q&A for new and mid-cycle joiners.
          </p>
          <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300">
            Example: “Summarize what has happened in this seva over the last 2 weeks and who I should coordinate with first.”
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-lg font-semibold">Checklist</h2>
          <ul className="mt-4 space-y-2 text-sm text-zinc-300">
            {onboardingSections.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </PortalShell>
  );
}
