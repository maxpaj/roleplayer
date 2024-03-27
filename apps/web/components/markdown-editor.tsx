import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import Markdown from "react-markdown";
import { Info } from "lucide-react";
import Link from "next/link";
import { Muted } from "./ui/typography";

type MarkdownEditorProps = {
  renderEditor: (value: string, onChange: (value: string) => void, onBlur: () => void, disabled?: boolean) => ReactNode;
  onChange: (value: string) => void;
  onBlur: () => void;
  value: string;
  disabled?: boolean;
};

export function MarkdownEditor({ renderEditor, disabled, onChange, onBlur, value }: MarkdownEditorProps) {
  const [markdown, setMarkdown] = useState(value);
  const [showPreview, setShowPreview] = useState(true);

  return (
    <div className="my-2 flex flex-col">
      <div className="-mt-2 flex w-full flex-wrap justify-between gap-1 border p-1">
        <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? "Edit" : "Preview"}
        </Button>

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

      {!showPreview &&
        renderEditor(
          markdown,
          (change) => {
            setMarkdown(change);
            onChange(change);
          },
          () => onBlur(),
          disabled
        )}

      {showPreview && (
        <div className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full justify-center rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
          <div className="prose dark:prose-invert prose-sm min-w-[50vw]">
            <Markdown>{markdown}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}
