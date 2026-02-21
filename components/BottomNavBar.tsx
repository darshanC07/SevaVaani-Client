import { Image, StyleSheet, Text, View, TouchableOpacity, Modal, Platform, NativeModules, Alert } from "react-native";
import React, { useContext, useState } from "react";
import { useRouter } from "expo-router";
import AIChatOverlay from "./AIChatOverlay";
import { GlobalStatesContext } from "@/contexts/GlobalContext";

const BottomNavBar = () => {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(false);
  const contextObj = useContext(GlobalStatesContext);

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
          if (contextObj.iemodel == null) {
            Alert.alert("Processing", "The assistant is still loading. Please wait a moment and try again.");
            return;
          } else {
            setShowOverlay(true)
          }
        }
        }
      // onPress={handleSpeak}
      >
        <Image
          source={require("../assets/BottomNavBar/Microphone.png")}
          style={[styles.icon, { width: 42, height: 42 }]}
        />
      </TouchableOpacity>

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
      <View>
        <Image
          source={require("../assets/BottomNavBar/chat.png")}
          style={styles.icon}
        />
        <Text style={{ color: "white", fontSize: 10, textAlign: "center" }}>Chat</Text>
      </View>
      <TouchableOpacity onPress={() => router.push('/client/Profile' as any)} >
        <Image
          source={require("../assets/BottomNavBar/user.png")}
          style={styles.icon}
        /><Text style={{ color: "white", fontSize: 10, textAlign: "center" }}>Profile</Text>
      </TouchableOpacity>

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
});
