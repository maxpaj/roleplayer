import { H2, H3, Muted } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { World } from "@repo/rp-lib";
import { memoryWorldRepository } from "storage/world-repository";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";

async function getDemoWorlds(): Promise<World[]> {
  return memoryWorldRepository.getDemoWorlds();
}

export default async function DemosPage() {
  const demos = await getDemoWorlds();

  return (
    <>
      <H2>Play a demo</H2>
      <Muted>
        Select one of our demos below and play a few rounds to get a feel for
        what the product offers.
      </Muted>

      <div className="flex justify-center">
        {demos.length === 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No demos available</AlertTitle>
            <AlertDescription>
              No demos have been added yet, come back later.
            </AlertDescription>
          </Alert>
        )}

        {demos.length > 0 && (
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              {demos.map((demo, index) => (
                <CarouselItem key={index}>
                  <Card>
                    <CardContent className="flex flex-col gap-4 aspect-square justify-between p-4">
                      <div>
                        <H3 className="my-3">{demo.name}</H3>
                        <Muted>{demo.description}</Muted>
                      </div>
                      <ButtonLink href={`/demos/${demo.id}`}>Play</ButtonLink>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </div>
    </>
  );
}
