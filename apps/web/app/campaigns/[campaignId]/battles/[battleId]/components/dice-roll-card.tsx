export function DiceRollCard({ roll }: { roll: number }) {
  return <div className="border-primary inline-flex items-center justify-center rounded-xl border px-3 py-1 text-xl font-extrabold">{roll}</div>;
}
