import { FontAwesome5 } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#94a3b8",

        tabBarStyle: {
          
          backgroundColor: "rgba(15, 23, 42, 0.8)",
          height: 70,

          borderTopWidth: 0,
          elevation: 0, 
        },


        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Weather",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="cloud-sun" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="OpenCamera"
        options={{
          title: "Camera",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="camera" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="cog" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}