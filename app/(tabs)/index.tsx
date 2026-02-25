import MainWeatherData from "@/components/MainWeatherData";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getApiKey } from "../../utils/storage";

export default function WeatherScreen() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (params: string) => {
    const api = await getApiKey();
    if (!api) {
      Alert.alert(
        "API Key Missing",
        "Please go to Settings and enter your OpenWeather API key.",
      );
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?${params}&units=metric&appid=${api}`,
      );
      const data = await response.json();

      if (response.ok) {
        setWeather(data);
      } else {
        setError(data.message || "Failed to fetch weather");
        setWeather(null);
      }
    } catch (err) {
      setError(`${err},An error occurred. Please try again.`);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!city.trim()) {
      Alert.alert("Error", "Please enter a city name");
      return;
    }
    fetchWeather(`q=${encodeURIComponent(city.trim())}`);
  };

  const handleCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access location was denied",
      );
      return;
    }

    setLoading(true);
    try {
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      fetchWeather(`lat=${latitude}&lon=${longitude}`);
    } catch (err) {
      Alert.alert(`${err}, Error", "Could not get current location`);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-8">
        <View className="flex-row justify-center bg-blue-200 rounded-2xl mb-3">
          <Text className=" mr-1 my-2 font-bold text-2xl">Weather X</Text> 
          <Text className=" my-2 font-bold text-xs self-center">-Onix</Text> 

        </View>
        <View className="flex-row items-center mb-6">
          <View className="flex-1 flex-row items-center bg-white rounded-2xl px-4 py-2 shadow-sm border border-blue-100">
            <FontAwesome5 name="search" size={18} color="#94a3b8" />
            <TextInput
              className="flex-1 ml-3 text-gray-800 text-lg py-1"
              placeholder="Search City..."
              value={city}
              onChangeText={setCity}
              onSubmitEditing={handleSearch}
            />
          </View>
          <TouchableOpacity
            onPress={handleCurrentLocation}
            className="ml-3 bg-blue-500 p-4 rounded-2xl shadow-md active:bg-blue-600"
          >
            <FontAwesome5 name="location-arrow" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="mt-4 text-blue-500 font-medium">
              Fetching Weather...
            </Text>
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center px-6">
            <View className="bg-red-100 p-4 rounded-full mb-4">
              <FontAwesome5
                name="exclamation-triangle"
                size={30}
                color="#ef4444"
              />
            </View>
            <Text className="text-red-600 text-center text-lg font-bold">
              Error
            </Text>
            <Text className="text-red-500 text-center mt-1">{error}</Text>
            <TouchableOpacity
              onPress={() => setError(null)}
              className="mt-6 bg-white px-6 py-2 rounded-full border border-red-200"
            >
              <Text className="text-red-500 font-bold">Clear</Text>
            </TouchableOpacity>
          </View>
        ) : weather ? (
          <View className="flex-1">
            <MainWeatherData weather={weather} />
          </View>
        ) : (
          <View className="flex-1 justify-center items-center">
            <View className="bg-blue-100 p-8 rounded-full mb-6">
              <FontAwesome5 name="cloud-sun" size={60} color="#3b82f6" />
            </View>
            <Text className="text-blue-800 text-2xl font-bold">
              Weather App
            </Text>
            <Text className="text-blue-500 text-center mt-2 px-10">
              Enter a city name or use your current location to see the weather.
            </Text>
            {(!getApiKey)&&(
              <Text className="text-red-400/90 text-center mt-5 px-10">
                If you have not entered api key , Please Enter your WeatherApp API Key in the text box under setting tab.
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
