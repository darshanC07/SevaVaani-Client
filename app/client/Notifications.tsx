import BottomNavBar from "@/components/BottomNavBar";
import NavBar from "@/components/NavBar";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StatusBar,
  Text,
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
        justifyContent: "space-between",
      }}
    >
      {/* Header Background */}
      <View
        style={{
          backgroundColor: "#4560F4",
          height: 220,
          width: "100%",
          position: "absolute",
        }}
      />

      <NavBar />
      <View
        style={{
          height: 1,
          width: "94%",
          backgroundColor: "white",
          marginBottom: 10,
          alignSelf: "center",
        }}
      />

      {/* Main Container */}
      <View
        style={{
          backgroundColor: "white",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingHorizontal: 20,
          height: "80%",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            marginVertical: 15,
          }}
        >
          Notifications
        </Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {notifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={{
                borderWidth: 1,
                borderColor: "black",
                borderRadius: 15,
                padding: 15,
                marginBottom: 15,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "600" }}>
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
                  <Text style={{ fontSize: 12, color: "gray" }}>
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
