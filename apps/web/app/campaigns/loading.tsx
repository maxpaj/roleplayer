import { Divider } from "@/components/ui/divider";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <Skeleton className="my-2 h-[2rem] w-[150px]" />
      <Divider className="my-2" />
      <Skeleton className="h-[2rem] w-full" />
    </>
  );
}
