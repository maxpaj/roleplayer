import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-2">
      <Skeleton className="m-0 h-[2rem] w-[150px]" />
      <Skeleton className="h-[1.5rem] w-[50vw]" />
    </div>
  );
}
