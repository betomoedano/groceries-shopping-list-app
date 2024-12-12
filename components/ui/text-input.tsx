import React from "react";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  useColorScheme,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";

import { ThemedText } from "../ThemedText";
import { zincColors } from "@/constants/Colors";
type InputVariant = "default" | "filled" | "outlined";
type InputSize = "sm" | "md" | "lg";

interface TextInputProps extends Omit<RNTextInputProps, "style"> {
  label?: string;
  error?: string;
  variant?: InputVariant;
  size?: InputSize;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  disabled?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  variant = "default",
  size = "md",
  containerStyle,
  inputStyle,
  disabled = false,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const sizeStyles: Record<
    InputSize,
    { height: number; fontSize: number; padding: number }
  > = {
    sm: { height: 36, fontSize: 14, padding: 8 },
    md: { height: 44, fontSize: 16, padding: 12 },
    lg: { height: 55, fontSize: 16, padding: 16 },
  };

  const getVariantStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius: 13,
      backgroundColor: isDark ? zincColors[800] : zincColors[200],
    };

    switch (variant) {
      case "filled":
        return {
          ...baseStyle,
          backgroundColor: isDark ? zincColors[700] : zincColors[100],
        };
      case "outlined":
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: isDark ? zincColors[600] : zincColors[200],
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = () => {
    if (disabled) {
      return isDark ? zincColors[500] : zincColors[400];
    }
    return isDark ? zincColors[50] : zincColors[900];
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <View style={[getVariantStyle(), disabled && styles.disabled]}>
        <RNTextInput
          style={[
            {
              height: sizeStyles[size].height,
              fontSize: sizeStyles[size].fontSize,
              padding: sizeStyles[size].padding,
              color: getTextColor(),
            },
            inputStyle,
          ]}
          placeholderTextColor={isDark ? zincColors[500] : zincColors[400]}
          editable={!disabled}
          {...props}
        />
      </View>
      {error && <ThemedText style={styles.error}>{error}</ThemedText>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
  },
  error: {
    color: "#ef4444", // red-500
    marginTop: 4,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default TextInput;