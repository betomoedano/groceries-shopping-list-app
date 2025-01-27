import * as React from "react";
import { createContext, useContext, useCallback } from "react";
import { ExtensionStorage } from "@bacons/apple-targets";
import { useStore } from "tinybase/ui-react";
import {
  useRecentShoppingLists,
  useShoppingListIds,
} from "@/stores/ShoppingListsStore";
import { useShoppingListValue } from "@/stores/ShoppingListStore";

// Initialize storage with your group ID
const storage = new ExtensionStorage(
  "group.lesson.com.betoatexpo.groceries-shopping-list"
);

type WidgetContextType = {
  refreshWidget: () => void;
};

const WidgetContext = createContext<WidgetContextType | null>(null);

export function WidgetProvider({ children }: { children: React.ReactNode }) {
  const recentLists = useRecentShoppingLists();
  const shoppingListIds = useShoppingListIds();

  console.log(recentLists);

  // Update widget state whenever recentLists changes
  React.useEffect(() => {
    // Store total count
    storage.set("widget_total_lists", shoppingListIds.length);

    // Store recent lists data
    storage.set(
      "widget_recent_lists",
      recentLists.map((list) => ({
        listId: list.listId,
        name: list.name,
        emoji: list.emoji,
      }))
    );

    // Refresh widget
    ExtensionStorage.reloadWidget();
  }, [recentLists]);

  const refreshWidget = useCallback(() => {
    ExtensionStorage.reloadWidget();
  }, []);

  return (
    <WidgetContext.Provider value={{ refreshWidget }}>
      {children}
    </WidgetContext.Provider>
  );
}

export const useWidget = () => {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error("useWidget must be used within a WidgetProvider");
  }
  return context;
};
