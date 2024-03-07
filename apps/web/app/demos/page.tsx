import { H2, H3, Muted } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { getDemoCampaigns } from "./actions";

export default async function DemosPage() {
  const demos = await getDemoCampaigns();

  return (
    <div>
      <H2>Play a demo</H2>
      <Muted>
        Select one of our demos below and play a few rounds to get a feel for
        what the product offers.
      </Muted>

      <div className="flex justify-center my-8">
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
          <Carousel className="w-full max-w-xl">
            <CarouselContent>
              {demos.map((demo, index) => (
                <CarouselItem key={index}>
                  <Card>
                    <CardContent className="flex flex-col gap-4 justify-between p-4">
                      <div>
                        <H3 className="my-3">{demo.entity.name}</H3>
                        <Muted>{demo.metadata.description}</Muted>
                      </div>
                      <ButtonLink href={`/campaigns/${demo.entity.id}`}>
                        Play
                      </ButtonLink>
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
    </div>
  );
}
