import { H3, Paragraph } from "@/components/ui/typography";
import { getCampaign } from "../actions";
import { Divider } from "@/components/ui/divider";
import { Table, TableBody, TableCaption, TableCell, TableRow } from "@/components/ui/table";

export default async function CampaignPage({ params }: { params: { campaignId: string } }) {
  const { campaignId: id } = params;
  const campaignData = await getCampaign(id);

  if (!campaignData) {
    return <>Campaign not found</>;
  }

  const { campaign, world } = campaignData;

  return (
    <>
      <H3>Campaign</H3>
      <Divider className="my-3" />
      <Paragraph>{campaign.description}</Paragraph>

      <Table>
        <TableCaption>Your campaign stats.</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">World</TableCell>
            <TableCell>{world.world.name}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
