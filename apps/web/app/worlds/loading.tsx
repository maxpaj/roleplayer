import { Skeleton } from "@/components/ui/skeleton";
import { WorldLayoutHeader } from "./components/world-layout-header";

export default function Loading() {
  return (
    <div className="space-y-2">
      <WorldLayoutHeader />

      <div className="flex gap-2">
        <Skeleton className="h-[2.5rem] w-full" />
        <Skeleton className="h-[2.5rem] w-[100px]" />
        <Skeleton className="h-[2.5rem] w-[100px]" />
      </div>
      <div className="my-2 flex flex-wrap gap-2">
        <Skeleton className="my-0 h-[100px] w-[150px]" />
        <Skeleton className="my-0 h-[100px] w-[150px]" />
      </div>
    </div>
  );
}
