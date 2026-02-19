import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createChat, getMessages, sendMessage, updateLastSeen } from "../../services/GlobalAPIs";
import { getUserId } from "../../utils/AsyncStorageUtils";

interface Message {
  message_id: string;
  from: string;
  to: string;
  msg: string;
  timestamp: number;
}

const ChatScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  
  let { height } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [chatId, setChatId] = useState('');
  const [workerId, setWorkerId] = useState(params.workerId || '');
  const [workerName, setWorkerName] = useState(params.workerName || 'Worker');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const initializeChat = async () => {
    try {
      console.log("🔄 Client ChatScreen: Starting initialization...");
      
      const userId = await getUserId();
      console.log("👤 Client ChatScreen: Got user ID:", userId);
      
      if (!userId) {
        console.log("❌ Client ChatScreen: No user ID, redirecting to login");
        router.replace('/login');
        return;
      }
      
      setCurrentUserId(userId);
      console.log("✅ Client ChatScreen: Set current user ID");
      
      console.log("👁️ Client ChatScreen: Updating last seen...");
      await updateLastSeen(userId);
      console.log("✅ Client ChatScreen: Updated last seen");
      
      // Use the actual worker ID from navigation params
      const actualWorkerId = workerId || 'mockWorkerId123';
      console.log("👥 Client ChatScreen: Using worker ID:", actualWorkerId);
      setWorkerId(actualWorkerId);
      
      // Create or get existing chat (client as first param, worker as second)
      console.log("💬 Client ChatScreen: Creating chat...");
      const chatResponse = await createChat(userId, actualWorkerId);
      const currentChatId = chatResponse.chat_id;
      console.log("✅ Client ChatScreen: Chat created with ID:", currentChatId);
      setChatId(currentChatId);
      
      // Load messages
      console.log("📨 Client ChatScreen: Loading messages...");
      await loadMessages(currentChatId);
      console.log("✅ Client ChatScreen: Messages loaded");
      
    } catch (error) {
      console.error("❌ Client ChatScreen: Error initializing chat:", error);
    } finally {
      console.log("🏁 Client ChatScreen: Initialization complete, setting loading to false");
      setIsLoading(false);
    }
  };

  const loadMessages = async (currentChatId: string) => {
    try {
      console.log("📨 Client loadMessages: Starting to load messages for chat:", currentChatId);
      const response = await getMessages(currentChatId);
      console.log("📨 Client loadMessages: Got response:", response);
      const messages = response.messages || [];
      console.log("📨 Client loadMessages: Setting", messages.length, "messages");
      setMessages(messages);
      console.log("✅ Client loadMessages: Messages loaded successfully");
    } catch (error) {
      console.error('❌ Client loadMessages: Error loading messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentUserId || !workerId || !chatId) return;
    
    try {
      const messageText = inputMessage.trim();
      setInputMessage('');
      
      await sendMessage(chatId, currentUserId, workerId, messageText);
      await updateLastSeen(currentUserId);
      
      // Reload messages to show the new one
      await loadMessages(chatId);
      
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const isCurrentUser = (senderId: string) => senderId === currentUserId;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#EDEDED", height }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
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
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.chatContainer}
        >
          {isLoading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>Loading messages...</Text>
            </View>
          ) : (
            messages.map((message) => (
              <View key={message.message_id} style={isCurrentUser(message.from) ? styles.userMessageRow : styles.leftRow}>
                {!isCurrentUser(message.from) && (
                  <View style={styles.smallCircle}>
                    <Text style={styles.smallCircleText}>W</Text>
                  </View>
                )}
                <View style={isCurrentUser(message.from) ? styles.userBubble : styles.workerBubble}>
                  <Text style={styles.messageText}>{message.msg}</Text>
                  <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <Feather name="paperclip" size={22} color="black" />
          <TextInput
            placeholder="Type a message..."
            placeholderTextColor="black"
            style={styles.input}
            value={inputMessage}
            onChangeText={setInputMessage}
            multiline
            onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity style={styles.iconButton} onPress={handleSendMessage}>
            <Feather name="send" size={22} color="#4F63FF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="mic" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: "#F2F4FE",
    alignSelf: "flex-end",
    maxWidth: "70%",
    padding: 12,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    marginLeft: 50,
  },

  userMessageRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },

  messageText: {
    fontSize: 16,
  },

  messageTime: {
    fontSize: 11,
    color: "#666",
    marginTop: 4,
    alignSelf: "flex-end",
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
    color: "black",
  },

  iconButton: {
    padding: 5,
  },
});
