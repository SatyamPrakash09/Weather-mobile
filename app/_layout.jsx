import { Stack } from "expo-router";
import "../global.css";
import { StatusBar } from "react-native";

const RootLocator = () => {
  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default RootLocator;
