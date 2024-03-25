"use client";

import { MarkdownEditor } from "@/components/markdown-editor";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WorldRecord } from "@/db/schema/worlds";
import { saveWorld } from "app/worlds/actions";
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

      <MarkdownEditor
        onChange={(value) =>
          setUpdate({
            ...update,
            description: value,
          })
        }
        value={update.description || ""}
        onBlur={async () => {
          await saveWorld(world.id, update);
        }}
        renderEditor={(value, onChange, onBlur) => (
          <Textarea
            rows={10}
            id="story"
            name="story"
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            value={value}
            placeholder="Describe the world, the story, background, conflicts, factions, etc."
          />
        )}
      />
    </div>
  );
}
