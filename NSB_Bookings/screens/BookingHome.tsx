import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { getToken, logout } from "../src/services/auth";

const NSB_BLUE = "#060340";
const NSB_GOLD = "#FDB913";

export default function BookingHome({ navigation }: any) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) {
        Alert.alert("Session", "Please log in again.");
        navigation.replace("Login");
        return;
      }
      setReady(true);
    })();
  }, []);

  if (!ready) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NSB Booking System</Text>
      <Text style={styles.subtitle}>You are logged in ✅</Text>

      {/* Example buttons */}
      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>New Reservation</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>My Reservations</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: "#FF6B6B" }]}
        onPress={async () => {
          await logout();
          navigation.replace("Login");
        }}
      >
        <Text style={[styles.btnText, { color: "white" }]}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NSB_BLUE, padding: 24, paddingTop: 50 },
  title: { fontSize: 22, fontWeight: "800", color: NSB_GOLD, marginBottom: 8 },
  subtitle: { color: "rgba(255,255,255,0.8)", marginBottom: 20 },
  btn: { backgroundColor: NSB_GOLD, paddingVertical: 14, borderRadius: 10, marginBottom: 12, alignItems: "center" },
  btnText: { color: NSB_BLUE, fontSize: 16, fontWeight: "700" },
});
