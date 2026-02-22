import { Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
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
import { createChat, getMessages, getMessagesSince, sendMessage, updateLastSeen } from "../../services/GlobalAPIs";
import { getUserId } from "../../utils/AsyncStorageUtils";
import { GlobalStatesContext } from "@/contexts/GlobalContext";

interface Message {
  message_id: string;
  from: string;
  to: string;
  msg: string;
  timestamp: number;
}

const POLL_INTERVAL_MS = 4000;

const getLatestTimestamp = (items: Message[]) =>
  items.reduce((max, item) => (item.timestamp > max ? item.timestamp : max), 0);

const mergeMessagesById = (current: Message[], incoming: Message[]) => {
  if (incoming.length === 0) return current;
  const map = new Map<string, Message>();
  for (const msg of current) {
    map.set(msg.message_id, msg);
  }
  for (const msg of incoming) {
    map.set(msg.message_id, msg);
  }
  const merged = Array.from(map.values());
  merged.sort((a, b) => a.timestamp - b.timestamp);
  return merged;
};

const ChatScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const listRef = useRef<FlatList<Message>>(null);

  const contextObj = useContext(GlobalStatesContext)

  let { height } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

  // const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [chatId, setChatId] = useState('');
  const [clientId, setClientId] = useState(params.clientId || '');
  const [clientName, setClientName] = useState(params.clientName || 'Client');
  const [isLoading, setIsLoading] = useState(true);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState(0);

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    if (contextObj.messages.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [contextObj.messages]);

  // useEffect(() => {
  //   if (!chatId || isLoading) return;

  //   const intervalId = setInterval(() => {
  //     refreshMessagesSince(chatId);
  //   }, POLL_INTERVAL_MS);

  //   return () => clearInterval(intervalId);
  // }, [chatId, isLoading, lastMessageTimestamp]);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      const userId = await getUserId();
      if (!userId) {
        router.replace('/login');
        return;
      }

      setCurrentUserId(userId);

      const actualClientId = clientId || 'mockClientId123';
      setClientId(actualClientId);

      // updateLastSeen(userId).catch((error) => {
      //   console.error("Update last seen error:", error);
      // });

      const chatResponse = await createChat(actualClientId, userId);
      const currentChatId = chatResponse.chat_id;
      setChatId(currentChatId);

      await loadMessages(currentChatId);
    } catch (error) {
      console.error('Error initializing chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (currentChatId: string) => {
    try {
      const response = await getMessages(currentChatId);
      // const nextMessages = (response.messages || []).slice().sort((a: Message, b: Message) => a.timestamp - b.timestamp);
      console.log('Loaded messages:', response.messages);
      contextObj.setMessages(response.messages || []);
      // setLastMessageTimestamp(getLatestTimestamp(nextMessages));
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // const refreshMessagesSince = async (currentChatId: string) => {
  //   try {
  //     const since = lastMessageTimestamp || 0;
  //     const response = await getMessagesSince(currentChatId, since);
  //     const incoming = response.messages || [];
  //     if (incoming.length === 0) return;

  //     // setMessages((prev) => {
  //     //   const merged = mergeMessagesById(prev, incoming);
  //     //   setLastMessageTimestamp(getLatestTimestamp(merged));
  //     //   return merged;
  //     // });
  //     // contextObj.setMessages((prev) => [...prev, ...incoming]);
  //   } catch (error) {
  //     console.error('Error refreshing messages:', error);
  //   }
  // };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentUserId || !clientId || !chatId) return;

    try {
      const messageText = inputMessage.trim();
      setInputMessage('');

      await sendMessage(chatId, currentUserId, clientId, messageText);
      // updateLastSeen(currentUserId).catch((error) => {
      //   console.error("Update last seen error:", error);
      // });

      // await refreshMessagesSince(chatId);
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

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={isCurrentUser(item.from) ? styles.userMessageRow : styles.leftMessageRow}>
      {!isCurrentUser(item.from) && (
        <View style={styles.smallAvatar}>
          <Text style={styles.smallAvatarText}>{clientName[0] || 'C'}</Text>
        </View>
      )}
      <View style={isCurrentUser(item.from) ? styles.rightBubble : styles.leftBubble}>
        <Text style={styles.messageText}>{item.msg}</Text>
        <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
      </View>
    </View>
  );

  const emptyComponent = (
    <View style={styles.emptyState}>
      {isLoading ? (
        <>
          <ActivityIndicator size="small" color="#4F63FF" />
          <Text style={styles.emptyText}>Loading messages...</Text>
        </>
      ) : (
        <Text style={styles.emptyText}>No messages yet</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#EDEDED", height }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="white"
            onPress={() => router.back()}
          />
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{clientName[0] || 'C'}</Text>
            </View>
            <View>
              <Text style={styles.username}>{clientName}</Text>
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
        <FlatList
          ref={listRef}
          data={contextObj.messages}
          keyExtractor={(item, index) => item.message_id || `${item.timestamp}-${index}`}
          renderItem={renderMessage}
          contentContainerStyle={[
            styles.chatContainer,
            contextObj.messages.length === 0 ? styles.emptyContainer : null
          ]}
          ListEmptyComponent={emptyComponent}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={5}
          removeClippedSubviews
        />

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

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 12,
  },

  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  avatarText: {
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

  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyState: {
    alignItems: "center",
  },

  emptyText: {
    color: "#666",
    marginTop: 8,
  },

  leftMessageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  smallAvatar: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: "#4F63FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  smallAvatarText: {
    color: "white",
    fontWeight: "600",
  },

  leftBubble: {
    backgroundColor: "#5E8BFF",
    padding: 12,
    borderRadius: 14,
    maxWidth: "70%",
  },

  rightBubble: {
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

