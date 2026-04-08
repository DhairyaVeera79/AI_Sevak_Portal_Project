import { PortalShell } from "@/components/portal-shell";

const entries = [
  {
    id: "EXP-219",
    item: "Teaching supplies",
    amount: "₹3,450",
    status: "Under Review",
  },
  {
    id: "EXP-220",
    item: "Travel reimbursement",
    amount: "₹1,200",
    status: "Approved",
  },
];

export default function ExpensesPage() {
  return (
    <PortalShell title="Expenses" subtitle="Authorized seva expense logging and review">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-lg font-semibold">New Expense Entry</h2>
          <div className="mt-4 space-y-3 text-sm">
            <input className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2" placeholder="Expense category" />
            <input className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2" placeholder="Amount" />
            <input className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2" placeholder="Seva reference" />
            <button className="rounded-md bg-zinc-100 px-4 py-2 font-medium text-zinc-900">Submit</button>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-lg font-semibold">Recent Entries</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {entries.map((entry) => (
              <li key={entry.id} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                <p className="font-medium">{entry.item}</p>
                <p className="text-zinc-400">{entry.id} · {entry.amount}</p>
                <p className="mt-1 text-zinc-300">Status: {entry.status}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PortalShell>
  );
}
