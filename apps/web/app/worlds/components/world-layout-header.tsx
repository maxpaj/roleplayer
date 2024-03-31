import { H2, Muted } from "@/components/ui/typography";

export function WorldLayoutHeader() {
  return (
    <>
      <div>
        <H2>Worlds</H2>
        <Muted className="mb-4">
          Create a world and customize it to your liking. Use a predefined world as a template, or customize everything
          from the start.
        </Muted>
      </div>
    </>
  );
}
