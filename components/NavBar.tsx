import { Image, StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const NavBar = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>SevaVaani</Text>
      <View style={styles.rightSide}>
        <TouchableOpacity onPress={()=>router.push("/client/Notifications")}>
          <Image
            source={require("../assets/navbar/notification.png")}
            style={{ width: 25, height: 25 }}
          /></TouchableOpacity>
        <View style={styles.languageIcon}>
          <Image
            source={require("../assets/navbar/language.png")}
            style={{ width: 30, height: 30 }}
          />
          <Text style={styles.lang}>EN</Text>
        </View>
      </View>
    </View>
  );
};

export default NavBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4560F4",
    height: 65,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appName: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    margin: 15,
  },
  rightSide: {
    flexDirection: "row",
    marginRight: 15,
  },
  languageIcon: {
    marginLeft: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBlockColor: 'black',
    backgroundColor: '#D7D3D3',
    borderRadius: 10,
    paddingHorizontal: 5,
    gap: 2
  },
  lang: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
  },
});
