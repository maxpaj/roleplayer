import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { WorldAggregated } from "services/data-mapper";

export function WorldBreadcrumb({ world }: { world?: WorldAggregated }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/worlds">Worlds</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {world && (
          <BreadcrumbItem>
            <BreadcrumbLink href={`/worlds/${world.id}`}>{world.name}</BreadcrumbLink>
          </BreadcrumbItem>
        )}
        {!world && <BreadcrumbItem>...</BreadcrumbItem>}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
