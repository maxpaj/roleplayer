import React, { HTMLProps, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { LoadingSpinner } from "./ui/spinner";
import { CheckIcon, SparklesIcon, TrashIcon } from "lucide-react";
import { Muted } from "./ui/typography";

type TextareaGenerateProps = Omit<HTMLProps<HTMLTextAreaElement>, "onChange" | "onBlur" | "value" | "ref"> & {
  onChange: (v: string) => void;
  generate: () => Promise<string>;
  onBlur: (v: string) => void;
  value: string;
};

export function TextareaGenerate({ value, onBlur, onChange, generate, ...props }: TextareaGenerateProps) {
  const [update, setUpdate] = useState(value);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState("");

  async function getGenerate() {
    setLoading(true);
    const text = await generate();
    setGenerated(text);
    setLoading(false);
  }

  function reject() {
    setGenerated("");
  }

  function accept() {
    setUpdate(generated);
    onChange(generated);
    onBlur(generated);
    setGenerated("");
  }

  return (
    <div className="my-2">
      <Textarea
        rows={10}
        disabled={loading}
        value={generated || update}
        onBlur={(e) => onBlur(e.target.value)}
        {...props}
      />
      <div className="-mt-2 flex w-full flex-wrap justify-between gap-1 border p-1">
        <div className="align-center flex gap-2">
          <Button disabled={generated.length > 0 || loading} variant="outline" size="sm" onClick={getGenerate}>
            {loading && <LoadingSpinner size={16} />}
            {!loading && <SparklesIcon size={16} />}
          </Button>

          {generated && (
            <Button size="sm" variant="outline" disabled={loading} onClick={accept}>
              <CheckIcon size={16} className="mr-2" /> Accept
            </Button>
          )}

          {generated && (
            <Button size="sm" variant="outline" disabled={loading} onClick={reject}>
              <TrashIcon size={16} className="mr-2" /> Reject
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 p-1">
          <Muted>
            You can generate descriptions and backstory by entering your Open AI API token in your profile settings.
          </Muted>
        </div>
      </div>
    </div>
  );
}
