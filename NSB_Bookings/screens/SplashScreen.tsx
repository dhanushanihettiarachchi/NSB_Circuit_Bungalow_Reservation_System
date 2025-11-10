import React, { useEffect } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";

const NSB_BLUE = "#060340";
const NSB_GOLD = "#FDB913";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace("Welcome"), 6000); // 3s
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: NSB_BLUE, alignItems: "center", justifyContent: "center", gap: 12 }}>
      <Image
        source={require("../assets/nsb-logo-new.png")} // adjust if your file is in assets/images/nsb/
        style={{ width: 160, height: 160 }}
        resizeMode="contain"
      />
      <Text style={{ color: "white", fontSize: 20, fontWeight: "700" }}>Welcome to NSB Bookings</Text>
      <ActivityIndicator color={NSB_GOLD} />
    </View>
  );
}
