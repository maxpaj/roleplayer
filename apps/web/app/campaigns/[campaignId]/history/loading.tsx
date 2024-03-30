import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-2">
      <div className="my-2 flex flex-wrap gap-2">
        <Skeleton className="h-[2.5rem] w-1/6" />
        <Skeleton className="h-[2.5rem] w-1/6" />
        <Skeleton className="h-[2.5rem] w-1/6" />
        <Skeleton className="h-[2.5rem] w-1/6" />
        <Skeleton className="h-[2.5rem] w-1/6" />
      </div>
      <Skeleton className="h-[2.5rem] w-full" />
      <Skeleton className="h-[2.5rem] w-full" />
      <Skeleton className="h-[2.5rem] w-full" />
      <Skeleton className="h-[2.5rem] w-full" />
      <Skeleton className="h-[2.5rem] w-full" />
    </div>
  );
}
