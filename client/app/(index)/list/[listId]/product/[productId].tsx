import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { View, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ThemedText } from "@/components/ThemedText";
import { BodyScrollView } from "@/components/ui/BodyScrollView";
import TextInput from "@/components/ui/text-input";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Avatar } from "@/components/ui/Avatar";
import { useColorScheme } from "@/hooks/useColorScheme";
import { zincColors, Colors } from "@/constants/Colors";
import { formatFriendlyDate } from "@/utils/dateUtils";
import {
  useShoppingListProductCell,
  useShoppingListProductCreatedByNickname,
  useShoppingListUserNicknames,
} from "@/stores/ShoppingListStore";

export default function ProductScreen() {
  const { listId, productId } = useLocalSearchParams() as {
    listId: string;
    productId: string;
  };

  // Check if the product exists by trying to get any of its properties
  const [name] = useShoppingListProductCell(listId, productId, "name");

  // If the product doesn't exist anymore, redirect to the list
  React.useEffect(() => {
    if (name === undefined) {
      router.replace(`/list/${listId}`);
    }
  }, [listId, name]);

  // If the product is deleted, show nothing while redirecting
  if (name === undefined) {
    return null;
  }

  return <ProductContent listId={listId} productId={productId} />;
}

function ProductContent({
  listId,
  productId,
}: {
  listId: string;
  productId: string;
}) {
  const [name, setName] = useShoppingListProductCell(listId, productId, "name");
  const [quantity, setQuantity] = useShoppingListProductCell(
    listId,
    productId,
    "quantity"
  );
  const [units, setUnits] = useShoppingListProductCell(
    listId,
    productId,
    "units"
  );
  const [notes, setNotes] = useShoppingListProductCell(
    listId,
    productId,
    "notes"
  );
  const createdBy = useShoppingListProductCreatedByNickname(listId, productId);
  const [createdAt] = useShoppingListProductCell(
    listId,
    productId,
    "createdAt"
  );
  const userNicknames = useShoppingListUserNicknames(listId);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleInviteCollaborators = () => {
    // Navigate to share screen
    router.push(`/list/${listId}/share`);
  };

  return (
    <BodyScrollView
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 100,
      }}
    >
      <StatusBar style="light" animated />
      
      <SectionHeader title="GENERAL" />
      <View style={{ gap: 20, marginBottom: 64 }}>
        <FieldItem 
          label="Product name" 
          value={name} 
          onChangeText={setName} 
        />
        <FieldItem
          label="Quantity"
          value={quantity.toString()}
          onChangeText={(value) => setQuantity(Number(value))}
        />
        <FieldItem label="Units" value={units} onChangeText={setUnits} />
        
        {/* Notes field with improved styling */}
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <ThemedText type="defaultSemiBold" style={{ fontSize: 16 }}>
              Notes
            </ThemedText>
          </View>
          <TextInput
            value={notes || ""}
            editable={true}
            onChangeText={setNotes}
            variant="default"
            placeholder="Add a note..."
            multiline
            numberOfLines={4}
            inputStyle={{
              minHeight: 120,
              textAlignVertical: "top",
              paddingTop: 12,
              backgroundColor: isDark ? zincColors[800] : zincColors[50],
              borderRadius: 8,
            }}
            containerStyle={{
              backgroundColor: isDark ? zincColors[800] : zincColors[50],
              borderRadius: 8,
              borderWidth: 1,
              borderColor: isDark ? zincColors[700] : zincColors[200],
            }}
          />
        </View>
      </View>

      {/* META Section */}
      <SectionHeader title="META" />
      <View style={{ gap: 20, marginBottom: 20 }}>
        <FieldItem label="Created by" value={createdBy ?? "unknown"} />
        <FieldItem
          label="Created at"
          value={createdAt ? formatFriendlyDate(createdAt) : "unknown"}
        />
      </View>

      {/* SHARING Section */}
      <SectionHeader title="SHARING" />
      <View style={{ gap: 16 }}>
        {/* User avatars */}
        <View style={{ 
          flexDirection: "row", 
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12 
        }}>
          {userNicknames.map((nickname) => (
            <Avatar key={nickname} name={nickname} size={36} />
          ))}
          
          {/* Add collaborator button */}
          <TouchableOpacity
            onPress={handleInviteCollaborators}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: isDark ? zincColors[700] : zincColors[200],
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: isDark ? zincColors[600] : zincColors[300],
              borderStyle: "dashed",
            }}
          >
            <IconSymbol
              name="plus"
              size={16}
              color={isDark ? zincColors[400] : zincColors[500]}
            />
          </TouchableOpacity>
        </View>
        
        {/* User names */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {userNicknames.map((nickname, index) => (
            <ThemedText 
              key={nickname} 
              type="default"
              style={{ 
                color: isDark ? zincColors[400] : zincColors[600],
                fontSize: 14 
              }}
            >
              {nickname}
              {index < userNicknames.length - 1 ? ", " : ""}
            </ThemedText>
          ))}
        </View>
      </View>
    </BodyScrollView>
  );
}

function SectionHeader({ title }: { title: string }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  
  return (
    <ThemedText 
      type="defaultSemiBold" 
      style={{ 
        fontSize: 12,
        color: isDark ? zincColors[400] : zincColors[500],
        letterSpacing: 0.5,
        marginBottom: 16,
        marginTop: 20,
      }}
    >
      {title}
    </ThemedText>
  );
}

function FieldItem({
  label,
  value,
  onChangeText,
  showEditIcon = false,
}: {
  label: string;
  value: string;
  onChangeText?: (value: string) => void;
  showEditIcon?: boolean;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        minHeight: 44,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
        <ThemedText type="defaultSemiBold" style={{ fontSize: 16 }}>
          {label}
        </ThemedText>
        {showEditIcon && onChangeText && (
          <IconSymbol
            name="pencil"
            size={16}
            color={isDark ? zincColors[400] : zincColors[500]}
          />
        )}
      </View>
      
      <TextInput
        value={value}
        editable={onChangeText !== undefined}
        onChangeText={onChangeText}
        variant="ghost"
        placeholder="..."
        size="sm"
        containerStyle={{ maxWidth: "60%", minWidth: 100 }}
        inputStyle={{ 
          padding: 0, 
          margin: 0, 
          textAlign: "right",
          fontSize: 16,
          color: isDark ? zincColors[300] : zincColors[600],
        }}
      />
    </View>
  );
}
