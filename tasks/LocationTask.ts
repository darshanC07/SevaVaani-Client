import AsyncStorage from "@react-native-async-storage/async-storage";
import * as TaskManager from "expo-task-manager";
import { UpdateClientLoc } from "../services/GlobalAPIs";

export const LOCATION_TASK = "BACKGROUND_LOCATION_TASK";

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
  if (error) return;

  if (!data?.locations?.length) return;

  const user = await AsyncStorage.getItem("uid");
//   if (!user) return;

  const { latitude, longitude } = data.locations[0].coords;

//   await UpdateClientLoc(user, latitude, longitude);
  await UpdateClientLoc("kXArdkSbtHhrAFVxMIsyR1lXeWF2", latitude, longitude);
});
