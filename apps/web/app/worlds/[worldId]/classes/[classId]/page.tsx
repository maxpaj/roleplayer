import { H3 } from "@/components/ui/typography";
import { getWorldData } from "../../actions";
import { Separator } from "@/components/ui/separator";

export default async function ClassPage({ params }: { params: { worldId: string; classId: string } }) {
  const { worldId: id, classId } = params;
  const worldId = id;
  const worldData = await getWorldData(worldId);

  if (!worldData) {
    return <>World not found!</>;
  }

  const clazz = worldData.classes.find((c) => c.id === classId);

  return (
    <div>
      <H3>{clazz?.name}</H3>
      <Separator className="my-3" />
    </div>
  );
}
