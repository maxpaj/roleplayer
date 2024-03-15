import { ButtonLink } from "@/components/ui/button-link";
import { Lead } from "@/components/ui/typography";
import bg from "assets/bg.webp";

export default function Home() {
  return (
    <>
      <div
        className="fixed w-100 h-100 -z-10 top-0"
        style={{
          opacity: 0.3,
          backgroundImage: `radial-gradient(circle at center, transparent 0, transparent, hsl(var(--background)) 100%), url(${bg.src})`,
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "100%",
        }}
      />

      <section className="relative z-1 space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-semibold sm:text-5xl md:text-6xl lg:text-7xl">
            Roleplaying campaign manager
          </h1>
          <Lead>
            Build a world, create characters, bring them into battle. Toggle
            help features on and off at a whim, depending on the level of
            support you want
          </Lead>
          <div className="flex gap-2">
            <ButtonLink href={"/demos"} className="w-40">
              Play demo
            </ButtonLink>
            <ButtonLink variant="outline" href={"/worlds"} className="w-40">
              Create your world
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
