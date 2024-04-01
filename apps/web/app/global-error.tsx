"use client";

import { Button } from "@/components/ui/button";
import { H5 } from "@/components/ui/typography";
import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <H5>Something went wrong!</H5>
        <Button onClick={() => reset()}>Try again</Button>
      </body>
    </html>
  );
}
