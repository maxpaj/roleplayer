import { Divider } from "@/components/ui/divider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { H3, Paragraph } from "@/components/ui/typography";
import { DEFAULT_USER_ID } from "@/db/data";
import { WorldService } from "services/world-service";

export default async function ItemDetailsPage({
  params: { worldId, itemId },
}: {
  params: { worldId: string; itemId: string };
}) {
  const worldData = await new WorldService().getWorld(DEFAULT_USER_ID, worldId);

  if (!worldData) {
    return <>World not found</>;
  }

  const { items } = worldData;
  const item = items.find((c) => c.id === itemId);

  if (!item) {
    return <>Item not found</>;
  }

  console.log(item);

  return (
    <>
      <H3>{item.name}</H3>
      <Divider className="my-3" />
      <Paragraph>{item.description}</Paragraph>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Effects</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {item.actions.map((e) => (
            <TableRow key={e.id}>
              <TableCell>{e.name}</TableCell>
              <TableCell>{e.description}</TableCell>
              <TableCell>
                {e.appliesEffects.map((e) => (
                  <div>{e.name}</div>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
