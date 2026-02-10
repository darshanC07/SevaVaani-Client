import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import config from "../../config.json";

const EmailScreen = () => {
  const router = useRouter();
  const { role } = useLocalSearchParams();
  let { height, width } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);
  const [uid, setUid] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkUserExists() {
      const uid = await AsyncStorage.getItem("uid");
      if (uid) {
        // router.replace("/home");
        // setUid(uid);
        return;
      }
    }

    checkUserExists();
  }, []);

  async function createUser(email: string, password: string) {
    try {
      setLoading(true);

      const response = await fetch(`${config.serverURL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          role: role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("uid", data.uid);

        router.push({
          pathname: "/registration/EnterMobile",
          params: { uid: data.uid, role: role },
        });
      } else {
        alert(data.error || "Failed to create user");
      }
    } catch (error) {
      console.log("Error creating user:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#4560F4" />
        </View>
      )}

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
          <View style={[styles.line]}>
            <View style={[styles.circle]}>
              <Text style={styles.number}>2</Text>
            </View>
          </View>
          <View style={[styles.line]}>
            <View style={styles.circle}>
              <Text style={styles.number}>3</Text>
            </View>
          </View>
          <View style={[styles.line]}>
            <View style={styles.circle}>
              <Text style={styles.number}>4</Text>
            </View>
          </View>
          <View style={[styles.line]}>
            <View style={styles.circle}>
              <Text style={styles.number}>5</Text>
            </View>
          </View>
        </View>

        <View
          style={[styles.content, { height: height - 170, paddingTop: "25%" }]}
        >
          <View style={styles.textContainer}>
            <Text style={styles.heading}>Create User</Text>
          </View>

          <View style={styles.detailContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLable}>Email</Text>
              <TextInput
                style={styles.inputArea}
                value={email}
                onChangeText={(e) => setEmail(e)}
              ></TextInput>
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLable, { width: 90 }]}>Password</Text>
              <TextInput
                style={[styles.inputArea, { paddingRight: 50 }]}
                value={password}
                onChangeText={(e) => setPassword(e)}
                secureTextEntry={true}
              ></TextInput>
            </View>
            <TouchableOpacity
              style={[
                styles.continueButton,
                { marginTop: 30, opacity: loading ? 0.7 : 1 },
              ]}
              activeOpacity={0.9}
              disabled={loading}
              onPress={() => {
                if (email && password) createUser(email, password);
                else alert("Please enter email and password");
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.continueText}>Continue</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.footer, { display: "none" }]}>
          <TouchableOpacity style={styles.continueButton} activeOpacity={0.9}>
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

export default EmailScreen;

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
    width: "20%",
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
  footer: {
    // paddingTop: 10,
    alignItems: "flex-end",
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
  detailContainer: {
    width: "100%",
    height: "50%",
    // backgroundColor: "pink",
    alignSelf: "center",
    flexDirection: "column",
    // justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    borderBlockColor: "black",
    borderRadius: 10,
    borderWidth: 1,
  },
  inputContainer: {
    width: "93%",
  },
  inputLable: {
    fontSize: 18,
    color: "#0B1B3A",
    position: "relative",
    left: 30,
    top: 20,
    zIndex: 2,
    backgroundColor: "white",
    width: 50,
    fontWeight: "600",
    textAlign: "center",
  },
  inputArea: {
    // backgroundColor: "yellow",
    width: "100%",
    height: 50,
    marginTop: 8,
    borderBlockColor: "black",
    borderRadius: 10,
    borderWidth: 1,
    color: "black",
    fontSize: 18,
    paddingLeft: 10,
  },
  loaderOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(255,255,255,0.6)",
  justifyContent: "center",
  alignItems: "center",
},

});
