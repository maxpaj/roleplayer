"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Muted } from "@/components/ui/typography";
import { WorldRecord } from "@/db/schema/worlds";
import { saveWorld } from "app/worlds/actions";
import { Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type WorldEditorFormProps = {
  world: WorldRecord;
};

export function WorldEditorForm({ world }: WorldEditorFormProps) {
  const [update, setUpdate] = useState(world);

  return (
    <div className="flex flex-col gap-2">
      <Input
        value={update.name}
        onChange={(e) =>
          setUpdate({
            ...update,
            name: e.target.value,
          })
        }
        onBlur={async () => {
          await saveWorld(world.id, update);
        }}
        type="name"
        id="name"
        name="name"
        placeholder="World name"
      />

      <Textarea
        rows={10}
        id="story"
        name="story"
        onChange={(e) =>
          setUpdate({
            ...update,
            description: e.target.value,
          })
        }
        onBlur={async () => {
          await saveWorld(world.id, update);
        }}
        value={update.description || ""}
        placeholder="Describe the world, the story, background, conflicts, factions, etc."
      />

      <div className="flex items-center gap-2">
        <Info size={16} />
        <Muted>
          You can use{" "}
          <Link className="text-primary" href="https://commonmark.org/help/">
            Markdown
          </Link>{" "}
          to style your world description.
        </Muted>
      </div>
    </div>
  );
}
