import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Image, Text, View } from "react-native";

const MainWeatherData = ({ weather }: any) => {
  if (!weather) return null;
  return (
    <View className="flex mt-6">
      <Text className="text-right font-bold text-sm">
        -- {new Date(weather.dt * 1000).toDateString()}
      </Text>
      <View className="items-center mt-2">
        <Text className="text-3xl font-bold ">{weather.name}</Text>
        <Text className="font-extrabold text-7xl">
          {Math.floor(weather.main.temp)}°
        </Text>
        <Text className="text-2xl"> {weather.weather[0].description}</Text>
      </View>
      <View className="flex-row justify-around mt-3 w-full px-6 items-center">
        <View className="flex-row">
          <Text className="px-3">{weather.wind.speed} km/h</Text>
          <Feather name="wind" size={24} color="black" />
        </View>

        <View className="flex-row items-center">
          <Text className="px-3">{weather.main.humidity} %</Text>
          <Image
            className="h-[35] w-[35] self-start"
            source={require("../assets/images/humidity.png")}
          />
        </View>
        {/* <Text>{weather.wind.speed} km/h</Text> */}
      </View>
    </View>
  );
};

export default MainWeatherData;
