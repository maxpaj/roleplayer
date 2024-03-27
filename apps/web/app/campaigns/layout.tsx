import { H2, Muted } from "@/components/ui/typography";

export default function CampaignLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container space-y-6 pb-16 md:block md:p-10">
      <div>
        <H2>Campaigns</H2>
        <Muted className="mb-4">
          Create a new campaign from a selection of worlds, or continue the adventure from where you left off!
        </Muted>
      </div>
      {children}
    </div>
  );
}
