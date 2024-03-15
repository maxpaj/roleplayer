import { Separator } from "@/components/ui/separator";
import { H3 } from "@/components/ui/typography";

export default async function BattleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <H3>Battles</H3>
      <Separator className="my-3" />

      {children}
    </div>
  );
}
