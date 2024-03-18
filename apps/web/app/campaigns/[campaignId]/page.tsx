import { H3, Paragraph } from "@/components/ui/typography";
import { getCampaign } from "../actions";
import { Divider } from "@/components/ui/divider";
import { Table, TableBody, TableCaption, TableCell, TableRow } from "@/components/ui/table";

export default async function CampaignPage({ params }: { params: { campaignId: string } }) {
  const { campaignId: id } = params;
  const campaign = await getCampaign(id);

  if (!campaign) {
    return <>Campaign not found</>;
  }

  const { world } = campaign;

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
            <TableCell>{world.name}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
