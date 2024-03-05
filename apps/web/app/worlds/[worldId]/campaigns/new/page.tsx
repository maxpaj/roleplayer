import { Button } from "@/components/ui/button";
import { H4, Muted } from "@/components/ui/typography";

export default function NewCampaignPage() {
  return (
    <>
      <Muted className="my-3">
        A new campaign marks the beginning of an adventure...
      </Muted>

      <H4>Characters</H4>
      <Muted>Your adventurers that will join you on the journey</Muted>
      <div className="flex gap-2 my-2">
        <Button variant="outline">Add player character</Button>
        <Button variant="outline">Invite with email</Button>
      </div>

      <Button className="mb-2 mt-5">Start campaign</Button>
      <Muted>
        Warning: Any changes made to the world after starting the campaign will
        not be automatically added.
      </Muted>
    </>
  );
}
