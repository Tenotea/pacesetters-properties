import { useEffect, useState } from "react";
import { ListItem } from "../types/index.types";

export function useTab(
  tabs: ListItem[],
  options?: {
    defaultEmpty?: boolean;
  }
) {
  const [activeTab, setActiveTab] = useState<string>("");

  function handleTabChange(payload: ListItem) {
    setActiveTab(payload.id);
  }

  useEffect(() => {
    if (!options?.defaultEmpty) {
      setActiveTab(tabs[0]?.id);
    }
  }, []);

  return {
    tabs,
    activeTab,
    activeTabItem: tabs.find((t) => activeTab === t.id),
    handleTabChange,
  };
}
