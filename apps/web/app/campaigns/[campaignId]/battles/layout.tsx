import { Divider } from "@/components/ui/divider";
import { H3 } from "@/components/ui/typography";

export default async function BattleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <H3>Battles</H3>
      <Divider className="my-3" />

      {children}
    </div>
  );
}
