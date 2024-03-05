"use client";

import { ReactNode, useState } from "react";
import { Badge } from "./badge";

type TabRender = (
  tab: Tab,
  isSelected: boolean,
  onClick: (t: Tab) => void
) => ReactNode;

type Tab = {
  label: string;
  content: ReactNode;
  defaultSelected?: boolean;
};

type TabsProps = {
  onTabSelected?: (t: Tab) => void;
  renderTab: TabRender;
  tabs: Tab[];
};

const defaultRender = (
  tab: Tab,
  isSelected: boolean,
  onClick: (t: Tab) => void
) => {
  return (
    <Badge
      onClick={() => onClick(tab)}
      variant={isSelected ? "tab-selected" : "tab"}
    >
      {tab.label}
    </Badge>
  );
};

export function Tabs({
  tabs,
  renderTab = defaultRender,
  onTabSelected,
}: TabsProps) {
  const [selectedTab, setSelectedTab] = useState<Tab | undefined>(
    tabs.find((t) => t.defaultSelected) || tabs[0]
  );

  if (!selectedTab) {
    throw new Error("No tabs available");
  }

  return (
    <>
      <div className="flex gap-2 mb-3">
        {tabs.map((tab) => {
          return renderTab(tab, tab.label === selectedTab.label, (tab) => {
            setSelectedTab(tab);
            onTabSelected && onTabSelected(tab);
          });
        })}
      </div>
      {selectedTab.content}
    </>
  );
}
