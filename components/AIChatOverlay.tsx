import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  NativeModules,
  Alert
} from 'react-native';
import { initModel, predictIntent } from '../utils/ClassifierService';
// import { initExtractorModel, predictAnswer,loadVocab } from '../utils/Extractor';
import {
  LoaderKitView
} from 'react-native-loader-kit';
import { useRouter } from 'expo-router';
import scripts from '../scripts.json';
import { predictAnswer } from '@/utils/Extractor';

const AIChatOverlay = ({ onClose }: { onClose: () => void }) => {

  const router = useRouter();
  const { TTS_module, STT_module } = NativeModules;
  const [isListening, setIsListening] = useState(false);
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const [result, setResult] = useState("");

  const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

  // ===============================
  // SAFE SPEAK + LISTEN
  // ===============================
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

  // ===============================
  // MAIN CONVERSATION
  // ===============================
  const handleConversation = async () => {
    try {

      let text = await speakAndListen(
        "Hello! How can I help you today?"
      );

      if (!text) {
        text = await speakAndListen(
          "I didn't catch that. Please say that again."
        );
      }

      setSpeechText(text);

      const { intent, confidence } = predictIntent(text);

      setResult(`Intent: ${intent} (${(confidence * 100).toFixed(1)}%)`);

      // ===============================
      // JOB POST FLOW
      // ===============================
      if (intent === "job_post" && confidence > 0.5) {

        await TTS_module.getMsg(
          "Sure! I can help you post a job."
        );

        await sleep(700);

        let jobData: any = {};

        for (let i = 0; i < scripts.job_post.length; i++) {

          const question = scripts.job_post[i];

          setResult(prev => prev + `\nAI: ${question}`);

          let answer = await speakAndListen(question);

          if (!answer.trim()) {
            await TTS_module.getMsg(
              "I didn't catch that. Please say that again."
            );
            await sleep(700);
            i--;
            continue;
          }

          setResult(prev => prev + `\nYou: ${answer}`);

          switch (i) {
            case 0:
              const jobTitle = await predictAnswer("What is the job title?", answer);
              jobData["job_details"] = jobTitle;
              break;
            case 1:
              // const jobDescription = await predictAnswer("What is the job description?", answer);
              jobData["description"] = answer;
              break;
            case 2:
              const jobLocation = await predictAnswer("What is the job location?", answer);
              jobData["location"] = jobLocation;
              break;
            case 3:
              const jobBudget = await predictAnswer("What is the job budget?", answer);
              jobData["budget_max"] = jobBudget;
              break;
            case 4:
              const jobDuration = await predictAnswer("What is the job duration?", answer);
              jobData["duration"] = jobDuration;
              break;
            default:
              jobData["special_note"] = answer;
          }
        }

        await TTS_module.getMsg(
          "Your job has been created successfully!"
        );

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
      await initModel();
      // await loadVocab();
      // await initExtractorModel();
      // await STT_module.initRecognizer(); 
      setIsConversationStarted(true);
    };

    setup();

    return () => {
      STT_module.speechStop();
      // STT_module.destroyRecognizer();
    };

  }, []);

  useEffect(() => {
    if (isConversationStarted) {
      handleConversation();
    }
  }, [isConversationStarted]);

  const handleClose = async () => {
    await STT_module.speechStop();
    // await STT_module.destroyRecognizer();
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
        >
          <Text style={styles.text}>
            Hello! How can I help you today?
          </Text>
          <Text style={styles.text}>
            {speechText}
          </Text>
          <Text style={styles.text}>
            {result}
          </Text>
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
    backgroundColor: '#4560F4',
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