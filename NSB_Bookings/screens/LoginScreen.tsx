import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, Image
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";
import { loginApi, saveToken } from "../src/services/auth"; // uses API_BASE inside

const NSB_BLUE = "#060340";
const NSB_GOLD = "#FDB913";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.trim() || !password) return "Enter email and password.";
    const ok = /\S+@\S+\.\S+/.test(email);
    if (!ok) return "Enter a valid email address.";
    return null;
  };

  const onLogin = async () => {
    const v = validate();
    if (v) { Alert.alert("Invalid", v); return; }

    setLoading(true);
    try {
      console.log("[Login] sending request…");
      const data = await loginApi(email, password); // -> { token, user }
      console.log("[Login] success:", data);

      await saveToken(data.token);

      // ✅ NAVIGATE: route name must match App.tsx
      navigation.replace("BookingHome");
    } catch (e: any) {
      console.log("[Login] error:", e?.message);
      Alert.alert("Login failed", e?.message ?? "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/nsb-logo-new.png")} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Log in to NSB Booking System</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="name@nsb.lk"
          placeholderTextColor="rgba(255,255,255,0.6)"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          placeholderTextColor="rgba(255,255,255,0.6)"
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
        onPress={onLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color={NSB_BLUE} /> : <Text style={styles.primaryBtnText}>Log In</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.linkText}>Create a new account →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NSB_BLUE, paddingHorizontal: 24, paddingTop: 50 },
  logo: { width: 120, height: 120, alignSelf: "center", marginBottom: 10 },
  title: { fontSize: 22, fontWeight: "800", color: NSB_GOLD, textAlign: "center" },
  subtitle: { color: "rgba(255,255,255,0.7)", textAlign: "center", marginBottom: 24 },
  field: { marginBottom: 14 },
  label: { fontSize: 14, color: NSB_GOLD, marginBottom: 6, fontWeight: "600" },
  input: {
    borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 12, fontSize: 15, color: "white",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  primaryBtn: { backgroundColor: NSB_GOLD, paddingVertical: 14, borderRadius: 10, marginTop: 8 },
  primaryBtnText: { color: NSB_BLUE, textAlign: "center", fontSize: 16, fontWeight: "700" },
  linkBtn: { alignSelf: "center", marginTop: 16 },
  linkText: { color: NSB_GOLD, fontWeight: "600" },
});
