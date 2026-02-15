import React from "react";
import { Stack } from "expo-router";
import { PostsProvider } from "../context/PostsContext";

export default function RootLayout() {
  return (
    <PostsProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </PostsProvider>
  );
}