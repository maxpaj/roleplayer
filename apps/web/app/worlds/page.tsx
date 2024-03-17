import { CreateWorldForm } from "./components/create-world-form";
import { WorldCard } from "../../components/world-card";
import { H2, Muted } from "@/components/ui/typography";
import { WorldService } from "services/world-service";
import { DEFAULT_USER_ID } from "@/db/data";
import { UserRecord } from "@/db/schema/users";

async function getData(userId: UserRecord["id"] = DEFAULT_USER_ID) {
  const worlds = await new WorldService().getAll(userId);
  return worlds;
}

export default async function WorldsPage({ params }: { params: {} }) {
  const worlds = await getData();

  return (
    <div>
      <H2>Worlds</H2>
      <Muted className="mb-4">
        Create a world and customize it to your liking. Use a predefined world as a template, or customize everything from the start.
      </Muted>

      <CreateWorldForm />

      <div className="my-3 flex gap-2">
        {worlds.map((world) => (
          <WorldCard key={world.id} world={world} />
        ))}
      </div>
    </div>
  );
}
