import { H3, H4, Paragraph } from "@/components/ui/typography";
import { getCampaign } from "../actions";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function CampaignPage({
  params,
}: {
  params: { campaignId: string };
}) {
  const { campaignId: id } = params;
  const campaignData = await getCampaign(parseInt(id));

  if (!campaignData) {
    return <>Not found!</>;
  }

  const { campaign, world } = campaignData;

  return (
    <>
      <H3>Campaign</H3>
      <Separator className="my-3" />
      <Paragraph>{campaign.description}</Paragraph>

      <Table>
        <TableCaption>Your campaign stats.</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">World</TableCell>
            <TableCell>{world.name}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
