import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // hide headers for splash, login, signup
      }}
    />
  );
}
