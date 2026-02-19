import { BASE_URL } from "@/services/GlobalAPIs";
import { getUserId } from "@/utils/AsyncStorageUtils";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import EventSource from "react-native-sse";
import { startBackgroundLocation } from "./_layout";

export default function Index() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const esRef = useRef<EventSource>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Checking user authentication...");
        const uid = await getUserId();
        console.log("User ID found:", uid);
        setUser(uid);
        
        if (uid === null) {
          console.log("No user found, redirecting to login");
          router.replace("/login" as any);
        } else {
          console.log("User found, redirecting to client");
          router.replace("/client");
        }
      } catch (error) {
        console.error("Error checking user authentication:", error);
        router.replace("/login" as any);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    let isMounted = true;

    const initSSE = async () => {
      try {
        console.log("Initializing SSE connection for user:", user);
        const es: EventSource = new EventSource(`${BASE_URL}/call_events/${user}`);
        if (es != null) {
          console.log("SSE connection established for user:", user);
        }
        esRef.current = es;

        es.addEventListener("incoming_call", (event: any) => {
          const data = JSON.parse(event.data);
          console.log("Received incoming call event:", data);
          if (user === data.callee_uid) {
            router.push({
              pathname: "/call/IncomingCall" as any,
              params: {
                caller_uid: data.caller_uid,
                caller_name: data.caller_name,
              },
            });
          }
        });

        es.addEventListener("call_hangup", (event: any) => {
          const data = JSON.parse(event.data);
          console.log("on call ended or hang up:", data);
          if (user === data.caller_uid) {
            router.push("/call/HangUpCallScreen" as any);
          }
        });

        es.addEventListener("call_joined", (event: any) => {
          const data = JSON.parse(event.data);
          console.log("on call joined:", data);
          if (user === data.user1) {
            router.push({
              pathname: "/call/CallRoomScreen" as any,
              params: {
                CN: data.channelName,
                anotherUserId: data.user2,
                anotherUserName: data.user2_name,
              },
            } as any);
          } else if (user === data.user2) {
            router.push({
              pathname: "/call/CallRoomScreen" as any,
              params: {
                CN: data.channelName,
                anotherUserId: data.user1,
                anotherUserName: data.user1_name,
              },
            } as any);
          }
        });

        es.addEventListener("connected", (event: any) => {
          const data = JSON.parse(event.data);
          console.log("event connected:", data);
        });

        es.onerror = (err: any) => {
          console.log("SSE error", err);
        };

        es.onopen = () => {
          console.log("SSE connected");
        };
      } catch (error) {
        console.error("Error initializing SSE:", error);
      }
    };

    startBackgroundLocation();
    initSSE();

    return () => {
      isMounted = false;
      if (esRef.current) {
        esRef.current.close();
      }
    };
  }, [user]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return null;
}