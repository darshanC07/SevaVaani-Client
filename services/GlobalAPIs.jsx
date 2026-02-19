import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";



export const BASE_URL = "http://10.120.0.210:5000";



export const loginClient = async (email, password) => {

  try {

    console.log("🔑 loginClient: Attempting login for:", email);

    const response = await axios.post(`${BASE_URL}/login`, {

      email,

      password,

      role: "client"

    });

    

    console.log("🔑 loginClient: Login response:", response.data);

    

    // Save auth token if present

    if (response.data.token) {

      await AsyncStorage.setItem('authToken', response.data.token);

      console.log("🔑 loginClient: Token saved to AsyncStorage");

    }

    

    // Save user data if present

    if (response.data.uid) {

      await AsyncStorage.setItem('uid', response.data.uid);

      console.log("🔑 loginClient: User ID saved to AsyncStorage");

    }

    

    return response.data;

  } catch (error) {

    console.error("❌ Login error:", error);

    if (error.response) {

      console.error("❌ Response status:", error.response.status);

      console.error("❌ Response data:", error.response.data);

    }

    throw error;

  }

};



export const loginWorker = async (email, password) => {

  try {

    const response = await axios.post(`${BASE_URL}/login`, {

      email,

      password,

      role: "worker"

    });

    return response.data;

  } catch (error) {

    console.error("Login error:", error);

    throw error;

  }

};



export const registerClient = async (email, password) => {

  try {

    const response = await axios.post(`${BASE_URL}/register`, {

      email,

      password,

      role: "client"

    });

    return response.data;

  } catch (error) {

    console.error("Registration error:", error);

    throw error;

  }

};



export const registerWorker = async (email, password, name, jobType) => {

  try {

    const response = await axios.post(`${BASE_URL}/register`, {

      email,

      password,

      role: "worker",

      name,

      jobType

    });

    return response.data;

  } catch (error) {

    console.error("Registration error:", error);

    throw error;

  }

};



export const fetchJobs = async (userId) => {

  try {

    console.log("📨 fetchJobs: Fetching jobs for user:", userId);

    console.log("📨 fetchJobs: Making request to:", `${BASE_URL}/jobs`);

    

    // Get auth token from AsyncStorage

    const token = await AsyncStorage.getItem('authToken');

    console.log("📨 fetchJobs: Using token:", token ? "exists" : "none");

    

    const headers = token ? { 

      'Authorization': `Bearer ${token}`,

      'Content-Type': 'application/json'

    } : { 'Content-Type': 'application/json' };

    

    const response = await axios.get(`${BASE_URL}/jobs`, {

      headers,

      params: userId ? { user_id: userId } : undefined,

    });

    console.log("📨 fetchJobs: Response status:", response.status);

    console.log("📨 fetchJobs: Response data:", response.data);

    return response.data;

  } catch (error) {

    console.error("❌ Fetch jobs error:", error);

    if (error.response) {

      console.error("❌ Response status:", error.response.status);

      console.error("❌ Response data:", error.response.data);

    }

    throw error;

  }

};



export const postJob = async (jobData) => {

  try {

    const response = await axios.post(`${BASE_URL}/post_job`, jobData);

    return response.data;

  } catch (error) {

    console.error("Post job error:", error);

    throw error;

  }

};



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



export const callUser = async (CLIENT_ID, CLIENT_NAME, WORKER_ID) => {

  try {

    const response = await axios.post(

      `${BASE_URL}/call_user`,

      {

        caller_uid: CLIENT_ID,

        caller_name: CLIENT_NAME,

        callee_uid: WORKER_ID,

      },

      { "Content-Type": "application/json" },

    );

    return response.data;

  } catch (err) {

    console.error("Failed to call worker:", err);

  }

};



export const hangUpCall = async (CALLER_ID) => {

  try {

    const response = await axios.post(

      `${BASE_URL}/hangup_call`,

      { caller_uid: CALLER_ID },

      { "Content-Type": "application/json" },

    );

    return response.data;

  } catch (err) {

    console.error("Failed to hang up call:", err);

  }

};



export const joinCall = async (user1, user1_name, user2, user2_name) => {

  try {

    const response = await axios.post(

      `${BASE_URL}/join_call`,

      {

        user1: user1,

        user1_name: user1_name,

        user2: user2,

        user2_name: user2_name,

      },

      { "Content-Type": "application/json" },

    );

    return response.data;

  } catch (err) {

    console.error("Failed to join call:", err);

  }

};



// Chat API Functions



export const createChat = async (clientUid, workerUid) => {

  try {

    console.log("💬 createChat: Creating chat between client:", clientUid, "and worker:", workerUid);

    const response = await axios.post(`${BASE_URL}/chat/create`, {

      client_uid: clientUid,

      worker_uid: workerUid

    });

    console.log("💬 createChat: Response:", response.data);

    return response.data;

  } catch (error) {

    console.error("❌ Create chat error:", error);

    throw error;

  }

};



export const sendMessage = async (chatId, senderUid, recipientUid, message) => {

  try {

    const response = await axios.post(`${BASE_URL}/chat/send`, {

      chat_id: chatId,

      sender_uid: senderUid,

      recipient_uid: recipientUid,

      message: message

    });

    return response.data;

  } catch (error) {

    console.error("Send message error:", error);

    throw error;

  }

};



export const getMessages = async (chatId) => {

  try {

    console.log("📨 getMessages: Fetching messages for chat:", chatId);

    const response = await axios.get(`${BASE_URL}/chat/${chatId}/messages`);

    console.log("📨 getMessages: Response:", response.data);

    return response.data;

  } catch (error) {

    console.error("❌ Get messages error:", error);

    throw error;

  }

};



export const getMessagesSince = async (chatId, timestamp) => {

  try {

    const response = await axios.get(`${BASE_URL}/chat/${chatId}/messages/since/${timestamp}`);

    return response.data;

  } catch (error) {

    console.error("Get messages since error:", error);

    throw error;

  }

};



export const updateLastSeen = async (userUid) => {

  try {

    const response = await axios.post(`${BASE_URL}/chat/user/${userUid}/last_seen`);

    return response.data;

  } catch (error) {

    console.error("Update last seen error:", error);

    throw error;

  }

};

