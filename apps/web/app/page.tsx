import { ButtonLink } from "@/components/ui/button-link";
import { H1, Lead } from "@/components/ui/typography";
import bg from "assets/bg.webp";
import { ArrowRight, HammerIcon } from "lucide-react";

export default function Home() {
  return (
    <>
      <div
        className="top-30 fixed -z-10"
        style={{
          opacity: 0.45,
          backgroundImage: `radial-gradient(circle at center, transparent 0, transparent, hsl(var(--background)) 50%), url(${bg.src})`,
          backgroundRepeat: "no-repeat",
          height: "816px",
          width: "1456px",
        }}
      />

      <section className="z-1 relative space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex flex-col items-center gap-4 text-center">
          <H1 className="text-3xl font-semibold sm:text-5xl md:text-6xl lg:text-7xl">Create a journey to remember</H1>
          <Lead className="my-4">Build a role-playing world, invite your friends, create characters and the adventure may begin</Lead>
          <div className="flex flex-wrap justify-center gap-4">
            <ButtonLink variant="front-page" href={"/demos"} size="front-page">
              Play the demo <ArrowRight className="ml-2" />
            </ButtonLink>
            <ButtonLink variant="front-page-outline" href={"/worlds"} size="front-page">
              Build your world <HammerIcon className="ml-2" />
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
