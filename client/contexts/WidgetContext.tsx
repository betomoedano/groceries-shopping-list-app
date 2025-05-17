import * as React from "react";
import { createContext, useCallback, useContext } from "react";
import {
  useShoppingListIds,
  useShoppingListsValues,
} from "@/stores/ShoppingListsStore";
import { ExtensionStorage } from "@bacons/apple-targets";

// Initialize storage with your group ID
const storage = new ExtensionStorage(
  "group.com.betoatexpo.groceries-shopping-list"
);

type WidgetContextType = {
  refreshWidget: () => void;
};

const WidgetContext = createContext<WidgetContextType | null>(null);

export function WidgetProvider({ children }: { children: React.ReactNode }) {
  const recentLists = useShoppingListsValues();
  const totalLists = useShoppingListIds().length;

  // Update widget state whenever recentLists changes
  React.useEffect(() => {
    if (totalLists === 0) {
      // Set values to null if no lists exist
      storage.set("widget_total_lists", null);
      storage.set("widget_recent_lists", null);
    } else {
      // Store total count
      storage.set("widget_total_lists", totalLists);
      // Format lists for widget display
      const formattedRecentLists = recentLists.map((list) => {
        // Get product count from the list's tables
        const products = list.tables?.products || {};
        const productCount = Object.keys(products).length;

        // Count purchased items
        const purchasedCount = Object.values(products).filter(
          (product: any) => product.isPurchased
        ).length;

        return {
          listId: list.values?.listId,
          name: list.values?.name,
          emoji: list.values?.emoji,
          color: list.values?.color,
          productCount,
          purchasedCount,
        };
      });

      // Store recent lists data
      storage.set("widget_recent_lists", formattedRecentLists);
    }

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
