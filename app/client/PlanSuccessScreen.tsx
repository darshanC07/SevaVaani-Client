import * as React from 'react';
import { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import ConfettiCannon from 'react-native-confetti-cannon';
import { upgradePlan } from '@/services/GlobalAPIs';
import { getUserId } from '@/utils/AsyncStorageUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlanSuccessScreen = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  
  const { plan } = useLocalSearchParams();

  // Animations
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations on mount
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
        delay: 500,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        delay: 500,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        delay: 1200,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    // Navigate back to profile
    // router.replace('/client/Profile');
    router.replace('/client');
  };

  const handleUpgrade = async () => {
    try {
      const user = await getUserId();
      if (user) {
        const res = await upgradePlan(user,plan);
        console.log("Upgrade plan response:", res);
        if (res && res.code === 1) {
          await AsyncStorage.setItem("plan", plan);
          console.log("Plan upgraded successfully, stored in AsyncStorage:", plan);
        }
      } else {
        router.replace('/login');
      }
    } catch (error) {
      console.error("Error upgrading plan:", error);
    }
  }
  useEffect(() => {
    console.log("Received plan in PlanSuccessScreen:", plan);
    try {
      if (plan) {
        handleUpgrade();
      } else {
        console.error("No plan received in PlanSuccessScreen");
      }
    } catch (error) {
      console.error("Error in useEffect of PlanSuccessScreen:", error);
    }
  }, [plan]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Immersive Background */}
      <LinearGradient
        colors={['#4560F4', '#2C49E0', '#1A1C1E']}
        style={StyleSheet.absoluteFill}
      />

      {/* Confetti Explosion */}
      <ConfettiCannon
        count={150}
        origin={{ x: width / 2, y: -20 }}
        fadeOut={true}
        fallSpeed={3000}
        autoStart={true}
      />

      <View style={styles.mainContent}>
        {/* Center Badge Section */}
        <Animated.View
          style={[
            styles.badgeContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <View style={styles.glowOuter}>
            <LinearGradient
              colors={['#FFFFFF30', '#FFFFFF05']}
              style={styles.glowInner}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="ribbon" size={80} color="#FFD700" />
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Success Message Text */}
        <Animated.View style={[styles.textSection, { opacity: contentOpacity }]}>
          <Text style={styles.titleText}>You're Now a {plan} Member!</Text>
          <Text style={styles.subtitleText}>
            Your journey just leveled up. Enjoy exclusive benefits and grow faster with SevaVaani.
          </Text>
        </Animated.View>
      </View>

      {/* Action Button */}
      <Animated.View style={[styles.footer, { opacity: contentOpacity }]}>
        <TouchableOpacity
          style={styles.continueBtn}
          activeOpacity={0.85}
          onPress={handleContinue}
        >
          <LinearGradient
            colors={['#FFFFFF', '#F0F0F0']}
            style={styles.btnGradient}
          >
            <Text style={styles.btnText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#4560F4" style={{ marginLeft: 8 }} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default PlanSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4560F4',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  glowOuter: {
    padding: 2,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  glowInner: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  textSection: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitleText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  continueBtn: {
    height: 65,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  btnGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#4560F4',
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
