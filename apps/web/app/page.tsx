import { ButtonLink } from "@/components/ui/button-link";
import { H1, H2, H4, Lead, Muted } from "@/components/ui/typography";
import bg from "assets/bg.webp";
import { ArrowRight, HammerIcon, SwordIcon } from "lucide-react";

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

      <section className="z-1 relative mb-[25vh] space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex flex-col items-center gap-4 text-center">
          <H1 className="text-5xl font-semibold sm:text-5xl md:text-6xl lg:text-7xl">Create a journey to remember</H1>
          <Lead className="my-4">
            Build a role-playing world, invite your friends, create characters and the adventure may begin
          </Lead>
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

      <section>
        <div className="mb-16 text-center">
          <H2 className="md:text-3xl">What's in Roleplayer?</H2>
          <Lead className="m-0">Everything you need to build a role playing experience</Lead>
        </div>

        <div className="container mb-[10vh]">
          <div className="grids-col-4 grid gap-4">
            <div className="bg-card/70 text-card-foreground rounded-xl border p-6 shadow">
              <H4 className="mb-1">World builder tool</H4>
              <Muted>Design a world for your campaign. Use AI to generate content.</Muted>
            </div>
            <div className="bg-card/70 text-card-foreground rounded-xl border p-6 shadow">
              <H4 className="mb-1">
                <SwordIcon /> Combat tracker
              </H4>
              <Muted>Keep track of character actions and conditions in combat.</Muted>
            </div>

            <div className="bg-card/70 text-card-foreground rounded-xl border p-6 shadow">
              <H4 className="mb-1">Story tracker</H4>
              <Muted>
                Keep track of the path that your party has paved through the world, which characters and factions you've
                interacted with, etc.
              </Muted>
            </div>
            <div className="bg-card/70 text-card-foreground rounded-xl border p-6 shadow">
              <H4 className="mb-1">TTRPG builder</H4>
              <Muted>For the hard core TTRPG nerds. Design rules for a your own role playing game.</Muted>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
