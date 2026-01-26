 import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const ProfileSetup = () => {
  const router = useRouter();
  const setupImage = require("../../assets/ProfileSetup/setupImage.png");
  const micImg = require("../../assets/ProfileSetup/mic.png");
  const [showScroll, setShowScroll] = useState(false);
  


  
  
  let { height, width } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);
  return (
    <SafeAreaView
      style={[
        styles.safe,
        {
          height: height,
          marginTop:
            Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0,
        },
      ]}
    >
      <View style={styles.progressContainer}>
        <View style={[styles.line, { backgroundColor: "#4560F4" }]}>
          <View style={[styles.circle, { backgroundColor: "#4560F4" }]}>
            <Text style={styles.number}>1</Text>
          </View>
        </View>
        <View style={[styles.line, { backgroundColor: "#4560F4" }]}>
          <View style={[styles.circle, { backgroundColor: "#4560F4" }]}>
            <Text style={styles.number}>2</Text>
          </View>
        </View>
        <View style={[styles.line, { backgroundColor: "#4560F4" }]}>
          <View style={[styles.circle, { backgroundColor: "#4560F4" }]}>
            <Text style={styles.number}>3</Text>
          </View>
        </View>
        <View style={[styles.line]}>
          <View style={styles.circle}>
            <Text style={styles.number}>4</Text>
          </View>
        </View>
      </View>

      <View
        style={[styles.content, { height: height - 100, paddingTop: "10%" }]}
      >
        <View style={styles.textContainer}>
          <Text style={styles.heading}>Create a Profile</Text>
          <Text style={styles.desc}>
            Talk to our intelligent assistant to personalize your experience
          </Text>
        </View>

        <View style={styles.container}>
           <Image
        style={[styles.image, { width: width * 1, height: 200 }]}
        source={setupImage}
      />
        </View>
        
        {showScroll && (
          <ScrollView style={styles.transcript} contentContainerStyle={{ padding: 12 }}>
            <Text style={styles.transcriptText}>Live Transcription</Text>
          </ScrollView>
        )}

        <View style={styles.micContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.micButton}
            onPress={() => {
              setShowScroll(true);
            }}
          >
            
            <Image source={micImg} style={styles.micIcon} />
          </TouchableOpacity>
        </View>
      </View>
     

      <View style={styles.buttonAbsolute} pointerEvents="box-none">
        <TouchableOpacity
          style={styles.continueButton}
          activeOpacity={0.9}
          onPress={() => {
            router.push("/registration/workerProfile");
          }}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>

    <View style={styles.footer} />
  </SafeAreaView>
  );
};

export default ProfileSetup;

const styles = StyleSheet.create({
  safe: {
    padding: 20,
    backgroundColor: "white",
  },
  progressContainer: {
    flexDirection: "row",
    marginBottom: 18,
  },
  line: {
    backgroundColor: "#D9D9D9",
    width: "25%",
    alignItems: "center",
    height: 5,
    justifyContent: "center",
  },
  circle: {
    backgroundColor: "#D9D9D9",
    borderRadius: 9,
    height: 18,
    width: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  number: {
    fontSize: 10,
    color: "white",
  },
  content: {
    // flex: 1,
    justifyContent: "flex-start",
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0B1B3A",
  },
  desc: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 6,
    textAlign: "center",
  },
  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  countryBox: {
    width: 88,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#F1F5FF",
    justifyContent: "center",
    alignItems: "center",
  },
  countryText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0B1B3A",
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 10,
  },
  mobileBox: {
    flex: 1,
    height: 56,
    justifyContent: "center",
  },
  mobileInput: {
    fontSize: 20,
    color: "#0B1B3A",
    fontWeight: "600",
    paddingVertical: 0,
  },
  footer: {
    // paddingTop: 10,
    alignItems: "flex-end",
  },
  buttonAbsolute: {
    position: "absolute",
    right: 20,
    bottom: 50,
    zIndex: 20,
  },
  continueButton: {
    backgroundColor: "#4560F4",
    width: 170,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  container: {
    flexDirection: "row",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  transcript: {
    backgroundColor: "#F3F4F6",
    width: "100%",
    maxHeight: 140,
    borderRadius: 12,
    marginTop: 12,
  },
  transcriptText: {
    color: "#6b7485ff",
    fontSize: 16,
    textAlign: "center",
    
  },
  micContainer: {
    alignItems: "center",
    marginTop: 20,
    position: "absolute",
    bottom: 280,
    left: 170,
  },
  micButton: {
    width: 68,
    height: 68,
    justifyContent: "center",
    top: 130,
    borderRadius: 100,
    backgroundColor: "#4560F4",
    alignItems: "center",
    position: "absolute",
  },
  micIcon: {
    width: 30,
    height: 40,
    position: "absolute",
  },
});