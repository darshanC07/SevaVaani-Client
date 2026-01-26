import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="OnBoarding1" options={{ headerShown: false }} />
      <Stack.Screen name="OnBoarding2" options={{ headerShown: false }} />
      <Stack.Screen name="OnBoarding3" options={{ headerShown: false }} />
      <Stack.Screen
        name="registration"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="client"
        options={{ headerShown: false }}
      />

    </Stack>
  );
}
