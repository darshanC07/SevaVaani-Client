import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="Profile" options={{ headerShown: false }} />
      <Stack.Screen name="WorkerRankingScreen" options={{ headerShown: false }} />
      <Stack.Screen name="JobRequest" options={{ headerShown: false }} />
      <Stack.Screen name="PostNewJob" options={{headerShown: false}}/>
      <Stack.Screen name="CommunicationRoom" options={{ headerShown: false }} />
      <Stack.Screen name="Notifications" options={{ headerShown: false }} />
      {/* <Stack.Screen name="EnterMobile" options={{ headerShown: false }} />
      <Stack.Screen name="OTPScreen" options={{ headerShown: false }} />
      <Stack.Screen name="EmailScreen" options={{ headerShown: false }} /> */}
    </Stack>
  );
}
