import { Redirect } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import { startBackgroundLocation } from "./_layout";
import EventSource from "react-native-sse";
import { BASE_URL } from "@/services/GlobalAPIs";
import { getUserId } from "@/utils/AsyncStorageUtils";
import { useRouter } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import { initExtractorModel, loadVocab } from "@/utils/Extractor";
import { GlobalStatesContext } from "@/contexts/GlobalContext";
import { initModel } from "@/utils/ClassifierService";
import { initLlama, LlamaContext } from 'llama.rn';
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';

const prepareModel = async () => {
  const modelUri = FileSystem.documentDirectory + 'Qwen2.5-0.5B-Instruct-IQ2_M.gguf';
  const info = await FileSystem.getInfoAsync(modelUri);

  if (!info.exists) {
    console.log("Copying model using Expo FS...");
    // This looks for the file in your project's assets (inside assets/images)
    const asset = Asset.fromModule(require('../assets/Qwen2.5-0.5B-Instruct-IQ2_M.gguf'));
    await asset.downloadAsync();
    await FileSystem.copyAsync({
      from: asset.localUri,
      to: modelUri
    });
  }
  return modelUri; // Pass this path to initLlama
};


export default function Index() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const esRef = useRef<EventSource>(null);
  const contextObj = useContext(GlobalStatesContext);
  const [context, setContext] = useState<LlamaContext | null>(null);
  const [status, setStatus] = useState('Initializing...');
  const prepareAndLoadModel = async () => {
    try {
      const DEST_PATH = await prepareModel();

      // 2. Initialize the Llama engine with the local file path
      setStatus('Loading AI Engine...');
      const llamaContext = await initLlama({
        model: DEST_PATH,
        use_mlock: true, // Keep in RAM for speed
        n_ctx: 1024,      // Context size
      });

      contextObj.setContext(llamaContext);
      setStatus('AI Ready (Loaded from Assets)');
      console.log('Model loaded and Llama context initialized successfully');
    } catch (e) {
      console.error(e);
      setStatus('Error: ' + e.message);
    }
  };

  

  async function loadIEModel() {
    await initModel();  //loading the intent classifier model
    await loadVocab();
    // await initExtractorModel();
    await prepareAndLoadModel();
    contextObj.setIeModel(true);
  }

  useEffect(() => {
    let isMounted = true;

    const initSSE = async () => {
      const uid = await getUserId();
      // const uid = "0qD34d7S4FaD6afL6cVN3nOE9zJ2";
      // const uid = "EbQZRH72wnRu2DRpzieDdR9rSvG2";
      if (!uid || !isMounted) return;

      const es: EventSource = new EventSource(`${BASE_URL}/call_events/${uid}`);
      if (es != null) {
        console.log("SSE connection established for user:", uid);
      }
      esRef.current = es;

      es.addEventListener("incoming_call", (event: any) => {
        const data = JSON.parse(event.data);
        console.log("Received incoming call event:", data);
        console.log("Incoming call from:", data.caller_uid);
        if (uid === data.callee_uid) {
          router.push({
            pathname: "/call/IncomingCall",
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
        if (uid === data.caller_uid) {
          router.push("/call/HangUpCallScreen");
        }
      });

      es.addEventListener("call_joined", (event: any) => {
        const data = JSON.parse(event.data);
        console.log("on call joined:", data);
        if (uid === data.user1) {
          router.push({
            pathname: "/call/CallRoomScreen",
            params: {
              CN: data.channelName,
              anotherUserId: data.user2,
              anotherUserName: data.user2_name,
              channelToken: data.token
            },
          });
        } else if (uid === data.user2) {
          router.push({
            pathname: "/call/CallRoomScreen",
            params: {
              CN: data.channelName,
              anotherUserId: data.user1,
              anotherUserName: data.user1_name,
              channelToken: data.token
            },
          });
        }
      });


      es.addEventListener("transcription_result", (event: any) => {
        const data = JSON.parse(event.data);
        console.log("Received transcription result event:", data);
        console.log("my user id:", uid);
        if (uid === data.user1_id || uid === data.user2_id) {
          if (data.transcription === "Transcription failed" || data.transcription === "No transcription available") {
            contextObj.setTranscriptionResult("Sorry, we couldn't transcribe the call.");
            contextObj.setShowTranscription(true);
          }
          let str = data.transcription;
          str = str.replace(/\.\s*$/, "");
          str = str.slice(1, -1);
          let arr = str.split("', '");
          arr[0] = arr[0].replace(/^'/, "");
          arr[arr.length - 1] = arr[arr.length - 1].replace(/'$/, "");
          contextObj.setTranscriptionResult(arr);
          contextObj.setShowTranscription(true);

        }
      });


      es.addEventListener("new_message", (event: any) => {
        const data = JSON.parse(event.data);
        console.log("Received new message event:", data.message);
        contextObj.setMessages((prevMessages) => [...prevMessages, data.message]);
        if (data.message["to"] === uid) {
          data["type"] = "new_message";
          contextObj.setNotifications((prevNotifications) => [...prevNotifications, data]);
        }
      });

      es.addEventListener("new_acceptance", (event: any) => {
        const data = JSON.parse(event.data);
        console.log("Received new acceptance event:", data.message);
        data.acceptance.type = "new_acceptance";
        contextObj.setNotifications((prevNotifications) => [...prevNotifications, data.acceptance]);
      });

      es.addEventListener("new_proposal", (event: any) => {
        const data = JSON.parse(event.data);
        console.log("Received new proposal event:", data.message);
        data.proposal.type = "new_proposal";
        contextObj.setNotifications((prevNotifications) => [...prevNotifications, data.proposal]);
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

    };


    startBackgroundLocation();
    initSSE();
    loadIEModel()
    // return () => {
    //   isMounted = false;
    //   if (esRef.current) {
    //     esRef.current.close();
    //   }
    // };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const uid = await getUserId();
      setUser(uid);
      if (uid === null) {
        router.replace("/login");
      } else {
        router.replace("/client");
      }
    }
    fetchUser();
  }, [user]);


  // return <Redirect href="/registration/EmailScreen" />;
  // return <Redirect href="/client/WorkerRankingScreen" />;
  // return <Redirect href="/client/" />;
  // return <Redirect href="/login/" />;
  // return <Redirect href="/client/JobRequest" />;
  // return <Redirect href="/client/CommunicationRoom" />;
  // return <Redirect href="/call/CallingScreen" />;
  // return <Redirect href="/call/IncomingCall" />;
  // return <Redirect href="/call/CallRoomScreen" />;
  // return <Redirect href="/rooms/" />;
  // return <Redirect href="/AppWriteOTP" />;
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#4560F4' }}>
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold' }}>SevaVaani</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}