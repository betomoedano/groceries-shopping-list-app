import React from "react";
import { View, ViewStyle } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { zincColors } from "@/constants/Colors";

interface AvatarProps {
  name: string;
  size?: number;
  style?: ViewStyle;
}

export function Avatar({ name, size = 32, style }: AvatarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Get initials from name (first letter of first word and first letter of last word)
  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isDark ? zincColors[700] : zincColors[200],
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <ThemedText
        type="defaultSemiBold"
        style={{
          fontSize: size * 0.4,
          color: isDark ? zincColors[300] : zincColors[600],
        }}
      >
        {initials}
      </ThemedText>
    </View>
  );
}
