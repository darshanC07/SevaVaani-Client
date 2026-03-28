import { StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions, Image, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Fontisto, EvilIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { loginClient } from '@/services/GlobalAPIs';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from "../../config.json";

const { width } = Dimensions.get('window');

const index = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLoginIn() {
    try {
      setLoading(true);
      const response = await loginClient(email, password);
      // response = JSON.parse(response);
      console.log("Login response:", response);
      if (response["code"] === 200) {
        await AsyncStorage.setItem("userId", response["user"].uid);
        await AsyncStorage.setItem("name", response["user"].name);
        await AsyncStorage.setItem("email", response["user"].email);
        router.replace("/");
      } else {
        alert("Login failed: " + response["error"]);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    }
    finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    try {
      setLoading(true);

      const response = await fetch(`${config.serverURL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email : email,
          password : password,
          role : "client",
          name : name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("userId", data.uid);
        await AsyncStorage.setItem("name", name);
        await AsyncStorage.setItem("email", email);
        router.replace("/client");
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

      <SafeAreaProvider style={{ flex: 1 }}>
        <SafeAreaView style={styles.mainContainer}>

          <View style={styles.upperContainer}>
            <Text style={styles.hello}>Hello!</Text>
            <Text style={styles.welcome}>Welcome back to SevaVaani</Text>
          </View>

          {
            !isNewUser ?
              <View style={styles.loginContainer}>
                <Text style={styles.loginTitle}>Login</Text>

                <View style={styles.formGroup}>
                  <View style={styles.inputWrapper}>
                    <Fontisto name="email" size={18} color="#6c80f2" />
                    <TextInput
                      placeholder='Email Address'
                      placeholderTextColor='#999'
                      style={styles.inputField}
                      onChangeText={setEmail}
                      value={email}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <EvilIcons name="lock" size={28} color="#6c80f2" style={{ marginLeft: -4 }} />
                    <TextInput
                      placeholder='Password'
                      placeholderTextColor='#999'
                      style={styles.inputField}
                      onChangeText={setPassword}
                      value={password}
                      secureTextEntry
                    />
                  </View>

                  {/* <TouchableOpacity>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity> */}
                </View>

                <TouchableOpacity style={styles.loginButton} activeOpacity={0.8} onPress={handleLoginIn}>
                  <Text style={styles.loginButtonText}>LOGIN</Text>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                  <View style={styles.line} />
                  <Text style={styles.orText}>OR</Text>
                  <View style={styles.line} />
                </View>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Don't have an account? </Text>
                  <TouchableOpacity onPress={() => setIsNewUser(!isNewUser)}>
                    <Text style={styles.signUpText}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </View> :
              <View style={styles.loginContainer}>
                <Text style={styles.loginTitle}>Register</Text>

                <View style={styles.formGroup}>
                  <View style={styles.inputWrapper}>
                    <AntDesign name="idcard" size={18} color="#6c80f2" />
                    <TextInput
                      placeholder='Full Name'
                      placeholderTextColor='#999'
                      style={styles.inputField}
                      onChangeText={setName}
                      value={name}
                      autoCapitalize="none"
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <Fontisto name="email" size={18} color="#6c80f2" />
                    <TextInput
                      placeholder='Email Address'
                      placeholderTextColor='#999'
                      style={styles.inputField}
                      onChangeText={setEmail}
                      value={email}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <EvilIcons name="lock" size={28} color="#6c80f2" style={{ marginLeft: -4 }} />
                    <TextInput
                      placeholder='Password'
                      placeholderTextColor='#999'
                      style={styles.inputField}
                      onChangeText={setPassword}
                      value={password}
                      secureTextEntry
                    />
                  </View>

                  {/* <View style={styles.inputWrapper}>
                    <Image source={require("@/assets/roles/worker.png")} style={{ width: 24, height: 18, tintColor: '#6c80f2' }} />
                    <TextInput
                      placeholder='Work Role (Plumber, Electrician...)'
                      placeholderTextColor='#999'
                      style={styles.inputField}
                      onChangeText={setRole}
                      value={role}
                      autoCapitalize="none"
                    />
                  </View> */}
                </View>

                <TouchableOpacity style={styles.loginButton} activeOpacity={0.8} onPress={handleRegister}>
                  <Text style={styles.loginButtonText}>Register</Text>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                  <View style={styles.line} />
                  <Text style={styles.orText}>OR</Text>
                  <View style={styles.line} />
                </View>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => setIsNewUser(!isNewUser)}>
                    <Text style={styles.signUpText}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
          }
        </SafeAreaView>
      </SafeAreaProvider></>
  );
};

export default index;

const styles = StyleSheet.create({
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
  mainContainer: {
    flex: 1,
    // backgroundColor: '#6c80f2', 
    backgroundColor: '#4560F4',
    padding: 0
  },
  upperContainer: {
    paddingHorizontal: 30,
    marginTop: '20%',
    height: '15%',
    justifyContent: 'center',
  },
  hello: {
    fontSize: 42,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 1,
  },
  welcome: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
    fontWeight: '500',
  },
  loginContainer: {
    backgroundColor: '#F8F9FB',
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 30,
  },
  formGroup: {
    gap: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 60,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    // Subtle shadow for inputs
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  inputField: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  forgotText: {
    alignSelf: 'flex-end',
    color: '#6c80f2',
    fontWeight: '600',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#4560F4',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    shadowColor: "#4560F4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDD',
  },
  orText: {
    marginHorizontal: 10,
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  footerText: {
    color: '#666',
    fontSize: 15,
  },
  signUpText: {
    color: '#6c80f2',
    fontWeight: 'bold',
    fontSize: 15,
  },
});