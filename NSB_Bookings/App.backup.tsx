import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, Animated, Easing } from "react-native";

const NSB_BLUE = "#060340";
const NSB_GOLD = "#FDB913";

export default function App() {
  const [showWelcome, setShowWelcome] = useState(false);

  // Text fade animation
  const textOpacity = useRef(new Animated.Value(0)).current;

  // Progress bar animation (0 ➜ 100%)
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade text in-out loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(textOpacity, { toValue: 1, duration: 900, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
        Animated.timing(textOpacity, { toValue: 0.6, duration: 900, useNativeDriver: true, easing: Easing.inOut(Easing.quad) }),
      ])
    ).start();

    // Progress bar over 5s
    Animated.timing(progress, { toValue: 1, duration: 5000, useNativeDriver: false, easing: Easing.inOut(Easing.quad) }).start();

    // After 5s, move to Welcome (next step we’ll build buttons)
    const t = setTimeout(() => setShowWelcome(true), 5000);
    return () => clearTimeout(t);
  }, []);

  if (showWelcome) {
    // Temporary Welcome placeholder — we’ll add Login/Sign Up next step
    return (
      <View style={styles.welcome}>
        <Text style={styles.welcomeTitle}>Welcome to NSB Bookings</Text>
        <Text style={styles.welcomeSub}>Next step: add Login & Sign Up buttons</Text>
      </View>
    );
  }

  // Splash screen
  const progressWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

  return (
    <View style={styles.container}>
      <Image
        source={require("./assets/nsb-logo-new.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.title, { opacity: textOpacity }]}>
        Welcome to NSB Bookings
      </Animated.Text>

      <ActivityIndicator size="small" color={NSB_GOLD} style={{ marginTop: 12 }} />

      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
      </View>

      <Text style={styles.footer}>Managed by NSB Welfare Division</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: NSB_BLUE, alignItems: "center", justifyContent: "center", paddingHorizontal: 24,
  },
  logo: { width: 160, height: 160, marginBottom: 16 },
  title: { color: "white", fontSize: 22, fontWeight: "700", letterSpacing: 0.5, textAlign: "center" },
  progressTrack: {
    width: "70%", height: 6, backgroundColor: "rgba(253,185,19,0.25)", borderRadius: 3, overflow: "hidden", marginTop: 18,
  },
  progressFill: { height: "100%", backgroundColor: NSB_GOLD },
  footer: { position: "absolute", bottom: 32, color: "rgba(255,255,255,0.8)", fontSize: 12 },
  welcome: { flex: 1, backgroundColor: "#0A0A1A", alignItems: "center", justifyContent: "center", padding: 24 },
  welcomeTitle: { color: "white", fontSize: 22, fontWeight: "700", marginBottom: 6 },
  welcomeSub: { color: "rgba(255,255,255,0.8)", fontSize: 14, textAlign: "center" },
});
