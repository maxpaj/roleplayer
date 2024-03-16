import { Separator } from "@/components/ui/separator";
import { H3, Muted } from "@/components/ui/typography";
import { InviteAFriendForm } from "./components/invite-a-friend-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserService } from "services/user-service";
import { DEFAULT_USER_ID } from "@/db/data";

export default async function InviteAFriendPage({ params: { campaignId: id } }: { params: { campaignId: string } }) {
  const campaignId = id;
  const friendInvites = await new UserService().getFriendInvites(DEFAULT_USER_ID);

  return (
    <>
      <H3>Invite a friend</H3>
      <Separator className="my-3" />

      <InviteAFriendForm campaignId={campaignId} />

      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Sent</TableHead>
            <TableHead>Accepted</TableHead>
            <TableHead>Expired</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {friendInvites.map(({ friendInvites }) => (
            <TableRow key={friendInvites.id}>
              <TableCell>{friendInvites.email}</TableCell>
              <TableCell>{friendInvites.createdUtc?.toLocaleString()}</TableCell>
              <TableCell>{friendInvites.acceptedUtc?.toLocaleString()}</TableCell>
              <TableCell>{friendInvites.expiredUtc?.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {friendInvites.length === 0 && <Muted className="my-4">No invites sent yet, try sending one!</Muted>}
    </>
  );
}
