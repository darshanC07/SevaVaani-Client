import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CallingScreen" options={{ headerShown: false }} />
      <Stack.Screen name="IncomingCall" options={{ headerShown: false }} />
      <Stack.Screen name="HangUpCallScreen" options={{ headerShown: false }} />
      <Stack.Screen name="CallRoomScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
