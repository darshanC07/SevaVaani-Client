import { predictIntent } from "@/utils/ClassifierService";
import React, { useEffect, useState } from "react";
import { NativeModules, Text, View } from "react-native";
import { LoaderKitView } from "react-native-loader-kit";

export default function LongPressMessageWindow({ intentSetter, confidenceSetter }) {
  const { TTS_module, STT_module } = NativeModules;
  const [message, setMessage] = useState("");

  const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

  const listen = async () => {
    try {
      await STT_module.speechStop();
      await sleep(300);
      // setIsListening(true);
      const response = await STT_module.getSTTResult();
      await sleep(700);
      return response || "";
    } catch (e) {
      console.log("STT Error:", e);
      return "";
    }
  };

  const handleUserCommand = async () => {
    // await TTS_module.getMsg("Hello! How can I assist you today?");
    const text = await listen();
    setMessage(text);
    const { intent, confidence } = predictIntent(text);
    console.log(`Intent: ${intent} (${(confidence * 100).toFixed(1)}%)`);
    if (confidence < 0.1) {
      await TTS_module.getMsg("I'm sorry, I didn't understand that. Could you please rephrase?");
      setMessage("");
      confidenceSetter(0);
      intentSetter("");
    } else {
      intentSetter(intent);
      confidenceSetter(confidence);
    }

  };
  useEffect(() => {
    try {
      handleUserCommand();
    } catch (e) {
      console.log("Error in LongPressMessageWindow useEffect: ", e);
    }

    return () => {
      TTS_module.stopSpeech();
      STT_module.speechStop();
    };
  }, []);
  return (
    <View
      style={{
        position: "absolute",
        bottom: 65,
        left: message === "" ? "38%" : "19%",
        maxWidth: "80%",
        width: message === "" ? "50%" : "80%",
        gap: 6,
      }}
    >
      <View
        style={{
          padding: 10,
          backgroundColor: "white",
          borderRadius: 10,
          borderColor: "grey",
          borderWidth: 1,
          alignItems: "center",
          // paddingHorizontal: message === "" ? 40 : 10,
          // paddingVertical: message === "" ? 8 : 10,
        }}
      >
        {message === "" ? (
          <LoaderKitView
            style={{ width: 30, height: 30 }}
            name={"BallPulse"}
            animationSpeedMultiplier={1.0} // speed up/slow down animation, default: 1.0, larger is faster
            color={"blue"} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
          />
        ) : (
          <Text style={{ color: "black" }}>{message}</Text>
        )}
      </View>
      <View>
        <View
          style={{
            width: 13,
            height: 13,
            borderRadius: "50%",
            backgroundColor: "black",
            left: "72%",
          }}
        />
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: "black",
            left: "68%",
          }}
        />
        <View
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            backgroundColor: "black",
            left: "64%",
          }}
        />
      </View>
    </View>
  );
}
