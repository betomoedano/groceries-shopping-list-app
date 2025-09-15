import { useEffect } from "react";
import * as Application from "expo-application";
import { useRouter } from "expo-router";
import * as Updates from "expo-updates";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  Share,
  StyleSheet,
  View,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { BodyScrollView } from "@/components/ui/BodyScrollView";
import Button from "@/components/ui/button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { appleBlue, appleGreen, appleRed } from "@/constants/Colors";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { StatusBar } from "expo-status-bar";
import * as Device from "expo-device";

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const { isUpdateAvailable, isUpdatePending } = Updates.useUpdates();

  useEffect(() => {
    if (!Device.isDevice) return;

    Updates.checkForUpdateAsync();
  }, []);

  useEffect(() => {
    if (isUpdatePending) {
      Updates.reloadAsync();
    }
  }, [isUpdatePending]);

  const handleUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
    } catch (error) {
      Alert.alert(
        "Update Failed",
        "Failed to download the update. Please try again."
      );
      console.error(error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: "Check out Shopping List: Sync & Share on the App Store!",
        url: "https://apps.apple.com/us/app/shopping-list-sync-share/id6739513017",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRate = async () => {
    try {
      await Linking.openURL(
        "https://apps.apple.com/us/app/shopping-list-sync-share/id6739513017?action=write-review"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)");
  };

  const handleDeleteAccount = async () => {
    try {
      Alert.alert(
        "Delete account",
        "Are you sure you want to delete your account? This action is irreversible.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              await user?.delete();
              router.replace("/(auth)");
            },
            style: "destructive",
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to delete account");
      console.error(error);
    }
  };

  return (
    <BodyScrollView contentContainerStyle={styles.container}>
      <StatusBar style="light" animated />
      <View>
        <View style={styles.header}>
          {user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              style={styles.profileImage}
            />
          ) : null}
          <View style={styles.userInfo}>
            <ThemedText type="defaultSemiBold" style={styles.email}>
              {user?.emailAddresses[0].emailAddress}
            </ThemedText>
            <ThemedText style={styles.joinDate}>
              Joined {user?.createdAt?.toDateString()}
            </ThemedText>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <Pressable onPress={handleShare} style={styles.actionButton}>
            <IconSymbol name="square.and.arrow.up" color={appleBlue} />
            <ThemedText type="defaultSemiBold" style={{ color: appleBlue }}>
              Share app
            </ThemedText>
          </Pressable>
          <Pressable onPress={handleRate} style={styles.actionButton}>
            <IconSymbol name="star" color={appleBlue} />
            <ThemedText type="defaultSemiBold" style={{ color: appleBlue }}>
              Rate app
            </ThemedText>
          </Pressable>
        </View>
      </View>
      <View style={styles.section}>
        <ThemedText type="defaultSemiBold" style={styles.appTitle}>
          Shopping List: Sync & Share
        </ThemedText>
        <ThemedText type="default" style={styles.version}>
          v{Application.nativeApplicationVersion}
        </ThemedText>
      </View>

      <View style={styles.section}>
        <View style={styles.infoRow}>
          <ThemedText type="defaultSemiBold">Channel</ThemedText>
          <ThemedText type="defaultSemiBold">{Updates.channel}</ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText type="defaultSemiBold">Last update</ThemedText>
          <ThemedText type="default">
            {new Date(Updates.createdAt).toDateString()}
          </ThemedText>
        </View>

        <View style={styles.infoRow}>
          <View style={{ flex: 1 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <ThemedText type="defaultSemiBold">Update ID</ThemedText>
              <ThemedText type="default" style={{ fontSize: 12 }}>
                {Updates.isEmbeddedLaunch ? " (Embedded)" : " (Downloaded)"}
              </ThemedText>
            </View>
            <ThemedText
              type="default"
              style={{ fontSize: 12 }}
              numberOfLines={2}
            >
              {Updates.updateId}
            </ThemedText>
          </View>
        </View>
        {isUpdateAvailable ? (
          <View>
            <ThemedText type="defaultSemiBold" style={styles.updateText}>
              A new update is available!
            </ThemedText>
            <Button variant="ghost" onPress={handleUpdate}>
              Download and install update
            </Button>
          </View>
        ) : (
          <Button
            variant="ghost"
            onPress={() =>
              Alert.alert(
                "✅ All clear!",
                "Even the bugs are taking a day off!"
              )
            }
            textStyle={{ color: appleGreen }}
          >
            No bug fixes available
          </Button>
        )}
      </View>

      <Button
        onPress={handleSignOut}
        variant="ghost"
        textStyle={{ color: appleRed }}
      >
        Sign out
      </Button>

      <Button
        onPress={handleDeleteAccount}
        variant="ghost"
        textStyle={{ color: "gray" }}
      >
        Delete account
      </Button>
    </BodyScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 32,
    gap: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  email: {
    fontSize: 18,
    marginBottom: 4,
  },
  joinDate: {
    opacity: 0.7,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginTop: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  section: {
    backgroundColor: "rgba(150, 150, 150, 0.1)",
    borderRadius: 12,
    padding: 16,
    paddingVertical: 8,
  },
  appTitle: {
    textAlign: "center",
  },
  version: {
    textAlign: "center",
    opacity: 0.7,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  updateText: {
    color: "#34C759",
  },
});
