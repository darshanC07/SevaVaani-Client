import React, { use, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, NativeModules, Alert } from 'react-native';
import { initModel, predictIntent } from '../utils/ClassifierService';
import { useRouter } from 'expo-router';
import scripts from '../scripts.json';
const AIChatOverlay = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  const { TTS_module, STT_module } = NativeModules;
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const [result, setResult] = useState('');
  const handleSpeak = async () => {
    try {
      await TTS_module.getMsg("Hello! How can I help you today?");
      let text = await STT_module.getSTTResult();
      console.log("STT Result:", text);
      setSpeechText(text);
      if (!text) {
        Alert.alert("No speech detected", "Please try speaking again.");
        await STT_module.speechStop();
        text = await STT_module.getSTTResult();
      }
      const { intent, confidence } = predictIntent(text);
      setResult(`Intent: ${intent} (${(confidence * 100).toFixed(1)}%)`);
      console.log(`Predicted Intent: ${intent}, Confidence: ${confidence}`);
      if (intent === 'job_post' && confidence > 0.5) {

        await TTS_module.getMsg("Sure! I can help you post a job. Let's get started.");

        let jobData: any = {};

        for (let i = 0; i < scripts.job_post.length; i++) {

          const question = scripts.job_post[i];

          // 1️⃣ Show question in UI
          setResult(prev => prev + `\nAI: ${question}`);
          console.log("Asking:", question);

          // 2️⃣ Speak question
          await TTS_module.getMsg(question);

          // 3️⃣ Start listening
          // await STT_module.startListening?.();

          // 4️⃣ Wait for answer
          let answer = await STT_module.getSTTResult();
          await STT_module.speechStop();

          // 5️⃣ Retry if empty
          if (!answer || answer.trim() === "") {
            i--; // repeat same question
            await TTS_module.getMsg("I didn't catch that. Please say that again.");
            continue;
          }

          console.log("User Answer:", answer);
          setResult(prev => prev + `\nYou: ${answer}`);

          // 6️⃣ Process answer
          jobData[`question_${i}`] = answer;

          // Example custom logic:
          // if (i === 0) jobData.title = answer;
          // if (i === 1) jobData.description = answer;
        }

        console.log("Final Collected Job Data:", jobData);

        await TTS_module.getMsg("Your job has been created successfully!");

        // You can now call API:
        // await createJob(jobData);
      }
      else if (confidence > 0.5) {
        if (intent === 'list_nearby_worker') {
          setResult(prev => prev + "\nFetching nearby workers...");
          await TTS_module.getMsg("Fetching nearby workers...");
          router.push("/client/WorkerRankingScreen");
        }
      }
    } catch (err: any) {
      Alert.alert("STT Error", err?.message ?? String(err));
    }
  }

  useEffect(() => {
    const loadModel = async () => {
      await initModel();
      setIsConversationStarted(true);
    };

    loadModel();
    const unloadModel = async () => {
      await STT_module.speechStop();
    }
    return () => {
      unloadModel();
    }
  }, [])


  useEffect(() => {
    if (isConversationStarted) {
      handleSpeak();
    }
    const unloadModel = async () => {
      await STT_module.speechStop();
    }
    return () => {
      unloadModel();
    }
  }, [isConversationStarted])

  const handleClose = async () => {
    await STT_module.speechStop();
    onClose();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>AI Assistant</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.OverlayContainer}>

        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          <Text style={{ color: 'white', fontSize: 16, marginBottom: 10 }}>
            Hello! How can I help you today?
          </Text>
          <Text style={{ color: 'white', fontSize: 16, marginBottom: 10 }}> {speechText}</Text>
        </ScrollView>

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
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  OverlayContainer: {
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
    backgroundColor: 'transparent',
  },
  messagesContent: {
    padding: 15,
  },
});


