import { CreateWorldForm } from "./components/create-world-form";
import { WorldCard } from "../../components/world-card";
import { memoryWorldRepository } from "../../storage/world-repository";

async function getData() {
  const worlds = await memoryWorldRepository.getAll();
  return worlds;
}

export default async function WorldsPage({}) {
  const worlds = await getData();

  return (
    <div>
      <h1>Worlds</h1>

      <div className="mb-2 flex gap-2">
        {worlds.map((world) => (
          <WorldCard world={world} />
        ))}
      </div>

      <CreateWorldForm />
    </div>
  );
}
