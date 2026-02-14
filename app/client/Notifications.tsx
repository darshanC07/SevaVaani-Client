import BottomNavBar from "@/components/BottomNavBar";
import NavBar from "@/components/NavBar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Notifications = () => {
  const router = useRouter();
  let { height } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

  const notifications = [
    {
      id: 1,
      title: "Job Request Accepted",
      desc: "Your plumber request has been accepted by Kishor Kumar",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      title: "Service Completed",
      desc: "Please rate your experience with the worker",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 3,
      title: "New Offer Available",
      desc: "Get 10% off on your next booking",
      time: "2 days ago",
      unread: false,
    },
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        height,
      }}
    >
      <View
        style={{
          backgroundColor: "#4560F4",
          height: 210,
          width: "100%",
          position: "absolute",
        }}
      />

      <NavBar />
      <View
        style={{
          paddingHorizontal: 16,
          marginTop: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 12,
            paddingHorizontal: 12,
            height: 44,
            marginBottom: 10,
          }}
        >
          <Ionicons name="search" size={18} color="gray" />
          <TextInput
            placeholder="Search notifications"
            placeholderTextColor="gray"
            style={{
              marginLeft: 8,
              flex: 1,
              fontSize: 14,
              color : 'black'
            }}
          />
          <Ionicons name="options-outline" size={18} color="gray" />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {["All", "Unread", "Requests", "Offers", "Completed"].map(
            (item, index) => (
              <View
                key={index}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor:
                    item === "All" ? "#EEF1FF" : "white",
                  borderWidth: 1,
                  borderColor: "#E2E6FF",
                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "500",
                    color:
                      item === "All" ? "#4560F4" : "#444",
                  }}
                >
                  {item}
                </Text>
              </View>
            )
          )}
        </ScrollView>
      </View>
      <View
        style={{
          backgroundColor: "white",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingHorizontal: 20,
          paddingTop: 15,
          marginTop: 15,
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
            }}
          >
            Notifications
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: "#EEF1FF",
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: "#4560F4",
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              Mark all read
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {notifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={{
                backgroundColor: item.unread ? "#F5F7FF" : "white",
                borderRadius: 16,
                padding: 16,
                marginBottom: 14,
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
                elevation: 4,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      color: "gray",
                      marginVertical: 4,
                    }}
                  >
                    {item.desc}
                  </Text>

                  <Text
                    style={{
                      fontSize: 12,
                      color: "gray",
                    }}
                  >
                    {item.time}
                  </Text>
                </View>

                {item.unread && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: "#4560F4",
                      marginLeft: 10,
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <BottomNavBar />
    </SafeAreaView>
  );
};

export default Notifications;
