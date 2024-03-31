import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CampaignAggregated } from "services/data-mapper";

export function CampaignBreadCrumb({ campaign }: { campaign?: CampaignAggregated }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/campaigns">Campaigns</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {campaign && (
          <BreadcrumbItem>
            <BreadcrumbLink href={`/campaigns/${campaign.id}`}>{campaign.name}</BreadcrumbLink>
          </BreadcrumbItem>
        )}
        {!campaign && <BreadcrumbItem>...</BreadcrumbItem>}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
