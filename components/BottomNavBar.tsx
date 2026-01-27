import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

const BottomNavBar = () => {
  const router = useRouter();
  return (
    <View style={styles.bg}>
      <View>
        <Image
          source={require("../assets/BottomNavBar/Home.png")}
          style={styles.icon}
        />
      </View>
      <View>
        <Image
          source={require("../assets/BottomNavBar/Business.png")}
          style={styles.icon}
        />
      </View>
      <View style={{
        position : 'relative',
        bottom : 20,
        backgroundColor: "#4560F4",
        borderRadius : '50%',
        width : 70,
        height : 70,
        justifyContent : 'center',
        alignItems : 'center'
      }}>
        <Image
          source={require("../assets/BottomNavBar/Microphone.png")}
          style={[styles.icon, { width: 42, height: 42 }]}
        />
      </View>
      <View>
        <Image
          source={require("../assets/BottomNavBar/chat.png")}
          style={styles.icon}
        />
      </View>
      <TouchableOpacity onPress={()=>router.navigate('/client/Profile')} >
        <Image
          source={require("../assets/BottomNavBar/user.png")}
          style={styles.icon}
        />
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
});
