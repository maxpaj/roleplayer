import { ButtonLink } from "@/components/ui/button-link";
import { H1, H2, H4, Lead, Paragraph } from "@/components/ui/typography";
import { ArrowRight, HammerIcon, HeartIcon, PuzzleIcon, SwordsIcon } from "lucide-react";
import { HomeBackground } from "./home-background";
import combat from "@/assets/frontpage/battle.webp";
import relationship from "@/assets/frontpage/relationship.webp";
import worldbuilder from "@/assets/frontpage/worldbuilder.webp";
import rulebook from "@/assets/frontpage/rulebook.webp";

export default function Home() {
  return (
    <>
      <HomeBackground />

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
            <div className="bg-card text-card-foreground relative h-44 overflow-hidden rounded-xl border px-6 py-6 shadow">
              <div className="relative z-10">
                <H4 className="mb-1 flex items-start gap-2">
                  <SwordsIcon /> Combat tracker
                </H4>
                <Paragraph className="text-color-gray drop-shadow-background md:w-[50%]">
                  Keep track of character actions and conditions in combat.
                </Paragraph>
              </div>
              <div
                className="absolute right-0 top-0 z-0 h-full w-full bg-cover bg-no-repeat opacity-40"
                style={{
                  backgroundImage: `linear-gradient(to left, transparent 0, transparent, hsl(var(--background)) 90%), url(${combat.src})`,
                  backgroundPosition: "100% 55%",
                }}
              />
            </div>

            <div className="bg-card text-card-foreground relative h-44 overflow-hidden rounded-xl border px-6 py-6 shadow">
              <div className="relative bottom-0 z-10">
                <H4 className="mb-1 flex items-start gap-2">
                  <HeartIcon /> Story and relationships system
                </H4>
                <Paragraph className="text-color-gray drop-shadow-background md:w-[50%]">
                  Keep track of the path that your party has paved through the world, which characters and factions
                  they've interacted with, etc.
                </Paragraph>
              </div>
              <div
                className="absolute right-0 top-0 z-0 h-full w-full bg-cover bg-no-repeat opacity-40"
                style={{
                  backgroundImage: `linear-gradient(to left, transparent 0, transparent, hsl(var(--background)) 90%), url(${relationship.src})`,
                  backgroundPosition: "100% 75%",
                }}
              />
            </div>

            <div className="bg-card text-card-foreground relative h-44 overflow-hidden rounded-xl border px-6 py-6 shadow">
              <div className="relative bottom-0 z-10">
                <H4 className="mb-1 flex items-start gap-2">
                  <HammerIcon /> World builder
                </H4>
                <Paragraph className="text-color-gray drop-shadow-background md:w-[50%]">
                  Design a world for your campaign. Use AI to generate content.
                </Paragraph>
              </div>
              <div
                className="absolute right-0 top-0 z-0 h-full w-full bg-cover bg-no-repeat opacity-40"
                style={{
                  backgroundImage: `linear-gradient(to left, transparent 0, transparent, hsl(var(--background)) 90%), url(${worldbuilder.src})`,
                  backgroundPosition: "100% 90%",
                }}
              />
            </div>

            <div className="bg-card text-card-foreground relative h-44 overflow-hidden rounded-xl border px-6 py-6 shadow">
              <div className="relative bottom-0 z-10">
                <H4 className="mb-1 flex items-start gap-2">
                  <PuzzleIcon /> Make your own rules
                </H4>
                <Paragraph className="text-color-gray drop-shadow-background md:w-[50%]">
                  For the hard core TTRPG nerds. Design rules for a your own role playing game.
                </Paragraph>
              </div>
              <div
                className="absolute right-0 top-0 z-0 h-full w-full bg-cover bg-no-repeat opacity-40"
                style={{
                  backgroundImage: `linear-gradient(to left, transparent 0, transparent, hsl(var(--background)) 90%), url(${rulebook.src})`,
                  backgroundPosition: "100% 35%",
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
