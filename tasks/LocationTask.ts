import * as TaskManager from "expo-task-manager";
import { UpdateClientLoc } from "../services/GlobalAPIs";
import { getUserId } from "../utils/AsyncStorageUtils";

export const LOCATION_TASK = "BACKGROUND_LOCATION_TASK";

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
  if (error) return;

  if (!data?.locations?.length) return;

  const user = await getUserId();
//   if (!user) return;

  console.log("Received new location data:", data.locations);
  const { latitude, longitude } = data.locations[0].coords;

  await UpdateClientLoc(user, latitude, longitude);
  // await UpdateClientLoc("0qD34d7S4FaD6afL6cVN3nOE9zJ2", latitude, longitude);
});
