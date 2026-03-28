import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import config from "../../config.json";
import { ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";

const EmailScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();

  let { height } = useWindowDimensions();
  height = height - (StatusBar.currentHeight || 24);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("uid").then((uid) => {
      if (uid) return;
    });
  }, []);

  const isValid = () => {
    if (!email || !password || !name || !role) return false;
    if (!email.includes("@")) return false;
    if (password.length < 6) return false;
    return true;
  };

  async function createUser() {
    try {
      setLoading(true);

      const response = await fetch(`${config.serverURL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("uid", data.uid);

        router.push({
          pathname: "/registration/EnterMobile",
          params: { uid: data.uid },
        });
      } else {
        alert(data.error || "Failed to create user");
      }
    } catch (error) {
      console.log(error);
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

      <SafeAreaView style={[styles.safe, { height }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
          >
            <Text style={styles.heading}>Create Account</Text>

            <View style={styles.card}>
              <Input label="Full Name" value={name} onChange={setName} />

              <Input
                label="Email"
                value={email}
                onChange={setEmail}
                keyboardType="email-address"
              />

              <Input
                label="Password"
                value={password}
                onChange={setPassword}
                secureTextEntry
              />

              <Input
                label="Work Role"
                value={role}
                onChange={setRole}
                placeholder="Plumber, Electrician..."
              />

              <TouchableOpacity
                style={[
                  styles.button,
                  { opacity: isValid() && !loading ? 1 : 0.5 },
                ]}
                disabled={!isValid() || loading}
                onPress={createUser}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Continue</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};


const Input = ({
  label,
  value,
  onChange,
  secureTextEntry,
  keyboardType,
  placeholder,
}: any) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChange}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      placeholder={placeholder}
      placeholderTextColor="#999"
    />
  </View>
);


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFF",
    paddingHorizontal: 20,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0B1B3A",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
  },
  inputWrapper: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#333",
    fontWeight: "600",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
  },
  button: {
    marginTop: 20,
    height: 48,
    backgroundColor: "#4560F4",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loaderOverlay: {
    position: "absolute",
    zIndex: 10,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EmailScreen;