import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

interface ToastProps {
  message: string;
  duration?: number;
  visible: boolean;
  onHide?: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  duration = 3000,
  visible,
  onHide,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(duration - 600),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide?.();
      });
    }
  }, [visible, duration]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        position: "absolute",
        bottom: 80,
        left: 20,
        right: 20,
        backgroundColor: "#323232",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        zIndex: 9999,
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 13,
          fontWeight: "500",
          textAlign: "center",
        }}
      >
        {message}
      </Text>
    </Animated.View>
  );
};

export default Toast;
