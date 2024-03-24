"use client";

import { ItemAggregated, WorldAggregated } from "services/world-service";
import { EffectDetails } from "./effect-details";
import { Divider } from "./ui/divider";
import { Textarea } from "./ui/textarea";
import { Paragraph, H4, Muted } from "./ui/typography";
import { useState } from "react";
import { generateItemDescription, saveItem } from "app/worlds/actions";
import { MagicWandIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { Info } from "lucide-react";

const userHasApiToken = true;

export function ItemEditor({ item, worldData }: { item: ItemAggregated; worldData: WorldAggregated }) {
  const [update, setUpdate] = useState(item);

  return (
    <>
      <Textarea
        id="story"
        name="story"
        onChange={(e) =>
          setUpdate({
            ...update,
            description: e.target.value,
          })
        }
        onBlur={async () => {
          await saveItem(item.id, update);
        }}
        value={update.description || ""}
        placeholder="Describe the world, the story, background, conflicts, factions, etc."
        className="mb-2"
      />

      <div className="my-2 flex flex-wrap justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info size={16} />
          <Muted>
            You can generate descriptions and backstory by entering your Open AI API token in your profile settings.
          </Muted>
        </div>

        <Button
          disabled={!userHasApiToken}
          variant="outline"
          onClick={async () => {
            const description = await generateItemDescription(worldData.id, item.id);
            if (!description) {
              console.error("Failed to generate description");
              return;
            }

            setUpdate({
              ...update,
              description,
            });
          }}
        >
          <MagicWandIcon className="mr-2" /> Generate
        </Button>
      </div>

      {item.actions.map((e) => {
        return (
          <div className="border px-3 py-1" key={e.id}>
            <H4>{e.name}</H4>
            <Paragraph>{e.description}</Paragraph>
            <div>
              {e.appliesEffects.map((e) => (
                <>
                  <EffectDetails world={worldData} key={e.id} effect={e} />
                  <Divider className="my-2" />
                </>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
