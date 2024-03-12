"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Muted } from "@/components/ui/typography";
import { World } from "roleplayer";
import { Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { WorldMetadata } from "repository/world-repository";
import { RemoveFunctions } from "types/without-functions";

type WorldEditorFormProps = {
  world: RemoveFunctions<World>;
  metadata: WorldMetadata;
};

export function WorldEditorForm({ world, metadata }: WorldEditorFormProps) {
  const [update, setUpdate] = useState({ entity: world, metadata });

  return (
    <div className="flex flex-col gap-2">
      <Input
        value={update.name}
        onChange={(e) =>
          setUpdate({
            ...update,
            entity: { ...update.entity, name: e.target.value },
          })
        }
        type="name"
        id="name"
        name="name"
        placeholder="World name"
      />

      <Textarea
        id="story"
        name="story"
        onChange={(e) =>
          setUpdate({
            ...update,
            metadata: { ...update.metadata, description: e.target.value },
          })
        }
        value={update.metadata.description}
        placeholder="Describe the world, the story, background, conflicts, factions, etc."
      />

      <Muted className="flex gap-1 items-center">
        <Info size={16} /> You can use{" "}
        <Link className="text-primary" href="https://commonmark.org/help/">
          Markdown
        </Link>{" "}
        to style your world description.
      </Muted>
    </div>
  );
}
