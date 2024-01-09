export default async function CampaignPage({
  params,
}: {
  params: { campaignId: string };
}) {
  return <>Campaign {params.campaignId} </>;
}
