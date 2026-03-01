import React, { useEffect, useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  NativeModules,
  Alert
} from 'react-native';
import { predictIntent } from '../utils/ClassifierService';
import {
  LoaderKitView
} from 'react-native-loader-kit';
import { useRouter } from 'expo-router';
import { GlobalStatesContext } from '@/contexts/GlobalContext';
import { getUserId } from '@/utils/AsyncStorageUtils';
import { postJob } from '@/services/GlobalAPIs';

type JobExtraction = {
  category: string;
  task: string;
  location: string;
  budget: string;
  urgency: string;
};

type StructuredJobData = {
  job_data: {
    service_type: string | null;
    job_details: string | null;
    location: string | null;
    budget_min: number | null;
    budget_max: number | null;
    description: string | null;
    urgency: string | null;
    user_id?: string | null;
  };
  source_text: string;
};

const AIChatOverlay = ({ onClose }: { onClose: () => void }) => {

  const router = useRouter();
  const { TTS_module, STT_module } = NativeModules;
  const [isListening, setIsListening] = useState(false);
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const scrollviewref = useRef<ScrollView>(null)

  const [user, setUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    { id: number; text: string; sender: "ai" | "user" }[]
  >([]);

  const [loading, setLoading] = useState(false);
  const isActiveRef = useRef(true);

  const contextObj = useContext(GlobalStatesContext);

  const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

  const addMessage = (text: string, sender: "ai" | "user") => {
    setMessages(prev => [
      ...prev,
      { id: Date.now() + Math.random(), text, sender }
    ]);
  };

  const parseExtractionJson = (rawText: string): JobExtraction | null => {
    try {
      const cleaned = rawText.replace(/```json|```/g, '').trim();

      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      const jsonCandidate =
        firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace
          ? cleaned.slice(firstBrace, lastBrace + 1)
          : cleaned;

      const parsed = JSON.parse(jsonCandidate);

      return {
        category: String(parsed?.category ?? '').trim(),
        task: String(parsed?.task ?? '').trim(),
        location: String(parsed?.location ?? '').trim(),
        budget: String(parsed?.budget ?? '').trim(),
        urgency: String(parsed?.urgency ?? '').trim(),
      };
    } catch {
      return null;
    }
  };

  const fetchUser = async () => {
    const uid = await getUserId();
    setUser(uid);
  }

  const parseBudget = (budgetText: string) => {
    const value = budgetText.trim();
    if (!value) {
      return { raw: null, amount: null, currency: null };
    }

    const amountMatch = value.match(/\d+(?:\.\d+)?/);
    const amount = amountMatch ? Number(amountMatch[0]) : null;

    let currency: string | null = null;
    if (/₹|rs\.?|rupees?|inr/i.test(value)) {
      currency = 'INR';
    } else if (/\$/i.test(value)) {
      currency = 'USD';
    }

    return {
      raw: value,
      amount,
      currency,
    };
  };

  const buildStructuredJobData = (
    extracted: JobExtraction,
    sourceText: string
  ): StructuredJobData => {

    const budgetParsed = parseBudget(extracted.budget);

    return {
      job_data: {
        service_type: extracted.category || null,
        job_details: extracted.task || null,
        location: extracted.location || null,
        budget_min: budgetParsed.amount,
        budget_max: budgetParsed.amount,
        description: extracted.task || null,
        urgency: extracted.urgency || null,
      },
      source_text: sourceText,
    };
  };

  const formatExtractionSummary = (result: StructuredJobData) => {
    return `Here is your structured job_data JSON:\n${JSON.stringify(
      result.job_data,
      null,
      2
    )}`;
  };

  const speakAndListen = async (question: string) => {
    try {

      await STT_module.speechStop();

      setIsListening(false)
      await TTS_module.getMsg(question);

      await sleep(700); // allow TTS to fully finish

      setIsListening(true)
      const response = await STT_module.getSTTResult();

      await sleep(700);
      // await STT_module.stopListening();

      setIsListening(false)
      return response || "";

    } catch (error: any) {
      console.log("STT Error:", error);
      return "";
    }
  };

  const runExtraction = async (text: string): Promise<StructuredJobData | null> => {
    console.log("Running extraction for:", text);
    console.log("Current Llama Context:", contextObj.context);
    const llamaContext = contextObj.context as any;
    if (!llamaContext || typeof llamaContext.completion !== 'function') return null;
    setLoading(true);

    // const sentence = "i want plumbers to fix bathroom taps tomorrow immediately in around 500 rupees ....and yes i am living in mumbai";

    console.log("--- STARTING EXTRACTION ---");

    const response = await llamaContext.completion({
      messages: [
        {
          role: 'system',
          content: 'Return ONLY valid JSON, no markdown, no extra text. Use exactly this schema: {"category":"","task":"","location":"","budget":"","urgency":""}. Keep values short plain text. If missing, use empty string.'
        },
        { role: 'user', content: text }
      ],
      n_predict: 150,
    });

    const result = parseExtractionJson(response.text);
    if (result) {
      console.log("--- EXTRACTED POINTS ---");
      console.log("Location:", result.location);
      console.log("Category:", result.category);
      console.log("Amount:", result.budget);
      console.log("------------------------");
      const structuredJobData = buildStructuredJobData(result, text);
      console.log("Structured Job Data JSON:", JSON.stringify(structuredJobData, null, 2));
      setLoading(false);
      return structuredJobData;
    } else {
      console.log("Raw Response:", response.text);
      setLoading(false);
      return null;
    }
  };

  const handleConversation = async () => {
    try {

      await TTS_module.getMsg("Hello! How can I help you today?");
      await sleep(700);

      setIsListening(true);
      let text = await STT_module.getSTTResult();
      setIsListening(false);
      if (!isActiveRef.current) return;
      if (!text) {
        text = await speakAndListen(
          "I didn't catch that. Please say that again."
        );
        if (!isActiveRef.current) return;
      }

      // setSpeechText(text);
      addMessage(text, "user");

      const { intent, confidence } = predictIntent(text);

      console.log(`Intent: ${intent} (${(confidence * 100).toFixed(1)}%)`);

      if ((intent === "job_post" || intent === "post_a_job") && confidence > 0.5) {

        addMessage("Sure! I can help you post a job.", "ai");
        await TTS_module.getMsg(
          "Sure! I can help you post a job."
        );

        await sleep(700);

        let jobData: StructuredJobData | null = null;

        const detailsPrompt = "Please share your job details: what work is needed, location, budget, and urgency.";
        addMessage(detailsPrompt, "ai");
        let answer = await speakAndListen(detailsPrompt);

        if (!isActiveRef.current) return;
        if (!answer.trim()) {
          addMessage("I didn't catch that. Please say that again.", "ai");
          await TTS_module.getMsg(
            "I didn't catch that. Please say that again."
          );
          await sleep(700);
          answer = await speakAndListen(detailsPrompt);
          if (!isActiveRef.current) return;
        }

        addMessage(answer, "user");

        jobData = await runExtraction(answer);

        if (jobData) {
          const summary = formatExtractionSummary(jobData);
          addMessage(summary, "ai");

        } else {
          addMessage("I could not extract all details clearly. Please try again with category, task, location, budget, and urgency.", "ai");
          await TTS_module.getMsg("I could not extract details clearly. Please repeat your job details.");
        }

        await sleep(700);

        if (jobData) {
          const uid = user ?? await getUserId();
          if (!uid) {
            addMessage("I couldn't find your user session. Please login again.", "ai");
            await TTS_module.getMsg("I couldn't find your user session. Please login again.");
            return;
          }

          jobData.job_data.user_id = uid;
          const res = await postJob(jobData.job_data);
          console.log("Job posted successfully:", res);
          addMessage("Your job has been posted successfully!", "ai");
          await TTS_module.getMsg("Your job has been posted successfully!");

          

        }
        console.log("Final Job Data:", jobData);

      }
      else if (confidence > 0.5) {

        if (intent === "list_nearby_worker") {

          await TTS_module.getMsg(
            "Fetching nearby workers..."
          );

          await sleep(500);

          router.push("/client/WorkerRankingScreen");
        }
      } else if (intent === "other") { }

    } catch (error: any) {
      Alert.alert("Error", error?.message ?? String(error));
    }
  };

  useEffect(() => {

    const setup = async () => {
      // await initModel();
      // await loadVocab();
      // await initExtractorModel();
      // await STT_module.initRecognizer(); 
      await fetchUser();
      setIsConversationStarted(true);
      addMessage("Hello! How can I help you today?", "ai");
    };

    setup();

    return () => {
      isActiveRef.current = false;
      STT_module.speechStop();
      TTS_module.stopSpeech();
      // TTS_module.shutdown();
    };

  }, []);

  useEffect(() => {
    if (isConversationStarted) {
      handleConversation();
    }
  }, [isConversationStarted]);

  const handleClose = async () => {
    isActiveRef.current = false;
    try {
      await STT_module.speechStop();
      await TTS_module.stopSpeech();
    } catch (e) {
      console.log(e);
    }

    onClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>AI Assistant</Text>
        <TouchableOpacity onPress={handleClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.overlayContainer}>
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          ref={scrollviewref}
          onContentSizeChange={() => scrollviewref.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                msg.sender === "user"
                  ? styles.userRow
                  : styles.aiRow,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  msg.sender === "user"
                    ? styles.userBubble
                    : styles.aiBubble,
                ]}
              >
                <Text style={{ fontSize: 11, fontWeight: 'bold', textAlign: msg.sender === "ai" ? 'left' : "right" }}>{msg.sender === "ai" ? "Assistant" : "You"}</Text>
                <Text style={styles.messageText}>{msg.text}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        {
          isListening && (
            <View style={{ backgroundColor: 'white', paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 10, alignSelf: 'center', marginBottom: 10, position: 'absolute', bottom: 5 }}>
              <LoaderKitView
                style={{ width: 30, height: 30 }}
                name={'BallPulse'}
                animationSpeedMultiplier={1.0} // speed up/slow down animation, default: 1.0, larger is faster
                color={'blue'} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
              />
            </View>)
        }
      </View>
    </View>
  );
};

export default AIChatOverlay;

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: "row",
    marginBottom: 10,
  },

  userRow: {
    justifyContent: "flex-end",
  },

  aiRow: {
    justifyContent: "flex-start",
  },

  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
  },

  userBubble: {
    backgroundColor: "#ffffff",
    borderTopRightRadius: 0,
  },

  aiBubble: {
    // backgroundColor: "#2E3BBF",
    backgroundColor: "white",
    borderTopLeftRadius: 0,
  },

  messageText: {
    fontSize: 16,
    color: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    width: '90%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#4560F4',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: '#5f76f5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    overflow: 'hidden',
    padding: 10,
    margin: 10,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
  },
  text: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  }
});