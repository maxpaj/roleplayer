import { Separator } from "@/components/ui/separator";
import { H3, Muted } from "@/components/ui/typography";
import { getWorldData } from "../actions";
import { CreateClassForm } from "./components/create-class-form";
import { ClassCard } from "@/components/class-card";

export default async function ClassesPage({ params }: { params: { worldId: string } }) {
  const { worldId: id } = params;
  const worldId = id;
  const worldData = await getWorldData(worldId);

  if (!worldData) {
    return <>World not found!</>;
  }

  return (
    <div>
      <H3>Classes</H3>
      <Separator className="my-3" />

      {worldData.classes.length === 0 && <Muted className="my-2">No classes added yet</Muted>}

      <CreateClassForm worldId={worldId} />

      <div className="my-2 flex flex-wrap gap-2">
        {worldData.classes.map((clazz) => (
          <ClassCard key={clazz.id} worldId={worldId} clazz={clazz} />
        ))}
      </div>
    </div>
  );
}
