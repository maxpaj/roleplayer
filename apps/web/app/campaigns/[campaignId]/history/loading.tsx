import { Divider } from "@/components/ui/divider";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-[2.5rem] w-[200px]" />
      <Skeleton className="h-[1.5rem] w-full" />
      <Divider className="my-2" />
      <div className="my-2 flex flex-wrap gap-2">
        <Skeleton className="h-[2.5rem] w-full" />
        <Skeleton className="h-[2.5rem] w-full" />
        <Skeleton className="h-[2.5rem] w-full" />
        <Skeleton className="h-[2.5rem] w-full" />
        <Skeleton className="h-[2.5rem] w-full" />
        <Skeleton className="h-[2.5rem] w-full" />
        <Skeleton className="h-[2.5rem] w-full" />
      </div>
    </div>
  );
}
