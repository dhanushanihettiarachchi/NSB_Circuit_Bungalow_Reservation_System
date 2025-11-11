import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../App";
import { API_BASE } from "../src/services/config";

const NSB_BLUE = "#060340";
const NSB_GOLD = "#FDB913";

type Props = NativeStackScreenProps<RootStackParamList, "Signup">;

export default function SignupScreen({ navigation }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // form error shown under the fields
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirm)
      return "Please fill in all fields.";
    const emailOk = /\S+@\S+\.\S+/.test(email);
    if (!emailOk) return "Enter a valid email address.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirm) return "Passwords do not match.";
    return null;
  };

  const onSubmit = async () => {
    // clear old error
    setError(null);

    const v = validate();
    if (v) { setError(v); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName:  lastName.trim(),
          email:     email.trim().toLowerCase(),
          password
        })
      });

      // Duplicate email — show friendly message under the form
      if (res.status === 409) {
        setError("This email is already registered. Try logging in.");
        return;
      }

      if (!res.ok) {
        // Try to read server error message if available
        let msg = "Signup failed. Please try again.";
        try {
          const j = await res.json();
          if (j?.message) msg = j.message;
        } catch {}
        setError(msg);
        return;
      }

      // Success
      Alert.alert("Account created successfully", "You can now log in.");
      navigation.navigate("Login");
    } catch (e: any) {
      setError(e?.message ?? "Network error. Check Wi-Fi / Firewall / API URL.");
    } finally {
      setLoading(false);
    }
  };

  const inputErrorStyle = error ? { borderColor: "#FF6B6B" } : null;

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/nsb-logo-new.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Create Your Account</Text>
      <Text style={styles.subtitle}>Join NSB Booking System</Text>

      {/* First Name */}
      <View style={styles.field}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={[styles.input, inputErrorStyle]}
          value={firstName}
          onChangeText={(t)=>{ setFirstName(t); if (error) setError(null); }}
          placeholder="Enter first name"
          placeholderTextColor="rgba(255,255,255,0.6)"
        />
      </View>

      {/* Last Name */}
      <View style={styles.field}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={[styles.input, inputErrorStyle]}
          value={lastName}
          onChangeText={(t)=>{ setLastName(t); if (error) setError(null); }}
          placeholder="Enter last name"
          placeholderTextColor="rgba(255,255,255,0.6)"
        />
      </View>

      {/* Email */}
      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, inputErrorStyle]}
          value={email}
          onChangeText={(t)=>{ setEmail(t); if (error) setError(null); }}
          placeholder="name@nsb.lk"
          placeholderTextColor="rgba(255,255,255,0.6)"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password */}
      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, styles.flex, inputErrorStyle]}
            value={password}
            onChangeText={(t)=>{ setPassword(t); if (error) setError(null); }}
            placeholder="Enter password"
            placeholderTextColor="rgba(255,255,255,0.6)"
            secureTextEntry={!showPwd}
          />
          <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPwd((p) => !p)}>
            <Text style={styles.eyeText}>{showPwd ? "Hide" : "Show"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirm Password */}
      <View style={styles.field}>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, styles.flex, inputErrorStyle]}
            value={confirm}
            onChangeText={(t)=>{ setConfirm(t); if (error) setError(null); }}
            placeholder="Re-enter password"
            placeholderTextColor="rgba(255,255,255,0.6)"
            secureTextEntry={!showConfirmPwd}
          />
          <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirmPwd((p) => !p)}>
            <Text style={styles.eyeText}>{showConfirmPwd ? "Hide" : "Show"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
        onPress={onSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={NSB_BLUE} />
        ) : (
          <Text style={styles.primaryBtnText}>Create Account</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NSB_BLUE,
    paddingHorizontal: 24,
    paddingTop: 50,
  },
  logo: { width: 120, height: 120, alignSelf: "center", marginBottom: 10 },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: NSB_GOLD,
    textAlign: "center",
  },
  subtitle: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginBottom: 24,
  },
  field: { marginBottom: 14 },
  label: {
    fontSize: 14,
    color: NSB_GOLD,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: "white",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  passwordRow: { flexDirection: "row", alignItems: "center" },
  flex: { flex: 1 },
  eyeBtn: {
    marginLeft: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: NSB_GOLD,
  },
  eyeText: { color: NSB_GOLD, fontWeight: "600" },
  error: {
    color: "#FF6B6B",
    marginTop: 4,
    marginBottom: 8,
    textAlign: "center",
  },
  primaryBtn: {
    backgroundColor: NSB_GOLD,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  primaryBtnText: {
    color: NSB_BLUE,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
  linkBtn: { alignSelf: "center", marginTop: 16 },
  linkText: { color: NSB_GOLD, fontWeight: "600" },
});
