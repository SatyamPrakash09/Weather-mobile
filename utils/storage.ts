import * as SecureStore from "expo-secure-store";

const API_KEY_STORAGE_KEY = "OPENWEATHER_API_KEY";

export const saveApiKey = async (key: string) => {
  try {
    await SecureStore.setItemAsync(API_KEY_STORAGE_KEY, key);
  } catch (e) {
    console.error("Failed to save API key", e);
  }
};

export const getApiKey = async () => {
  try {
    return await SecureStore.getItemAsync(API_KEY_STORAGE_KEY);
  } catch (e) {
    console.error("Failed to get API key", e);
    return null;
  }
};
