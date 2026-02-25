import { Stack } from "expo-router";
import "../global.css";

const RootLocator = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default RootLocator;
