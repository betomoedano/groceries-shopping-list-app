import React from "react";
import { useNetworkState } from "expo-network";
import { Redirect, router, Stack } from "expo-router";
import { Alert } from "react-native";
import { Provider as TinyBaseProvider } from "tinybase/ui-react";
import { Inspector } from "tinybase/ui-react-inspector";
import { Button } from "@/components/ui/button";
import { ListCreationProvider } from "@/context/ListCreationContext";
import ShoppingListsStore from "@/stores/ShoppingListsStore";
import { SignedIn, useUser } from "@clerk/clerk-expo";
import { OneSignal } from "react-native-onesignal";

export const unstable_settings = {
  initialRouteName: "index",
};

OneSignal.Notifications.requestPermission(true);

OneSignal.Notifications.addEventListener("foregroundWillDisplay", (e) => {
  console.log("Foreground display");
  // console.log(JSON.stringify(e.notification, null, 2));
});

OneSignal.Notifications.addEventListener("click", (e) => {
  console.log(e.result);
});

export default function AppIndexLayout() {
  const { user } = useUser();
  const networkState = useNetworkState();

  React.useEffect(() => {
    if (
      !networkState.isConnected &&
      networkState.isInternetReachable === false
    ) {
      Alert.alert(
        "🔌 You are offline",
        "You can keep using the app! Your changes will be saved locally and synced when you are back online."
      );
    }
  }, [networkState.isConnected, networkState.isInternetReachable]);

  if (!user) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <SignedIn>
      <TinyBaseProvider>
        <ShoppingListsStore />
        <ListCreationProvider>
          <Stack
            screenOptions={{
              ...(process.env.EXPO_OS !== "ios"
                ? {}
                : {
                    headerLargeTitle: true,
                    headerTransparent: true,
                    headerBlurEffect: "systemChromeMaterial",
                    headerLargeTitleShadowVisible: false,
                    headerShadowVisible: true,
                    headerLargeStyle: {
                      // NEW: Make the large title transparent to match the background.
                      backgroundColor: "transparent",
                    },
                  }),
            }}
          >
            <Stack.Screen
              name="list/new/index"
              options={{
                presentation: "formSheet",
                sheetGrabberVisible: true,
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="list/[listId]/edit"
              options={{
                presentation: "formSheet",
                sheetAllowedDetents: [0.5, 0.75, 1],
                sheetGrabberVisible: true,
                headerLargeTitle: false,
                headerTitle: "Edit list",
              }}
            />
            <Stack.Screen
              name="list/[listId]/product/new"
              options={{
                presentation: "formSheet",
                sheetAllowedDetents: [0.8, 1],
                sheetGrabberVisible: true,
                headerLargeTitle: false,
                headerTitle: "Add product",
              }}
            />
            <Stack.Screen
              name="list/new/scan"
              options={{
                presentation: "fullScreenModal",
                headerLargeTitle: false,
                headerTitle: "Scan QR code",
                headerLeft: () => (
                  <Button variant="ghost" onPress={() => router.back()}>
                    Cancel
                  </Button>
                ),
              }}
            />
            <Stack.Screen
              name="list/[listId]/product/[productId]"
              options={{
                presentation: "formSheet",
                sheetAllowedDetents: [0.75, 1],
                sheetGrabberVisible: true,
                headerLargeTitle: false,
                headerTitle: "Details",
              }}
            />
            <Stack.Screen
              name="list/[listId]/share"
              options={{
                presentation: "formSheet",
                sheetGrabberVisible: true,
                headerLargeTitle: false,
                headerTitle: "Invite",
              }}
            />
            <Stack.Screen
              name="profile"
              options={{
                presentation: "formSheet",
                sheetAllowedDetents: [0.75, 1],
                sheetGrabberVisible: true,
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="emoji-picker"
              options={{
                presentation: "formSheet",
                headerLargeTitle: false,
                headerTitle: "Choose an emoji",
                sheetAllowedDetents: [0.5, 0.75, 1],
                sheetGrabberVisible: true,
              }}
            />
            <Stack.Screen
              name="color-picker"
              options={{
                presentation: "formSheet",
                headerLargeTitle: false,
                headerTitle: "Choose a color",
                sheetAllowedDetents: [0.5, 0.75, 1],
                sheetGrabberVisible: true,
              }}
            />
          </Stack>
        </ListCreationProvider>

        {process.env.EXPO_OS === "web" ? <Inspector /> : null}
      </TinyBaseProvider>
    </SignedIn>
  );
}
