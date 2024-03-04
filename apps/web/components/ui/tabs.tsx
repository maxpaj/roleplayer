"use client";

import { ReactNode, useState } from "react";
import { Badge } from "./badge";

type Tab = {
  label: string;
  content: ReactNode;
  defaultSelected?: boolean;
};

type TabsProps = {
  tabs: Tab[];
};

export function Tabs({ tabs }: TabsProps) {
  const [selectedTab, setSelectedTab] = useState<Tab | undefined>(
    tabs.find((t) => t.defaultSelected)
  );

  if (!selectedTab) {
    throw new Error("No tabs available");
  }

  return (
    <>
      <div className="flex gap-2 mb-3">
        {tabs.map((t) => (
          <Badge
            variant={t.label === selectedTab.label ? "tab-selected" : "tab"}
            onClick={() => {
              setSelectedTab(t);
            }}
          >
            {t.label}
          </Badge>
        ))}
      </div>

      {selectedTab.content}
    </>
  );
}
