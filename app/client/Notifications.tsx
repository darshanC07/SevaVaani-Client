import BottomNavBar from "@/components/BottomNavBar";
import NavBar from "@/components/NavBar";
import NotificationCard from "@/components/NotificationCard";
import Toast from "@/components/Toast";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StatusBar,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Notification {
  id: number;
  type: string;
  title?: string;
  desc?: string;
  details?: string;
  workerName?: string;
  amount?: number;
  time: string;
  unread: boolean;
  category: string;
  workerId?: number;
}

const Notifications = () => {
  const router = useRouter();
  const { height: screenHeight } = useWindowDimensions();
  let height = screenHeight - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

  const staticNotifications: Notification[] = [
    {
      id: 1,
      type: "quotation_received",
      workerName: "Ramesh Kumar",
      details: "Received quotation for plumbing repair work",
      amount: 1200,
      time: "2 min ago",
      unread: true,
      category: "Requests",
      workerId: 1,
    },
    {
      id: 2,
      type: "job_accepted",
      workerName: "Suresh Sharma",
      details: "Accepted your wall painting job request",
      time: "10 min ago",
      unread: true,
      category: "Requests",
      workerId: 2,
    },
    {
      id: 3,
      type: "service_completed",
      workerName: "Amit Patel",
      details: "Completed your electrical work service",
      time: "1 hr ago",
      unread: false,
      category: "Completed",
    },
    {
      id: 4,
      type: "app_offer",
      title: "Premium Membership",
      details: "Upgrade now and save 20% on all services for the next 3 months",
      time: "Today",
      unread: false,
      category: "Offers",
    },
    {
      id: 5,
      type: "new_message",
      workerName: "Ramesh Kumar",
      details: "sent you a message about plumbing work",
      time: "Just now",
      unread: true,
      category: "Requests",
      workerId: 1,
    },
    {
      id: 6,
      type: "quotation_received",
      workerName: "Priya Verma",
      details: "Received quotation for electricity repair",
      amount: 850,
      time: "5 min ago",
      unread: false,
      category: "Requests",
      workerId: 3,
    },
    {
      id: 7,
      type: "job_accepted",
      workerName: "Vikram Desai",
      details: "Accepted your carpentry job request",
      time: "15 min ago",
      unread: false,
      category: "Requests",
      workerId: 6,
    },
    {
  id: 8,
  type: "app_offer",
  title: "Winter Special Offer",
  details: `Get 30% discount on home repairs and maintenance services.
Limited time winter celebration offer.
Applicable on plumbing services.
`,
  time: "2 hours ago",
  unread: false,
  category: "Offers",
},
    {
      id: 9,
      type: "service_completed",
      workerName: "Neha Gupta",
      details: "Completed your painting service",
      time: "3 hours ago",
      unread: false,
      category: "Completed",
    },
    {
      id: 10,
      type: "new_message",
      workerName: "Arjun Reddy",
      details: "sent you a new message",
      time: "4 hours ago",
      unread: false,
      category: "Requests",
      workerId: 8,
    },
    {
      id: 11,
      type: "quotation_received",
      workerName: "Deepak Nair",
      details: "Received quotation for AC maintenance",
      amount: 2500,
      time: "5 hours ago",
      unread: false,
      workerId: 7,
      category: "Requests",
    },
    {
      id: 12,
      type: "job_accepted",
      workerName: "Meera Iyer",
      details: "Accepted your cleaning service request",
      time: "6 hours ago",
      unread: false,
      category: "Requests",
      workerId: 10,
    },
  ];

  const [notifications, setNotifications] = useState<Notification[]>(staticNotifications);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // All notifications shown directly, no filtering
  const filteredNotifications = notifications;

  const displayToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleSwipeLeft = () => {
    const currentNotif = filteredNotifications[currentCardIndex];
    if (!currentNotif) return;

    if (currentNotif.type === "app_offer") {
      router.push("/client/PricingPlansScreen");
      displayToast("Opening membership");
    } else if ((currentNotif.type === "quotation_received" || currentNotif.type === "new_message" || currentNotif.type === "job_accepted") && currentNotif.workerId) {
      displayToast(`Contacting ${currentNotif.workerName}`);
      router.push({
        pathname: "/client/ChatScreen",
        params: {
          workerId: currentNotif.workerId,
          workerName: currentNotif.workerName,
        },
      });
    } else if (currentNotif.type === "service_completed") {
      displayToast("Service details opened");
    } else {
      displayToast("Opening notification");
    }

    markAsReadAndNext();
  };

  const handleSwipeRight = () => {
    const currentNotif = filteredNotifications[currentCardIndex];
    if (!currentNotif) return;

    if (currentNotif.type === "new_message" && currentNotif.workerId) {
      displayToast(`Opening chat with ${currentNotif.workerName}`);
      router.push({
        pathname: "/client/ChatScreen",
        params: {
          workerId: currentNotif.workerId,
          workerName: currentNotif.workerName,
        },
      });
    } else {
      displayToast("Notification dismissed");
    }

    markAsReadAndNext();
  };

  const markAsReadAndNext = () => {
    const currentNotif = filteredNotifications[currentCardIndex];
    if (!currentNotif) return;

    setNotifications((prev) =>
      prev.map((n) => (n.id === currentNotif.id ? { ...n, unread: false } : n))
    );

    // Move to next card without looping
    setCurrentCardIndex(currentCardIndex + 1);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

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
          backgroundColor: "white",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingHorizontal: 20,
          paddingTop: 20,
          marginTop: 15,
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: "#1a1a1a",
            }}
          >
            Notifications
          </Text>

          <TouchableOpacity
            onPress={handleMarkAllRead}
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

        {currentCardIndex < filteredNotifications.length ? (
          <View style={{ flex: 1, paddingTop: 16 }}>
            {/* Card Stack Container */}
            <View
              style={{
                backgroundColor: "transparent",
                flex: 1,
                position: "relative",
                minHeight: 400,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 0,
                overflow: "visible",   // ⭐ IMPORTANT
              }}
            >


              
              {filteredNotifications.map((notification, index) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  index={index}
                  currentCardIndex={currentCardIndex}
                  isActive={index === currentCardIndex}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                />
              ))}
            </View>

            {/* Footer with instructions and counter */}
            <View
              style={{
                paddingBottom: 12,
                paddingTop: 20,
                alignItems: "center",
                gap: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#999",
                  textAlign: "center",
                }}
              >
                 Swipe LEFT to accept | Swipe RIGHT to dismiss 
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: "#BBB",
                }}
              >
                {currentCardIndex + 1} of {filteredNotifications.length}
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#999",
              }}
            >
              No new notifications
            </Text>
          </View>
        )}
      </View>

      <Toast
        message={toastMessage}
        visible={showToast}
        onHide={() => setShowToast(false)}
      />

      <BottomNavBar />
    </SafeAreaView>
  );
};

export default Notifications;
