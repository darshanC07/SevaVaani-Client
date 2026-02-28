import React, { useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Dimensions,
  Animated,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.75;
//const CARD_HEIGHT = height * 0.50; // 65% of screen height
interface NotificationItem {
  id: number;
  type: string;
  workerName?: string;
  details?: string;
  title?: string;
  amount?: number;
  time: string;
  category?: string;
  workerId?: number;
  desc?: string;
}

interface NotificationCardProps {
  notification: NotificationItem;
  index: number;
  isActive: boolean;
  currentCardIndex: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  index,
  isActive,
  currentCardIndex,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const animatedX = useRef(new Animated.Value(0)).current;
  const animatedRotate = useRef(new Animated.Value(0)).current;
  const panResponder = useRef<any>(null);
  const activeRef = useRef(isActive);

  // Keep activeRef up to date
  useEffect(() => {
    activeRef.current = isActive;
  }, [isActive]);

  // Keep handlers ref up to date
  const handlersRef = useRef({ onSwipeLeft, onSwipeRight });
  useEffect(() => {
    handlersRef.current = { onSwipeLeft, onSwipeRight };
  }, [onSwipeLeft, onSwipeRight]);

  // Create panResponder once (doesn't need isActive in deps)
  if (!panResponder.current) {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => activeRef.current,
      onMoveShouldSetPanResponder: () => activeRef.current,
      onPanResponderMove: (evt: GestureResponderEvent, { dx }: PanResponderGestureState) => {
        if (activeRef.current) {
          animatedX.setValue(dx);
          animatedRotate.setValue(dx / 25);
        }
      },
      onPanResponderRelease: (
        evt: GestureResponderEvent,
        { dx, vx }: PanResponderGestureState
      ) => {
        if (!activeRef.current) return;

        const threshold = 80;

        if (dx < -threshold || vx < -0.5) {
          // Swipe LEFT
          Animated.parallel([
            Animated.timing(animatedX, {
              toValue: -width * 1.5,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(animatedRotate, {
              toValue: -0.3,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
          setTimeout(() => handlersRef.current.onSwipeLeft(), 50);
        } else if (dx > threshold || vx > 0.5) {
          // Swipe RIGHT
          Animated.parallel([
            Animated.timing(animatedX, {
              toValue: width * 1.5,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(animatedRotate, {
              toValue: 0.3,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
          setTimeout(() => handlersRef.current.onSwipeRight(), 50);
        } else {
          // Reset - weak swipe
          Animated.parallel([
            Animated.spring(animatedX, {
              toValue: 0,
              useNativeDriver: true,
              tension: 100,
              friction: 10,
            }),
            Animated.spring(animatedRotate, {
              toValue: 0,
              useNativeDriver: true,
              tension: 100,
              friction: 10,
            }),
          ]).start();
        }
      },
    });
  }

  // Reset animation when card becomes inactive
  useEffect(() => {
    if (!isActive) {
      animatedX.setValue(0);
      animatedRotate.setValue(0);
    }
  }, [isActive]);

  // Hide cards that have already been swiped (earlier in the queue)
  if (index < currentCardIndex) {
    return null;
  }

  // Dynamic deck stacking - calculate position in stack
  const stackPosition = index - currentCardIndex; // 0 = active, 1, 2, 3... = behind

  // Stacking offsets: each card behind gets more offset
  const VERTICAL_OFFSET = 18; // pixels per card
  const SCALE_FACTOR = 0.98; // slight scale reduction for depth
  

  //const scale = Math.pow(SCALE_FACTOR, stackPosition);
  // keep active card normal
    const scale = isActive ? 1 : 0.94 + stackPosition * 0.01;

// make back cards slightly wider visually
    const widthExpand = stackPosition * 16;
  
  
  
  
  const translateY = stackPosition * VERTICAL_OFFSET;
  const opacity = isActive ? 1 : 0.9 - stackPosition * 0.08;

  const rotateZ = animatedRotate.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-8deg", "0deg", "8deg"],
  });

  const getIconName = (type: string) => {
    switch (type) {
      case "quotation_received":
        return "document-text";
      case "job_accepted":
        return "checkmark-circle";
      case "service_completed":
        return "star";
      case "app_offer":
        return "gift";
      case "new_message":
        return "chatbubble";
      default:
        return "notifications";
    }
  };

  return (
    <Animated.View
  style={{
    
    position: "absolute",
    width: width * 0.75 ,
    maxHeight: height * 0.75,
    alignSelf: "center",
    left: 27,
    top: height * 0.15 + translateY,
    transform: [
      { translateX: animatedX },
      { rotateZ },
      { scale },
    ],
    opacity,
    zIndex: 1000 - stackPosition,
    elevation: 20 - stackPosition,
  }}
  {...(isActive && panResponder.current ? panResponder.current.panHandlers : {})}
>
  <View
    style={{
      backgroundColor: "#FFFFFF",
      borderRadius: 16,
      paddingVertical: isActive ? 40 : 18,
      paddingHorizontal: 16,
      shadowColor: "#000",
      shadowOpacity: isActive ? 0.12 : 0.06,
      shadowRadius: isActive ? 12 : 6,
      shadowOffset: { width: 0, height: isActive ? -4 : -1 },
      elevation: isActive ? 8 : 2,
      borderTopWidth: 3,
      borderTopColor: "#4560F4",
      overflow: "hidden",
      ...(isActive ? { flex: 1 } : { minHeight: 110 }),
    }}
  >
    {isActive ? (
      <>
        {/* Icon and Title Row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            marginBottom: 18,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: "#EEF1FF",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
              flexShrink: 0,
            }}
          >
            <Ionicons
              name={getIconName(notification.type) as any}
              size={22}
              color="#4560F4"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "700",
                color: "#1a1a1a",
                marginBottom: 4,
              }}
              numberOfLines={1}
            >
              {notification.workerName || notification.title}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#666",
              }}
            >
              {notification.time}
            </Text>
          </View>
        </View>

        {/* Scrollable Description Area */}
        <ScrollView
          showsVerticalScrollIndicator={true}
          style={{ maxHeight: height * 0.5 }}
          nestedScrollEnabled={true}
        >
          <Text
            style={{
              fontSize: 13,
              color: "#555",
              lineHeight: 18,
            }}
          >
            {notification.details || notification.desc}
          </Text>
        </ScrollView>

        {/* Amount (if applicable) */}
        {notification.amount && (
          <View
            style={{
              backgroundColor: "#F5F7FF",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              alignSelf: "flex-start",
              marginTop: 16,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#4560F4",
              }}
            >
              ₹{notification.amount.toLocaleString("en-IN")}
            </Text>
          </View>
        )}
      </>
    ) : null}
  </View>
</Animated.View>
  );
};

export default NotificationCard;
