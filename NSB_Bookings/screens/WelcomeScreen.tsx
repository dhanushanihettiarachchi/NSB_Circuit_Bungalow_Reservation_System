import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";

const NSB_BLUE = "#060340";
const NSB_GOLD = "#FDB913";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

export default function WelcomeScreen({ navigation }: Props) {
  const [hoverLogin, setHoverLogin] = useState(false);
  const [hoverSignup, setHoverSignup] = useState(false);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/nsb-logo-new.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome to NSB Bookings</Text>
      <Text style={styles.subtitle}>Select an option to continue</Text>

      {/* Log In button */}
      <Pressable
        onPress={() => navigation.navigate("Login")}
        onHoverIn={() => setHoverLogin(true)}
        onHoverOut={() => setHoverLogin(false)}
        style={[
          styles.button,
          {
            backgroundColor: hoverLogin ? "#FFD94C" : NSB_GOLD,
            transform: [{ scale: hoverLogin ? 1.05 : 1 }],
          },
        ]}
      >
        <Text style={[styles.buttonText, { color: NSB_BLUE }]}>Log In</Text>
      </Pressable>

      {/* Sign Up button */}
      <Pressable
        onPress={() => navigation.navigate("Signup")}
        onHoverIn={() => setHoverSignup(true)}
        onHoverOut={() => setHoverSignup(false)}
        style={[
          styles.button,
          styles.outlineButton,
          {
            backgroundColor: hoverSignup ? "rgba(253,185,19,0.1)" : "transparent",
            transform: [{ scale: hoverSignup ? 1.05 : 1 }],
          },
        ]}
      >
        <Text style={[styles.buttonText, { color: NSB_GOLD }]}>Sign Up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NSB_BLUE,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    marginTop: 6,
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    width: "80%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 8,
    //transition: "all 0.2s ease-in-out",
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: NSB_GOLD,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
