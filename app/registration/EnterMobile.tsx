import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  NativeModules,
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

const EnterMobile = () => {
  const { OTPRequester } = NativeModules;
  const router = useRouter();
  const { uid, role } = useLocalSearchParams();
  const [countryCode, setCountryCode] = useState("91");
  const [mobile, setMobile] = useState("");
  let { height, width } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

  async function handleContinue() {
    if (mobile.length == 10 && uid) {
      if (!OTPRequester) {
        alert("OTP service not available. Skipping OTP verification.");
        router.push({pathname:"/registration/OTPScreen", params:{number:mobile,uid:uid,role:role}});
        return;
      }
      const text = await OTPRequester.requestOTP(uid);
      if(text === "success"){
        router.push({pathname:"/registration/OTPScreen", params:{number:mobile,uid:uid,role:role}});
      } else{
        alert("Failed to request OTP. Please try again.");
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
          <Text style={styles.heading}>Verify your mobile number</Text>
          <Text style={styles.desc}>
            We’ll send a one-time code to this number
          </Text>
        </View>

        <View style={styles.inputCard}>
          <TouchableOpacity style={styles.countryBox} activeOpacity={0.8}>
            <Text style={styles.countryText}>+{countryCode}</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.mobileBox}>
            <TextInput
              value={mobile}
              onChangeText={(t) => setMobile(t.replace(/[^0-9]/g, ""))}
              keyboardType="phone-pad"
              maxLength={10}
              placeholder="Enter mobile number"
              placeholderTextColor="#999"
              style={styles.mobileInput}
              returnKeyType="done"
            />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          activeOpacity={0.9}
          onPress={() => {
            handleContinue();
          }}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EnterMobile;

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
