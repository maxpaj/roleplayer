export function DiceRollCard({ roll }: { roll: number }) {
  return (
    <div className="border border-primary rounded-xl inline-flex items-center text-xl font-extrabold justify-center px-3 py-1">
      {roll}
    </div>
  );
}
