import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CATEGORY_DETAILS } from "../constants/categories";

type Props = {
  category: string;
};

export default function CategoryBadge({ category }: Props) {
  const categoryData =
    CATEGORY_DETAILS[category as keyof typeof CATEGORY_DETAILS];

  if (!categoryData) return null;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: categoryData.color }
      ]}
    >
      <Text style={styles.text}>
        {category.charAt(0)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14
  }
});