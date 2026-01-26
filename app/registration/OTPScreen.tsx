import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Keyboard,
} from "react-native";
import React, { useState, useRef, use } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import config from "../../config.json";

const OTPScreen = () => {
  const {number,uid} = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const otpInputRef = useRef<TextInput>(null);
  let { height, width } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

  async function handleVerifyOtp() {
    if (otp.length === 4) {
      console.log("Verifying OTP:", otp);
      const res = await fetch(config.serverURL + "/verify_phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entered_otp: otp,
          uid: uid,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log("OTP verified successfully");
        alert("OTP verified successfully");
          
      } else {
        console.log("OTP verification failed:", data.message);
        alert("OTP verification failed: " + data.message);
      }
    }
  }
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
          <Text style={styles.heading}>Enter verification code</Text>
          <Text style={styles.desc}>We have sent you a 4-digit code on</Text>
          <Text style={{ fontSize: 20, marginTop: 10, fontWeight: "bold" }}>
            +91 {number}
          </Text>
        </View>

        <View style={styles.inputCard}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.otpRow}
            onPress={() => {
              Keyboard.dismiss();
              setTimeout(() => {
                otpInputRef.current?.focus();
              }, 50);
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={[styles.otpBox, otp[i] ? styles.otpBoxFilled : null]}
              >
                <Text style={styles.otpText}>{otp[i] || ""}</Text>
              </View>
            ))}
          </TouchableOpacity>

          <TextInput
            ref={otpInputRef}
            value={otp}
            onChangeText={(t) => {
              const digits = t.replace(/[^0-9]/g, "").slice(0, 4);
              setOtp(digits);
              if (digits.length === 4) otpInputRef.current?.blur();
            }}
            keyboardType="number-pad"
            maxLength={4}
            style={styles.hiddenInput}
            autoFocus={false}
            caretHidden
            showSoftInputOnFocus={true}
            selection={{ start: otp.length, end: otp.length }}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} activeOpacity={0.9} onPress={()=>handleVerifyOtp()}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OTPScreen;

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
    position: "relative",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    paddingHorizontal: 6,
    // backgroundColor:'pink',
    // zIndex:5
  },
  otpBox: {
    width: 64,
    height: 64,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 6,
  },
  otpBoxFilled: {
    borderColor: "#4560F4",
    backgroundColor: "#F1F5FF",
  },
  otpText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0B1B3A",
  },
  hiddenInput: {
    position: "absolute",
    left: 0,
    top: 0,
    height: 1,
    width: 1,
    opacity: 0,
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
});
