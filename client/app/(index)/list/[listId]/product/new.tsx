import React, { useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Platform, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { BodyScrollView } from "@/components/ui/BodyScrollView";
import Button from "@/components/ui/button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TextInput from "@/components/ui/text-input";
import { useAddShoppingListProductCallback } from "@/stores/ShoppingListStore";

export default function NewItemScreen() {
  const { listId } = useLocalSearchParams() as { listId: string };
  const [name, setName] = useState("");
  const [units, setUnits] = useState("kg");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);

  const router = useRouter();
  const addShoppingListProduct = useAddShoppingListProductCallback(listId);

  const handleCreateProduct = () => {
    if (!name.trim()) {
      Alert.alert(
        "📝 Product title required",
        "🛒 Please provide a product title to add it to your shopping list.",
        [{ text: "OK" }]
      );
      return;
    }

    addShoppingListProduct(name.trim(), quantity, units, notes);

    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerLargeTitle: false,
          headerTitle: "Add product",
          headerRight: () => (
            <Button
              variant="ghost"
              onPress={handleCreateProduct}
              disabled={!name.trim()}
            >
              Save
            </Button>
          ),
          headerLeft: () => (
            <Button variant="ghost" onPress={router.back}>
              Cancel
            </Button>
          ),
        }}
      />
      <BodyScrollView
        contentContainerStyle={{
          padding: 16,
        }}
      >
        <TextInput
          label="Name"
          placeholder="Potatoes"
          value={name}
          onChangeText={setName}
          autoFocus={true}
          onSubmitEditing={handleCreateProduct}
          returnKeyType="done"
        />
        <TextInput
          label="Units"
          placeholder="kg"
          value={units}
          onChangeText={setUnits}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ThemedText>
            x{quantity} {units}
          </ThemedText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Button
              onPress={() => setQuantity(Math.max(0, quantity - 1))}
              variant="ghost"
            >
              <IconSymbol name="minus" color={"gray"} />
            </Button>
            <Button onPress={() => setQuantity(quantity + 1)} variant="ghost">
              <IconSymbol name="plus" color={"gray"} />
            </Button>
          </View>
        </View>
        <TextInput
          label="Notes"
          placeholder="Potatoes are good"
          textAlignVertical="top"
          value={notes}
          multiline={true}
          numberOfLines={4}
          inputStyle={{
            height: 100,
          }}
          onChangeText={setNotes}
        />
        {Platform.OS !== "ios" && (
          <Button onPress={handleCreateProduct} disabled={!name.trim()}>
            Add product
          </Button>
        )}
      </BodyScrollView>
    </>
  );
}
