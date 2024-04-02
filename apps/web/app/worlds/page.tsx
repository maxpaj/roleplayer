import { CreateWorldForm } from "./components/create-world-form";
import { WorldCard } from "../../components/world-card";
import { WorldService } from "services/world-service";
import { DEFAULT_USER_ID } from "@/db/data";
import { UserRecord } from "@/db/schema/users";
import { WorldLayoutHeader } from "./components/world-layout-header";

export const dynamic = "force-dynamic";

async function getData(userId: UserRecord["id"] = DEFAULT_USER_ID) {
  const worlds = await new WorldService().getAll(userId);
  return worlds;
}

export default async function WorldsPage({ params }: { params: {} }) {
  const worlds = await getData();

  return (
    <div>
      <WorldLayoutHeader />
      <CreateWorldForm />

      <div className="my-3 flex flex-wrap gap-2">
        {worlds.map((world) => (
          <WorldCard key={world.id} world={world} />
        ))}
      </div>
    </div>
  );
}
