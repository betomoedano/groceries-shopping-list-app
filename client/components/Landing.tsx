// client/components/landing.tsx
import React from "react";
import { Alert, Image, StyleSheet, View, useColorScheme } from "react-native";
import { ThemedText } from "./ThemedText";
import { BodyScrollView } from "./ui/BodyScrollView";
import Button from "./ui/button";
import { IconSymbol } from "./ui/IconSymbol";
import { appleBlue } from "@/constants/Colors";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";

type LandingProps = {
  onGoogleSignIn: () => void;
  onEmailSignIn: () => void;
  onAppleSignIn?: (
    credential: AppleAuthentication.AppleAuthenticationCredential
  ) => Promise<void>;
  onPrivacyPolicy: () => void;
};

async function createNonce(length = 16) {
  // Generate random bytes
  const bytes = await Crypto.getRandomBytesAsync(length);

  // Convert to hex string
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function Landing({
  onGoogleSignIn,
  onEmailSignIn,
  onAppleSignIn,
  onPrivacyPolicy,
}: LandingProps) {
  const theme = useColorScheme();

  return (
    <BodyScrollView contentContainerStyle={styles.container}>
      <View style={styles.heroSection}>
        <Image
          source={require("../assets/images/icon.png")}
          style={styles.appIcon}
          resizeMode="contain"
        />
        <ThemedText type="title" style={styles.welcomeText}>
          Welcome back!
        </ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.subtitleText}>
          Local-first shopping list app powered by Expo & TinyBase
        </ThemedText>
      </View>

      <View style={styles.actionSection}>
        <Button
          onPress={onGoogleSignIn}
          variant="outline"
          style={styles.button}
        >
          <View style={styles.buttonContent}>
            <Image
              source={require("../assets/images/google-icon.png")}
              style={styles.buttonIcon}
            />
            <ThemedText style={styles.buttonText}>
              Continue with Google
            </ThemedText>
          </View>
        </Button>

        <Button onPress={onEmailSignIn} variant="outline" style={styles.button}>
          <View style={styles.buttonContent}>
            <IconSymbol
              name="envelope"
              color={theme === "dark" ? "white" : "black"}
              style={styles.buttonIcon}
            />
            <ThemedText style={styles.buttonText}>
              Continue with Email
            </ThemedText>
          </View>
        </Button>

        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={
            theme === "dark"
              ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
              : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
          }
          cornerRadius={12}
          style={{ height: 44, width: "100%" }}
          onPress={async () => {
            try {
              const nonce = await createNonce();
              const credential = await AppleAuthentication.signInAsync({
                nonce,
                requestedScopes: [
                  AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                  AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
              });
              await onAppleSignIn(credential);
            } catch (e) {
              if (e.code === "ERR_REQUEST_CANCELED") {
                // handle that the user canceled the sign-in flow
              } else {
                Alert.alert(
                  "Error",
                  "An error occurred while signing in with Apple"
                );
              }
            }
          }}
        />
      </View>

      <View style={styles.footer}>
        <Button
          onPress={onPrivacyPolicy}
          variant="ghost"
          textStyle={styles.privacyPolicyText}
        >
          Privacy Policy
        </Button>
      </View>
    </BodyScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 32,
  },
  heroSection: {
    alignItems: "center",
    gap: 16,
    marginTop: 32,
    marginBottom: 16,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  welcomeText: {
    fontSize: 32,
    textAlign: "center",
  },
  subtitleText: {
    textAlign: "center",
    color: "gray",
    paddingHorizontal: 24,
  },
  actionSection: {
    gap: 16,
  },
  button: {
    marginBottom: 8,
  },
  buttonContent: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  buttonText: {
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
  },
  privacyPolicyText: {
    fontSize: 14,
    color: appleBlue,
  },
});
