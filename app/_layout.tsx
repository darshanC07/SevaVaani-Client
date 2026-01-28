import * as Location from "expo-location";
import { Stack } from "expo-router";
import { Platform } from "react-native";
import "../tasks/LocationTask";
const LOCATION_TASK = "BACKGROUND_LOCATION_TASK";


// this is for background location update in db
export const startBackgroundLocation = async () => {
  console.log("Requesting location permissions...");
  const fg = await Location.requestForegroundPermissionsAsync();
  if (!fg.granted) {
    console.log("Foreground location permission denied");
    return;
  }

  const bg = await Location.requestBackgroundPermissionsAsync();
  if (!bg.granted) {
    console.log(
      "Please allow background location from Settings for live tracking."
    );
    return;
  }


  const hasStarted = await Location.hasStartedLocationUpdatesAsync(
    LOCATION_TASK
  );
  console.log("Has location tracking started:", hasStarted);
  if (hasStarted) {
    stopBackgroundLocation();
  };

  console.log("Starting background location tracking...");

  await Location.startLocationUpdatesAsync(LOCATION_TASK, {
    accuracy: Location.Accuracy.High,
    timeInterval: 15000,
    distanceInterval: 10,
    pausesUpdatesAutomatically: false,
    activityType:
      Platform.OS === "android"
        ? Location.LocationActivityType.OtherNavigation
        : undefined,
    foregroundService: {
      notificationTitle: "Location Tracking",
      notificationBody: "Tracking your location in background",
    },
  });

  console.log("Background location tracking started");
};

const stopBackgroundLocation = async () => {
  const hasStarted = await Location.hasStartedLocationUpdatesAsync(
    LOCATION_TASK
  );
  if (hasStarted) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK);
    console.log("Background location tracking stopped");
  }
};


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
