import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, NativeModules, Alert } from 'react-native';
import { initModel, predictIntent } from '../utils/ClassifierService';
import { useRouter } from 'expo-router';
import scripts from '../scripts'
const AIChatOverlay = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  const { TTS_module, STT_module } = NativeModules;
  const [speechText, setSpeechText] = useState("");
  const [result, setResult] = useState('');
  const handleSpeak = async () => {
    try {
      const text = await STT_module.getSTTResult();
      console.log("STT Result:", text);
      setSpeechText(text);
      STT_module.speechStop();
      const { intent, confidence } = predictIntent(text);
      setResult(`Intent: ${intent} (${(confidence * 100).toFixed(1)}%)`);
      if (confidence > 0.5) {
        if (intent === 'list_nearby_worker') {
          setResult(prev => prev + "\nFetching nearby workers...");
          TTS_module.getMsg("Fetching nearby workers...");
          router.push("/client/WorkerRankingScreen");
        } else if (intent === 'job_post') {
          TTS_module.getMsg("\nSure! I can help you post a job. Let's get started with the details.");
          for (let i = 0; i < scripts.job_post.length; i++) {
            const question = scripts.job_post[i];
            setResult(prev => prev + `\nAI: ${question}`);
            await TTS_module.getMsg(question);
            STT_module.speechStop();
            const answer = await STT_module.getSTTResult();
            setResult(prev => prev + `\nYou: ${answer}`);
            STT_module.speechStop();
          }
        }
      }
    } catch (err: any) {
      Alert.alert("STT Error", err?.message ?? String(err));
    }
  }

  useEffect(() => {
    initModel()
    handleSpeak();
    return () => {
      STT_module.speechStop();
    }
  }, [])


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>AI Assistant</Text>
        <TouchableOpacity onPress={() => { onClose(); STT_module.speechStop() }} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.OverlayContainer}>

        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          <Text style={{ color: 'white', fontSize: 16, marginBottom: 10 }}>
            Hello! I'm your AI assistant. How can I help you today?
          </Text>
          <Text style={{ color: 'white', fontSize: 16, marginBottom: 10 }}> {speechText} = {result}</Text>
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


