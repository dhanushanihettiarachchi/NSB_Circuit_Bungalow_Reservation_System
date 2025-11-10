import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";

const NSB_BLUE = "#060340";
const NSB_GOLD = "#FDB913";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = empId.trim().length > 0 && password.length >= 4;

  return (
    <View style={styles.container}>
      <Image source={require("../assets/nsb-logo-new.png")} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>NSB Reservation System</Text>
      <Text style={styles.subtitle}>Employee Login</Text>

      <TextInput
        placeholder="Employee ID"
        placeholderTextColor="rgba(255,255,255,0.6)"
        value={empId}
        onChangeText={setEmpId}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="rgba(255,255,255,0.6)"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => {
        // next step we’ll add real auth; for now go back to Welcome
        navigation.navigate("Welcome");
        }}
    >
  <Text style={styles.primaryBtnText}>Log In</Text>
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NSB_BLUE, padding: 20, alignItems: "center", justifyContent: "center" },
  logo: { width: 120, height: 120, marginBottom: 14 },
  title: { color: "white", fontSize: 18, fontWeight: "800" },
  subtitle: { color: "rgba(255,255,255,0.85)", marginBottom: 18 },
  input: {
    width: "90%",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    color: "white",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginVertical: 6,
  },
  primaryBtn: {
    width: "90%",
    backgroundColor: NSB_GOLD,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  primaryBtnText: { color: NSB_BLUE, fontWeight: "800" },
  linkBtn: { marginTop: 14 },
  linkText: { color: NSB_GOLD, fontWeight: "700" },
  backBtn: { position: "absolute", left: 16, top: 40, padding: 6 },
  backText: { color: "white", opacity: 0.9, fontWeight: "600" },
});
