import BottomNavBar from "@/components/BottomNavBar";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../../components/NavBar";
const PostNewJob = () => {
  const router = useRouter();

  const navImage = require("../../assets/Client_HomeScreen/Washing_man.png");
  const searchIcon = require("../../assets/Client_HomeScreen/Search.png");
  const addIcon = require("../../assets/Client_HomeScreen/add.png");
  const plumbingIcon = require("../../assets/Client_HomeScreen/Plumbing.png");

  let { height } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ?? 24);
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <NavBar />
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <Text>Post New Job Screen</Text>
        </View>
        <BottomNavBar />
      </SafeAreaView>
    );
}
export default PostNewJob;

const styles = StyleSheet.create({
    mainContainer: {
    padding: 20,
  },
});