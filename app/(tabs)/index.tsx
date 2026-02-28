import DailyWeatherForecast from "@/components/DailyWeatherForecast";
import MainWeatherData from "@/components/MainWeatherData";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getApiKey } from "../../utils/storage";

export default function WeatherScreen() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyExists, setApiKeyExists] = useState(true);

  const fetchWeatherData = async (params: string) => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = process.env.EXPO_PUBLIC_BASE_URL || "https://weatherx-backend.onrender.com";
      
      const cityMatch = params.match(/q=([^&]*)/);
      const latMatch = params.match(/lat=([^&]*)/);
      const lonMatch = params.match(/lon=([^&]*)/);
      
      let query = "";
      if (cityMatch) query = `city=${cityMatch[1]}`;
      else if (latMatch && lonMatch) query = `lat=${latMatch[1]}&lon=${lonMatch[1]}`;

      // Fetch both weather and forecast in parallel
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`${baseUrl}/weather?${query}`),
        fetch(`${baseUrl}/forecast?${query}`)
      ]);

      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();

      if (weatherRes.ok) {
        setWeather(weatherData.openWeather);
      } else {
        setError(weatherData.error || "Failed to fetch weather");
        setWeather(null);
      }

      if (forecastRes.ok) {
        setForecast(forecastData.weatherApi);
      } else {
        // If forecast fails but weather succeeds, we'll still show weather
        console.error("Forecast failed:", forecastData.error);
        setForecast(null);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };


  // Handling city name searching
  const handleSearch = () => {
    if (!city.trim()) {
      Alert.alert("Error", "Please enter a city name");
      return;
    }
    fetchWeatherData(`q=${encodeURIComponent(city.trim())}`);
  };

  //current location searching
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
      let location: any = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // update the search input with the detected city name
      try {
        const [place] = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        if (place) {
          const name = place.city || place.region || place.name || "";
          if (name) setCity(name);
        }
      } catch (geoErr) {
        console.warn("reverse geocode failed", geoErr);
      }

      fetchWeatherData(`lat=${latitude}&lon=${longitude}`);
    } catch (err) {
      Alert.alert("Error", `Could not get current location: ${err}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkApiKey = async () => {
      const key = await getApiKey();
      setApiKeyExists(!!key);
    };
    checkApiKey();

    const fetchInitialLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return; // Don't show alert here to avoid annoying user on startup
      }

      setLoading(true);
      try {
        let location: any = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // update the search input with the detected city name
        try {
          const [place] = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });
          if (place) {
            const name = place.city || place.region || place.name || "";
            if (name) setCity(name);
          }
        } catch (geoErr) {
          console.warn("reverse geocode failed", geoErr);
        }

        fetchWeatherData(`lat=${latitude}&lon=${longitude}`);
      } catch (err) {
        console.warn("Initial location fetch failed", err);
        setLoading(false);
      }
    };
    fetchInitialLocation();
  }, []);

  
  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-8">
        <View className="flex-row justify-center bg-blue-200 rounded-2xl mb-3">
          <Text className=" mr-1 my-2">
            <Ionicons
              name="cloud"
              color={"#3b82f6"}
              className="font-bold text-2xl "
              size={20}
            />
          </Text>
          <Text className=" mr-1 my-2 font-bold text-2xl">Weather X</Text>
          <Text className=" my-2 font-bold text-xs self-center">-Onix</Text>
        </View>
        <View className="flex-row items-center mb-6 gap-2">
          <View className="flex-1 flex-row items-center bg-white rounded-2xl px-4 py-2 shadow-sm border border-blue-100 ">
            <FontAwesome5 name="map" size={18} color="#94a3b8" />
            <TextInput
              className="flex-1 ml-3 text-gray-800 text-lg py-1"
              placeholder="Search City..."
              value={city}
              onChangeText={setCity}
              onSubmitEditing={handleSearch}
            />
            {/* Clear Text in search box */}
            <TouchableOpacity
              onPress={() => {
                setCity("");
                setWeather(null);
                setForecast(null);
              }}
            >
              <Ionicons name="close-outline" size={18} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className=" bg-blue-500 p-4 rounded-2xl shadow-md active:bg-blue-600"
            onPress={handleSearch}
          >
            <Ionicons name="search" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCurrentLocation}
            className=" bg-blue-500 p-4 rounded-2xl shadow-md active:bg-blue-600"
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
          <View className="flex gap-2">
            <MainWeatherData weather={weather} />
            {forecast?.forecast?.forecastday && (
              <View>
                <DailyWeatherForecast forecast={forecast} />
              </View>
            )}
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
            {!apiKeyExists && (
              <Text className="text-red-400/90 text-center mt-5 px-10">
                If you have not entered an API key, please enter your WeatherApp
                API Key in the settings tab.
              </Text>
            )}
          </View>
        )}
        {/* Weather FOrecast Section */}
      </ScrollView>
    </SafeAreaView>
  );
}
