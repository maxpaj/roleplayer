"use client";

import { ItemAggregated, WorldAggregated } from "services/world-service";
import { EffectDetails } from "./effect-details";
import { Divider } from "./ui/divider";
import { Paragraph, H4 } from "./ui/typography";
import { useState } from "react";
import { generateItemDescription, saveItem } from "app/worlds/actions";
import { TextareaGenerate } from "./textarea-generate";

const userHasApiToken = true;

export function ItemEditor({ item, worldData }: { item: ItemAggregated; worldData: WorldAggregated }) {
  const [update, setUpdate] = useState(item);

  return (
    <>
      <TextareaGenerate
        id="item-description"
        name="item-description"
        onChange={(v) =>
          setUpdate({
            ...update,
            description: v,
          })
        }
        generate={async () => {
          const description = await generateItemDescription(worldData.id, item.id);
          if (!description) {
            return "Failed to generate description";
          }

          return description;
        }}
        onBlur={async (v) => {
          await saveItem(item.id, { description: v });
        }}
        value={update.description || ""}
        placeholder="Describe the item and it's background, history, etc."
        className="mb-2"
      />

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
