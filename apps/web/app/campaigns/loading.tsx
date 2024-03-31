import { Skeleton } from "@/components/ui/skeleton";
import { CampaignLayoutHeader } from "./components/campaign-layout-header";

export default function Loading() {
  return (
    <div className="space-y-2">
      <CampaignLayoutHeader />
      <Skeleton className="m-0 h-[100px] w-[150px]" />
    </div>
  );
}
