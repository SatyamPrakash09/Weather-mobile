import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";

import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid, 
  Platform,
  Pressable
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OpenCamera() {

  // Camera facing: front / back
  const [facing, setFacing] = useState<CameraType>("back");

  // Torch
  const [torch, setTorch] = useState(false);

  // Camera permissions
  const [permission, requestPermission] = useCameraPermissions();

  //Auto Focus
  const [focusPoint, setFocusPoint] = useState<{x:number,y:number} | null>(null);

  // Media permissions
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions({writeOnly:true});

  // Camera ref
  const cameraRef = useRef<CameraView | null>(null);

  // ============================
  // Save Photo To Gallery
  // ============================
  const savePhoto = async (uri: string) => {
    if (mediaPermission?.status !== "granted") {
      const permission = await requestMediaPermission();
      if (!permission.granted) {
        alert("Permission required to save photos");
        return;
      }
    }

    try {
      await MediaLibrary.saveToLibraryAsync(uri);
      if(Platform.OS === "android"){
        ToastAndroid.show("Saved to Gallery", ToastAndroid.SHORT)
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ============================
  // Take Photo
  // ============================
  const takePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync();
      await savePhoto(photo.uri);
    } catch (err) {
      console.log(err);
    }
  };

  // ============================
  // Toggle Camera
  // ============================
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  // ============================
  // Toggle Torch
  // ============================
  const toggleTorch = () => {
    setTorch((prev) => !prev);
  };

  // ============================
  // Permissions Loading
  // ============================
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1">
          <View style={styles.container} className="items-center justify-center">
            <Text style={styles.message}>
              We need permission to use your camera
            </Text>
            <Pressable className="bg-blue-500 px-3 py-2 rounded-lg" onPress={requestPermission}>
              <Text className="text-white font-bold text-lg">
                Grant Permission
              </Text>
            </Pressable>
          </View>
      </SafeAreaView>
    );
  }
  // Handles Manual Focus of the camera
  const handleFocus = (event:any)=>{
    const { locationX, locationY } = event.nativeEvent;
    setFocusPoint({ x: locationX, y: locationY });
    setTimeout(() => setFocusPoint(null), 800);
  };
  // ============================
  // UI
  // ============================
  return (
    <View style={styles.container}>
      <Pressable style={{flex:1}} onPress={(event) => handleFocus(event)}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          enableTorch={torch}
          autofocus="on"
          
          />
      </Pressable>

      <View style={styles.buttonContainer}>

        {/* Flip Camera */}
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Ionicons name="camera-reverse" size={36} color="white" />
        </TouchableOpacity>

        {/* Capture */}
        <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
          <Ionicons name="camera" size={48} color="white" />
        </TouchableOpacity>

        {/* Torch */}
        <TouchableOpacity style={styles.button} onPress={toggleTorch}>
          <FontAwesome5
            name="bolt"
            size={32}
            color={torch ? "yellow" : "white"}
          />
        </TouchableOpacity>

      </View>

    </View>
  );
}

// ============================
// Styles
// ============================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: "white",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  button: {
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});