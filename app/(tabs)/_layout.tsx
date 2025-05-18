import GlobalHeader from "@/components/GlobalHeader";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useWindowDimensions } from "react-native";

<GlobalHeader />;

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isMobile = width < 800;

  return (
    <>
      <GlobalHeader />
      <Tabs
        screenOptions={{
          headerShown: false, // <-- Add this line to hide the (tabs) header
          tabBarStyle: isMobile
            ? { height: 60, paddingBottom: 6 }
            : { display: "none" },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="login"
          options={{
            title: "Login",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="log-in-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
