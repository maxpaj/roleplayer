import { CreateWorldForm } from "./components/create-world-form";
import { WorldCard } from "../../components/world-card";
import { H2, Muted } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import { WorldService } from "services/world-service";

async function getData(userId: number = 0) {
  const worlds = await new WorldService().getAll(userId);
  return worlds;
}

export default async function WorldsPage({}) {
  const worlds = await getData();

  return (
    <div>
      <H2>Worlds</H2>
      <Muted className="mb-4">
        Create a world and customize it to your liking. Use a predefined world
        as a template, or customize everything from the start.
      </Muted>

      <Separator className="my-3" />

      <CreateWorldForm />

      <div className="my-3 flex gap-2">
        {worlds.map((world) => (
          <WorldCard key={world.id} world={world} />
        ))}
      </div>
    </div>
  );
}
