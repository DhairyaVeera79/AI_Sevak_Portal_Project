export default function Home() {
  const pillars = [
    {
      title: "1) Problem We Are Solving",
      points: [
        "Volunteer onboarding and seva operations are fragmented across manual channels.",
        "Seva leaders spend significant time repeating instructions and chasing updates.",
        "Operational visibility, governance, and impact reporting are inconsistent at scale.",
      ],
    },
    {
      title: "2) Proposed Solution",
      points: [
        "A unified AI Sevak Portal for registration, allocation, onboarding, collaboration, logs, and expenses.",
        "AI-assisted matching and onboarding with human-led approvals and moderation.",
        "Impact storytelling pipeline from verified logs to leadership and supporter communication.",
      ],
    },
    {
      title: "3) Who Benefits Inside SRLC",
      points: [
        "C4 Sevaks: clearer joining and execution journey.",
        "C3/C2 teams: lower coordination overhead and stronger execution control.",
        "C1 leadership: reliable portfolio-level visibility and reporting confidence.",
      ],
    },
    {
      title: "4) Success by September 2026",
      points: [
        "Core build and pilot-ready scope completed by 31 August 2026.",
        "Offering-ready showcase by 26 September 2026.",
        "Measured gains in onboarding speed, match quality, and log/story consistency.",
      ],
    },
    {
      title: "5) Key Dependencies",
      points: [
        "Role clarity across C1/C2/C3/C4 and moderation governance.",
        "Approved onboarding and knowledge content for AI-assisted modules.",
        "Reliable data discipline: profile completion, logs, approvals, and review cadence.",
      ],
    },
  ];

  const timeline = [
    { month: "April 2026", work: "PRD finalization, role matrix, V1 acceptance criteria" },
    { month: "May 2026", work: "Registration, seva catalog, role-aware dashboard baseline" },
    { month: "June 2026", work: "Messaging, logs timeline, moderation workflows" },
    { month: "July 2026", work: "AI guidance, onboarding assistant, pilot stabilization" },
    { month: "August 2026", work: "Hardening, reporting, impact-story outputs, build freeze" },
    { month: "September 2026", work: "UAT polish and offering-ready presentation" },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10 md:py-20">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">SRMD · SRLC</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">AI Sevak Portal</h1>
        <p className="mt-4 max-w-3xl text-lg text-zinc-300 md:text-xl">
          A unified volunteer operations platform to improve seva coordination, reduce leadership overhead,
          and build trustworthy impact visibility from real execution logs.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full border border-zinc-700 px-4 py-2">Build Deadline: 31 August 2026</span>
          <span className="rounded-full border border-zinc-700 px-4 py-2">Offering: 26 September 2026</span>
          <span className="rounded-full border border-zinc-700 px-4 py-2">Web-first MVP / V1</span>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-6 pb-8 md:grid-cols-2 md:px-10">
        {pillars.map((pillar) => (
          <article key={pillar.title} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-xl font-semibold text-zinc-100">{pillar.title}</h2>
            <ul className="mt-4 space-y-2 text-zinc-300">
              {pillar.points.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-zinc-400" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-12 md:px-10 md:py-16">
        <h2 className="text-2xl font-semibold md:text-3xl">Roadmap Snapshot</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {timeline.map((item) => (
            <div key={item.month} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="text-sm font-medium uppercase tracking-wider text-zinc-400">{item.month}</p>
              <p className="mt-2 text-zinc-200">{item.work}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 md:px-10 md:pb-20">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 md:p-8">
          <h2 className="text-2xl font-semibold">Impact Storytelling Layer</h2>
          <p className="mt-3 max-w-4xl text-zinc-300">
            Verified logs from volunteers and leaders are converted into moderated impact stories that show how
            seva activities translate into meaningful outcomes. This gives leadership a credible reporting system
            and gives supporters and beneficiaries transparent, dignified visibility into ongoing progress.
          </p>
        </div>
      </section>
    </main>
  );
}
