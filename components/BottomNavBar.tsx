import { Image, StyleSheet, Text, View, TouchableOpacity, Modal, Platform, NativeModules, Alert, Pressable } from "react-native";
import React, { use, useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AIChatOverlay from "./AIChatOverlay";
import { GlobalStatesContext } from "@/contexts/GlobalContext";
import LongPressMessageWindow from "./LongPressMessageWindow";
import LoaderKitView from "react-native-loader-kit";

const BottomNavBar = () => {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(false);
  const contextObj = useContext(GlobalStatesContext);
  const [isLongPressed, setIsLongPressed] = useState(false);
  const [intent, setIntent] = useState("");
  const [intentConfidence, setIntentConfidence] = useState(0);
  // const showLoading = !contextObj.isIemodelLoaded;
  const showLoading = false;


  const handleLongPress = async () => {
    if (!contextObj.isIemodelLoaded) {
      Alert.alert("Processing", "The assistant is still loading. Please wait a moment and try again.");
      return;
    }
    setIsLongPressed(true);
  }

  const handleIntent = async () => {
    if (intent === "list_nearby_worker" || intent === "ranking_workers") {
      router.push('/client/WorkerRankingScreen');
    } else if (intent === "view_profile") {
      router.push('/client/Profile');
    } else if (intent === "job_post") {
      router.push('/client/PostNewJob');
    }

  }

  useEffect(() => {
    if (intent.length != 0 && intentConfidence > 0.1) {
      handleIntent();
    }
  }, [intent, intentConfidence])

  return (
    <View style={styles.bg}>
      <View>
        <TouchableOpacity onPress={() => router.push('/client')} >
          <Image
            source={require("../assets/BottomNavBar/Home.png")}
            style={styles.icon}
          />
          <Text style={{ color: "white", fontSize: 10, textAlign: "center" }}>Home</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Image
          source={require("../assets/BottomNavBar/Business.png")}
          style={styles.icon}
        />
        <Text style={{ color: "white", fontSize: 10, textAlign: "center" }}>Request</Text>
      </View>
      <TouchableOpacity
        style={{
          position: 'relative',
          bottom: 20,
          backgroundColor: "#4560F4",
          borderRadius: 35,
          borderColor: 'white',
          borderWidth: 1,
          width: 70,
          height: 70,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onPress={() => {
          if (!contextObj.isIemodelLoaded) {
            Alert.alert("Processing", "The assistant is still loading. Please wait a moment and try again.");
            return;
          } else {
            setShowOverlay(true)
          }
        }
        }
        onLongPress={handleLongPress}
        onPressOut={() => {
          if (isLongPressed) {
            setIsLongPressed(false);
          }
        }}
      >
        <Image
          source={require("../assets/BottomNavBar/Microphone.png")}
          style={[styles.icon, { width: 42, height: 42 }]}
        />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={showLoading}
        animationType="fade"
        onRequestClose={() => {
          // console.log("attempt to close modal") 
        }}
      >
        <Pressable
          style={styles.loadingModalOverlay}
          onPress={() => {
            //  console.log("attempt to close modal")
          }}
        >
          <View style={styles.modalView}>
            <Text style={{ color: 'black', fontSize: 16 }}>Loading Assistant</Text>
            <LoaderKitView
              style={{ width: 50, height: 50 }}
              name={"BallSpinFadeLoader"}
              animationSpeedMultiplier={1.0} // speed up/slow down animation, default: 1.0, larger is faster
              color={"blue"} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
            />
          </View>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showOverlay}
        onRequestClose={() => setShowOverlay(false)}
      >
        <View style={styles.modalOverlay}>
          <AIChatOverlay onClose={() => setShowOverlay(false)} />
        </View>
      </Modal>
      <TouchableOpacity style={{ alignItems: "center" }} onPress={() => router.push('/client/ChatList')}>
        <Image
          source={require("../assets/BottomNavBar/chat.png")}
          style={styles.icon}
        />
        <Text style={{ color: "white", fontSize: 10, textAlign: "center" }}>Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/client/Profile' as any)} >
        <Image
          source={require("../assets/BottomNavBar/user.png")}
          style={styles.icon}
        /><Text style={{ color: "white", fontSize: 10, textAlign: "center" }}>Profile</Text>
      </TouchableOpacity>

      {isLongPressed && <LongPressMessageWindow intentSetter={setIntent} confidenceSetter={setIntentConfidence} />}
    </View>
  );
};

export default BottomNavBar;

const styles = StyleSheet.create({
  bg: {
    height: 60,
    backgroundColor: "#4560F4",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 30,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },

  icon: {
    height: 30,
    width: 30,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add a semi-transparent background
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 30,
    gap: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
