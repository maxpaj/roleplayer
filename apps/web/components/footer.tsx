import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { Github } from "lucide-react";
import { LightModeToggle } from "./mode-toggle";
import { Muted, H5 } from "./ui/typography";
import Image from "next/image";
import Link from "next/link";
import logo from "../assets/logo.svg";

export function Footer() {
  return (
    <footer className="bg-background/20 pb-16 pt-6 text-xs backdrop-blur-sm md:px-8 md:pt-4">
      <div className="container flex flex-col flex-wrap justify-between gap-8 md:h-24 md:flex-row">
        <div className="flex max-w-[300px] flex-col gap-3">
          <div className="mr-2 flex h-8 w-20 dark:invert">
            <Image src={logo} alt="Icon" priority />
          </div>
          <div>
            <Muted className="m-0">
              Build a role-playing world, invite your friends, create characters and the adventure may begin
            </Muted>
          </div>
          <LightModeToggle />
        </div>

        <div className="flex flex-wrap gap-8">
          <div className="flex max-w-[300px] flex-col gap-3">
            <H5>Community</H5>
            <Link href="https://discord.gg/EpZevm6cZW">
              <DiscordLogoIcon className="mr-1 inline-block h-[16px] w-[16px]" /> Discord
            </Link>
          </div>

          <div className="flex max-w-[300px] flex-col gap-3">
            <H5>Resources</H5>
            <Link href="https://github.com/maxpaj/roleplayer">
              <Github size={16} className="mr-1 inline-block" /> GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
