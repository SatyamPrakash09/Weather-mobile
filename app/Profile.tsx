import { Link } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  return (
    <SafeAreaView >
      <View  className="">
        <Pressable>
          <Text className="text-2xl text-white ">Profile</Text>
        </Pressable>

        <Link href="/" asChild>
          <Pressable >
            <Text className="text-red-600">
              Home
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

// const styles = StyleSheet.create({});
