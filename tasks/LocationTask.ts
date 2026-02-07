import AsyncStorage from "@react-native-async-storage/async-storage";
import * as TaskManager from "expo-task-manager";

export const LOCATION_TASK = "BACKGROUND_LOCATION_TASK";

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
  if (error) return;

  if (!data?.locations?.length) return;

  const user = await AsyncStorage.getItem("uid");
//   if (!user) return;

  const { latitude, longitude } = data.locations[0].coords;

//   await UpdateClientLoc(user, latitude, longitude);
  // await UpdateClientLoc("0qD34d7S4FaD6afL6cVN3nOE9zJ2", latitude, longitude);
});
