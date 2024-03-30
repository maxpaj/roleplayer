import { Divider } from "@/components/ui/divider";
import { H3, Muted } from "@/components/ui/typography";
import { AlertOctagon } from "lucide-react";

export default async function HistoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <H3>History</H3>
      <Divider className="my-3" />

      <div className="my-2 flex items-center gap-2">
        <AlertOctagon size={16} />
        <Muted>Identifiers are truncated down to the last 8 characters of their UUIDs</Muted>
      </div>

      {children}
    </div>
  );
}
