import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatScreen = () => {
  let { height } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#EDEDED", height }}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" />
        <View style={styles.headerCenter}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>U</Text>
          </View>
          <View>
            <Text style={styles.username}>worker 1</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <Feather name="phone" size={22} color="white" />
          <Feather name="more-vertical" size={22} color="white" />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.chatContainer}>

        <View style={styles.leftRow}>
          <View style={styles.smallCircle}>
            <Text style={styles.smallCircleText}>W</Text>
          </View>
          <View style={styles.workerBubble}>
            <Text style={styles.messageText}>
              Hello ! How can I help you ?
            </Text>
          </View>
        </View>
        <View style={styles.userBubble}>
          <Text style={styles.messageText}>
            I need bathroom tap work done
          </Text>
        </View>

        <View style={styles.leftRow}>
          <View style={styles.smallCircle}>
            <Text style={styles.smallCircleText}>U</Text>
          </View>
          <View style={styles.workerBubble}>
            <Text style={styles.messageText}>
              Sure ! What is the size of the Bathroom
            </Text>
          </View>
        </View>

        <View style={styles.userBubble}>
          <Text style={styles.messageText}>
            Around 150 square feet
          </Text>
        </View>

        <View style={styles.leftRow}>
          <View style={styles.smallCircle}>
            <Text style={styles.smallCircleText}>U</Text>
          </View>
          <View style={styles.workerBubble}>
            <Text style={styles.messageText}>
              I can complete it in 4-5 hours for 1,500. Does that work ?
            </Text>
          </View>
        </View>

        <View style={styles.userBubble}>
          <Text style={styles.messageText}>
            Ok ! I wil send location
          </Text>
        </View>
      </ScrollView>

      <View style={styles.inputContainer}>
        <Feather name="paperclip" size={22} color="black" />
        <TextInput
          placeholder="Type a message..."
          style={styles.input}
        />
        <Feather name="mic" size={22} color="black" />
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#4F63FF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 12,
  },

  profileCircle: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  profileText: {
    fontSize: 22,
    fontWeight: "600",
  },

  username: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },

  onlineRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  onlineDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "lime",
    marginRight: 5,
  },

  onlineText: {
    color: "white",
    fontSize: 14,
  },

  headerIcons: {
    flexDirection: "row",
    gap: 15,
  },

  chatContainer: {
    padding: 16,
  },

  leftRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 25,
  },

  smallCircle: {
    height: 35,
    width: 35,
    borderRadius: 18,
    backgroundColor: "#4F63FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  smallCircleText: {
    color: "white",
    fontWeight: "600",
  },

  workerBubble: {
    backgroundColor: "#5E8BFF",
    padding: 14,
    borderRadius: 14,
    maxWidth: "75%",
  },

  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#E5E7EB",
    padding: 14,
    borderRadius: 14,
    maxWidth: "75%",
    marginBottom: 25,
  },

  messageText: {
    fontSize: 16,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  input: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 8,
  },
});
