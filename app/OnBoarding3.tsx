import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
const OnBoarding3 = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.skip}></Text>
      </View>
      <View style={{ alignItems: "center", marginTop: 50, gap: 20 }}>
        <Image
          source={require("../assets/onboarding/ob3.png")}
          style={styles.image}
        />
        <Text style={{ fontSize: 26, textAlign: "center" }}>
          Interact by Your Voice
        </Text>
        <Text style={{ textAlign: "center", color: "#757575" }}>
          Just speak up your requirements and chill, our assistant will talk
          with you, hands-free
        </Text>
      </View>
      <View style={{flexDirection:'row',justifyContent:"center",gap:15}}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/OnBoarding3")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/registration/")}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: 5,
          alignSelf: "center",
          //   position: "absolute",
          //   bottom: 40,
          //   left: "50%",
          //   right: "50%",
        }}
      >
        <View style={styles.dot}></View>
        <View style={styles.dot}></View>
        <View style={styles.currentDot}></View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  skip: {
    color: "grey",
    fontSize: 20,
  },
  image: {
    height: 300,
    width: 300,
  },
  button: {
    backgroundColor: "#4560F4",
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    width:"50%"
    // position: "absolute",
    // bottom: 60,
    // left: 20,
    // right: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 22,
  },
  dot: {
    height: 5,
    width: 5,
    backgroundColor: "#B5B5B5",
    borderRadius: "50%",
  },
  currentDot: {
    height: 5,
    width: 30,
    backgroundColor: "#008CFF",
    borderRadius: 50,
  },
});
export default OnBoarding3;
