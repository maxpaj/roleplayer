import { H2, Muted } from "@/components/ui/typography";

export default function WorldLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container space-y-6 pb-16 md:block md:p-10">
      <div>
        <H2>Worlds</H2>
        <Muted className="mb-4">
          Create a world and customize it to your liking. Use a predefined world as a template, or customize everything
          from the start.
        </Muted>
      </div>

      {children}
    </div>
  );
}
