"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { H5, Paragraph } from "@/components/ui/typography";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <H5>Something went wrong!</H5>
      <Paragraph>Reload the page</Paragraph>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
