import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import BottomNavBar from "@/components/BottomNavBar";
import NavBar from "@/components/NavBar";
import { useRouter } from "expo-router";
import { getUserId } from "@/utils/AsyncStorageUtils";
import { getChatList } from "@/services/GlobalAPIs";
import { useTranslation } from "react-i18next";

const ChatList = () => {
  let { height } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);
  const router = useRouter();

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language.toLocaleLowerCase();

  const [search, setSearch] = useState("");
  const [chatList, setChatList] = useState([]);
  const chatUsers = [
    {
      worker_id: "U101",
      worker_name: "Rakesh Yadav",
      time: "3:50 pm",
      status: "Online",
    },
    {
      worker_id: "U102",
      worker_name: "Gopal Singh",
      time: "3:50 pm",
      status: "Offline",
    },
    {
      worker_id: "U103",
      worker_name: "Rohit Pawar",
      time: "3:50 pm",
      status: "Online",
    },
    {
      worker_id: "U104",
      worker_name: "Savitri Thakur",
      time: "3:50 pm",
      status: "Offline",
    },
  ];


  const fetchChatUsers = async () => {
    const userId = await getUserId();
    console.log("Fetched User ID:", userId);
    if (!userId) {
      router.replace("/login");
      return;
    }
    try {
      const response = await getChatList(userId, currentLanguage);
      if (response) {
        if (response.chats.length > 0) {
          const filteredUsers = response.chats?.filter((item) =>
            item.worker_name.toLowerCase().includes(search.toLowerCase())
          );
          setChatList(filteredUsers);
        } else {
          setChatList([]);
        }
      } else {
        console.error("Failed to fetch chat users:", response.message);
      }
    } catch (error) {
      console.error("Error fetching chat users:", error);
    }
  }

  useEffect(() => {
    fetchChatUsers();
  }, [currentLanguage])


  function formatTime(timestamp) {
    const date = new Date(timestamp);

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const ampm = hours >= 12 ? 'am' : 'pm';
    hours = hours % 12 || 12; // Convert 24h → 12h format

    return `${hours}:${minutes} ${ampm}`;
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F6FA" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <NavBar />

        <View style={styles.header}>
          <View style={styles.horizontalLine} />
          <Text style={styles.title}>{t('client.messages')}</Text>

          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Feather name="search" size={16} color="#999" />
              <TextInput
                placeholder="Search"
                placeholderTextColor="#999"
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
              />
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 110, paddingTop: 6 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {chatList.length > 0 && chatList.map((item) => {
            return (
              <TouchableOpacity key={item.worker_id} style={styles.card} onPress={() => router.push({
                pathname: '/client/ChatScreen',
                params: { workerId: item.worker_id, workerName: item.worker_name }
              })}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.worker_name.charAt(0)}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.worker_name}</Text>

                  <View style={styles.statusRow}>
                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor:
                            item.status === "Online"
                              ? "#22C55E"
                              : "#EF4444",
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            item.status === "Online"
                              ? "#22C55E"
                              : "#EF4444",
                        },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.time}>{formatTime(item.last_seen)}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        <View style={{ position: "absolute", bottom: 20, width: "100%" }}>
          <BottomNavBar />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView >
  );
};

export default ChatList;

const styles = StyleSheet.create({
  horizontalLine: {
    height: 1,
    width: "105%",
    backgroundColor: "white",
    marginBottom: 6,
    alignSelf: "center",
  },

  header: {
    backgroundColor: "#4560F4",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "white",
    textAlign: "center",
  },

  searchRow: {
    marginTop: 10,
  },

  searchBox: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  searchInput: {
    marginLeft: 6,
    flex: 1,
    color: "black",
    fontSize: 16,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    elevation: 3,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#4F63FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },

  time: {
    fontSize: 12,
    color: "#777",
    fontWeight: "600",
  },
});