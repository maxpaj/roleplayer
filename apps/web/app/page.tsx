import { ButtonLink } from "@/components/ui/button-link";
import { H1, Lead } from "@/components/ui/typography";
import bg from "assets/bg.webp";

export default function Home() {
  return (
    <>
      <div
        className="fixed -z-10 top-30"
        style={{
          opacity: 0.45,
          backgroundImage: `radial-gradient(circle at center, transparent 0, transparent, hsl(var(--background)) 50%), url(${bg.src})`,
          backgroundRepeat: "no-repeat",
          height: "816px",
          width: "1456px",
        }}
      />

      <section className="relative z-1 space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <H1 className="text-3xl font-semibold sm:text-5xl md:text-6xl lg:text-7xl">
            Role-playing world builder and campaign manager
          </H1>
          <Lead className="my-4">
            Build a world, invite your friends, create characters and start your
            adventure. Toggle help features on and off at a whim, depending on
            the level of support you want
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
