import { H2, Muted } from "@/components/ui/typography";

export function CampaignLayoutHeader() {
  return (
    <>
      <H2>Campaigns</H2>
      <Muted className="mb-4">
        Create a new campaign from a selection of worlds, or continue the adventure from where you left off!
      </Muted>
    </>
  );
}
