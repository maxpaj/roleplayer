import { ButtonLink } from "@/components/ui/button-link";
import { Lead } from "@/components/ui/typography";

export default function Home() {
  return (
    <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-semibold sm:text-5xl md:text-6xl lg:text-7xl">
          Roleplaying campaign manager
        </h1>
        <Lead>
          Build a world, create characters, bring them into battle. Toggle help
          features on and off at a whim, depending on the level of support you
          want
        </Lead>
        <div className="flex gap-2">
          <ButtonLink href={"/worlds"}>Create your world</ButtonLink>
          <ButtonLink variant="outline" href={"/demos"}>
            Play demo
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
