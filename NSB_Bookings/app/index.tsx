import { View, Text } from "react-native";

export default function WelcomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#060340" }}>
      <Text style={{ color: "white", fontSize: 22, fontWeight: "700" }}>
        Welcome to NSB Bookings
      </Text>
    </View>
  );
}
