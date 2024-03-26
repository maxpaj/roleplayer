import Link from "next/link";
import Image from "next/image";
import icon from "../assets/icon.svg";
import { UserService } from "services/user-service";
import { DEFAULT_USER_ID } from "@/db/data";
import { Divider } from "./ui/divider";

async function getUser() {
  const user = await new UserService().getUser(DEFAULT_USER_ID);
  return user;
}

export async function Header() {
  const user = await getUser();

  return (
    <header
      className="sticky top-0 z-10 flex w-full items-center justify-between px-4 py-3 text-sm backdrop-blur-md"
      style={{ background: "hsla(var(--background) / 50%)" }}
    >
      <div className="mr-2 flex items-center dark:invert">
        <Image src={icon} height="40" width="40" alt="Icon" priority />
      </div>

      <nav className="flex gap-x-4">
        <div className="flex items-center gap-2">
          <Link href="/">Home</Link>
          <Link href="/campaigns">Campaigns</Link>
          <Link href="/worlds">Worlds</Link>
        </div>

        <div>
          <Divider orientation="vertical" />
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <>
              {user.imageUrl && (
                <Image src={user.imageUrl} alt={"User profile"} width={24} height={24} style={{ objectFit: "cover" }} />
              )}
              {user.name}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
