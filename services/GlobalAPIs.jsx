import axios from "axios";

const BASE_URL = "http://172.18.59.210:5000";

export const UpdateClientLoc = async (CLIENT_ID, latitude, longitude) => {
  try {
    console.log("Sending location:", { latitude, longitude });
    const response = await axios.post(
      `${BASE_URL}/update_loc/client/${CLIENT_ID}`,
      {
        lat: latitude,
        long: longitude,
      },
      {
        "Content-Type": "application/json",
      },
    );
    console.log("Location update response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Failed to send location:", err);
  }
};

export const fetchNearByWorkers = async (CLIENT_ID) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/get_nearby_workers/${CLIENT_ID}`,
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch nearby workers:", err);
  }
};

export const postJob = async (jobData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/post_job`,
      jobData,
      {
        "Content-Type": "application/json",
      }
    );
    console.log("Job posted successfully:", response.data);
    return response.data;
  } catch (err) {
    console.error("Failed to post job:", err);
    if (err.response) {
      console.error("Error response data:", err.response.data);
      console.error("Error response status:", err.response.status);
    }
    throw err;
  }
};
