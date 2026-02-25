import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
// import { Pressable } from "react-native";
import { Link } from "expo-router";

import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getApiKey, saveApiKey } from "../../utils/storage";

export default function SettingsScreen() {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadKey = async () => {
      const savedKey = await getApiKey();
      if (savedKey) {
        setApiKey(savedKey);
      }
      setIsLoading(false);
    };
    loadKey();
  }, []);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      Alert.alert("Error", "Please enter a valid API key");
      return;
    }
    await saveApiKey(apiKey.trim());
    Alert.alert("Success", "API Key saved successfully");
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-6 py-8"
        >
          <View className="items-center mb-8">
            <View className="bg-blue-100 p-4 rounded-full mb-4">
              <FontAwesome5 name="cog" size={40} color="#3b82f6" />
            </View>
            <Text className="text-3xl font-bold text-gray-800">Settings</Text>
            <Text className="text-gray-500 text-center mt-2">
              Configure your OpenWeather API settings here.
            </Text>
          </View>

          <View className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <Text className="text-gray-700 font-semibold mb-3">
              OpenWeather API Key
            </Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 mb-6"
              placeholder="Enter your API key"
              value={apiKey}
              onChangeText={setApiKey}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={true}
            />

            <TouchableOpacity
              onPress={handleSave}
              className="bg-blue-500 py-4 rounded-xl shadow-md active:bg-blue-600"
            >
              <Text className="text-white text-center font-bold text-lg">
                Save Settings
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-8 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
            <View className="flex-row items-center mb-2">
              <FontAwesome5 name="info-circle" size={16} color="#ca8a04" />
              <Text className="ml-2 font-bold text-yellow-800">
                Need an API key?
              </Text>
            </View>
            <Text className="text-yellow-700 text-sm">
              You can get a free API key by signing up at{" "}
                <Link href="https://openweathermap.org" asChild>
                  <Text className="text-blue-500 underline">
                    openweathermap.org
                  </Text>
                </Link>
              .
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
