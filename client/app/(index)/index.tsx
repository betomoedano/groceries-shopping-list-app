import React from "react";
import * as Haptics from "expo-haptics";
import { Stack, useRouter } from "expo-router";
import { FlatList, Platform, Pressable, StyleSheet } from "react-native";
// Components
import { IconCircle } from "@/components/IconCircle";
import ShoppingListItem from "@/components/ShoppingListItem";
import { BodyScrollView } from "@/components/ui/BodyScrollView";
import Button from "@/components/ui/button";
import { IconSymbol } from "@/components/ui/IconSymbol";
// Constants & Hooks
import { backgroundColors } from "@/constants/Colors";
import { useShoppingListIds } from "@/stores/ShoppingListsStore";

const ICON_COLOR = "#007AFF";

export default function HomeScreen() {
  const router = useRouter();
  const shoppingListIds = useShoppingListIds();

  const handleNewListPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/list/new");
  };

  const handleProfilePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/profile");
  };

  const renderEmptyList = () => (
    <BodyScrollView contentContainerStyle={styles.emptyStateContainer}>
      <IconCircle
        emoji="🛒"
        backgroundColor={
          backgroundColors[Math.floor(Math.random() * backgroundColors.length)]
        }
      />
      <Button onPress={handleNewListPress} variant="ghost">
        Create your first list
      </Button>
    </BodyScrollView>
  );

  const renderHeaderRight = () => (
    <Pressable
      // work around for https://github.com/software-mansion/react-native-screens/issues/2219
      // onPress={handleNewListPress}
      onPress={handleNewListPress}
      // style={styles.headerButton}
    >
      <IconSymbol name="plus" color={ICON_COLOR} />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <Pressable
      // work around for https://github.com/software-mansion/react-native-screens/issues/2219
      // onPress={handleProfilePress}
      onPress={handleProfilePress}
      style={[styles.headerButton, styles.headerButtonLeft]}
    >
      <IconSymbol
        name="gear"
        color={ICON_COLOR}
        style={{ marginRight: Platform.select({ default: 0, android: 8 }) }}
      />
    </Pressable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Shopping lists",
          headerRight: renderHeaderRight,
          headerLeft: renderHeaderLeft,
        }}
      />
      <FlatList
        data={shoppingListIds}
        renderItem={({ item: listId }) => <ShoppingListItem listId={listId} />}
        contentContainerStyle={styles.listContainer}
        contentInsetAdjustmentBehavior="automatic"
        ListEmptyComponent={renderEmptyList}
      />
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 8,
  },
  emptyStateContainer: {
    alignItems: "center",
    gap: 8,
    paddingTop: 100,
  },
  headerButton: {
    padding: 8,
    paddingRight: 0,
    marginHorizontal: Platform.select({ web: 16, default: 0 }),
  },
  headerButtonLeft: {
    paddingLeft: 0,
  },
});
