import axios from "axios";

export const BASE_URL = "https://30vkdstn-5000.inc1.devtunnels.ms";

export const loginClient = async (email, password) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/login`,
      { email: email, password: password, role: "client" },
      { "Content-Type": "application/json" },
    );
    return response.data;
  } catch (err) {
    console.error("Login failed:", err);
    throw err;
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

export const fetchNearByWorkers = async (CLIENT_ID, lang) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${lang}/get_nearby_workers/${CLIENT_ID}`,
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

export const postJob = async (jobData) => {
  try {
    const response = await axios.post(`${BASE_URL}/post_job`, jobData, {
      "Content-Type": "application/json",
    });
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

export const fetchJobs = async (userId, lang) => {
  try {
    console.log("Fetching jobs for userId:", userId);
    const response = await axios.get(
      `${BASE_URL}/${lang}/jobs/client/${userId}`,
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch jobs:", err);
    throw err;
  }
};

export const activityOnProposal = async (
  jobId,
  workerId,
  requestId,
  status,
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/proposal`,
      {
        job_id: jobId,
        worker_id: workerId,
        request_id: requestId,
        status: status,
      },
      {
        "Content-Type": "application/json",
      },
    );
    return response.data;
  } catch (err) {
    console.error("Failed to perform activity on proposal:", err);
    throw err;
  }
};

export const fetchWorkerDetails = async (WORKER_ID, lang) => {
  try {
    const response = await axios.get(`${BASE_URL}/${lang}/worker/${WORKER_ID}`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch worker details:", err);
    throw err;
  }
};

export const fetchJobDetails = async (JOB_ID, lang) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${lang}/get_job_details/${JOB_ID}`,
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch job details:", err);
    throw err;
  }
};

export const createChat = async (clientUid, workerUid) => {
  try {
    console.log("Creating chat for clientUid:", clientUid);
    console.log("Creating chat for workerUid:", workerUid);
    const response = await axios.post(`${BASE_URL}/chat/create`, {
      client_uid: clientUid,
      worker_uid: workerUid,
      role: "client",
    });

    return response.data;
  } catch (error) {
    console.error("Create chat error:", error);
    throw error;
  }
};

export const sendMessage = async (chatId, senderUid, recipientUid, message) => {
  try {
    const response = await axios.post(`${BASE_URL}/chat/send`, {
      chat_id: chatId,
      sender_uid: senderUid,
      recipient_uid: recipientUid,
      message: message,
    });

    return response.data;
  } catch (error) {
    console.error("Send message error:", error);

    throw error;
  }
};

export const getMessages = async (chatId) => {
  try {
    const response = await axios.get(`${BASE_URL}/chat/${chatId}/messages`);

    return response.data;
  } catch (error) {
    console.error("Get messages error:", error);

    throw error;
  }
};

export const getMessagesSince = async (chatId, timestamp) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/chat/${chatId}/messages/since/${timestamp}`,
    );

    return response.data;
  } catch (error) {
    console.error("Get messages since error:", error);

    throw error;
  }
};

export const updateLastSeen = async (userUid) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/chat/user/${userUid}/last_seen`,
    );

    return response.data;
  } catch (error) {
    console.error("Update last seen error:", error);

    throw error;
  }
};

export const createRazorpayOrder = async (amount, notes = null) => {
  try {
    const response = await fetch(`${BASE_URL}/payment/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        amount,
        notes: notes || undefined,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Create order failed: ${errorText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Create Razorpay order failed:", err);
    throw err;
  }
};

export const verifyRazorpayPayment = async (
  orderId,
  paymentId,
  signature,
  jobId,
  amount,
  clientId,
  clientName,
  workerId,
  workerName,
) => {
  try {
    const response = await fetch(`${BASE_URL}/payment/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        order_id: orderId,
        payment_id: paymentId,
        signature: signature,
        job_id: jobId,
        amount: amount,
        client_id: clientId,
        client_name: clientName,
        worker_id: workerId,
        worker_name: workerName,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Payment verification failed: ${errorText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Verify Razorpay payment failed:", err);
    throw err;
  }
};

export const getChatList = async (CLIENT_ID, lang) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${lang}/get_chat_list/client/${CLIENT_ID}`,
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch chat list:", err);
    return null;
  }
};
