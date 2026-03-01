import Feather from "@expo/vector-icons/Feather";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavBar from "../../components/BottomNavBar";
import { useTranslation } from 'react-i18next';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [plan, setPlan] = useState<string | null>("Basic");
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const plan = await AsyncStorage.getItem("plan");
        console.log("Plan from AsyncStorage:", plan);
        setPlan(plan);
      } catch (error) {
        console.error("Error fetching plan from AsyncStorage:", error);
      }
    };
    fetchPlan();
  }, []);


  let { height, width } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);
  return (
    <SafeAreaView
      style={{
        height: height,
        backgroundColor: 'white',
        flex: 1,
      }}
    >
      <Image
        style={{
          backgroundColor: "#4560F4",
          width: "100%",
          height: 250,
          position: "absolute",
        }}
        source={require("../../assets/Profile/profileBg1.jpg")}
      />
      <View
        id="topBar"
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 20,
          marginTop: 15,
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            backgroundColor: "white",
            borderRadius: 10,
            borderWidth: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View
          style={{
            width: 40,
            height: 40,
            marginLeft: 20,
            backgroundColor: "white",
            borderRadius: 10,
            borderWidth: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Feather name="settings" size={24} color="black" />
        </View>
      </View>

      <View
        style={{
          backgroundColor: "white",
          flex: 1,
          marginTop: 80,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            borderColor: "black",
            borderWidth: 1,
            borderRadius: "50%",
            width: 120,
            height: 120,
            position: "absolute",
            top: -60,
            marginLeft: 20,
            backgroundColor: "red",
          }}
        >
          <Image
            source={require("../../assets/Profile/image.png")}
            style={{ width: "100%", height: "100%", borderRadius: 60 }}
          />
        </View>
        <View
          style={{
            width: "100%",
            marginTop: 70,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ width: "50%" }}>
            <Text style={{ fontSize: 19, fontWeight: "500" }}>
              Lucas Bennet
            </Text>
            <Text style={{ fontSize: 15, color: "gray" }}>
              lucas12@gmail.com
            </Text>
          </View>
          <TouchableOpacity
            style={{ width: "50%" }}
            onPress={() => router.push('/client/PricingPlansScreen')}>
            <LinearGradient
              colors={["#EF9F44", "#FAE0C9"]}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                justifyContent: "center",
                padding: 5,
                borderColor: "black",
                borderWidth: 1,
                borderRadius: 10,
              }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Image
                source={require("../../assets/Profile/verified.png")}
                style={{ width: 20, height: 20, marginLeft: 10 }}
              />

              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "black", fontSize: 14, fontWeight: "bold" }}
                >{
                  plan === "Premium" ? t('profile.premiumMember') : plan === "Standard" ? t('profile.standardMember') : t('profile.basicMember')
                }
                </Text>
              </View>
            </LinearGradient></TouchableOpacity>
        </View>
        <View
          style={{
            height: 1,
            width: "100%",
            backgroundColor: "black",
            alignSelf: "center",
            marginTop: 10,
            display: 'none'
          }}
          id="normal-horizontal-line"
        ></View>
        <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 15 }}>
          <View style={styles.profileOption}>
            <Image
              source={require("../../assets/Profile/Choice.png")}
              style={styles.profileOptionIcon}
            />
            <Text style={styles.profileOptionText}>{t('profile.myBooking')}</Text>
          </View>
          <TouchableOpacity style={styles.profileOption} onPress={() => router.push('/client/ChatList')}>
            <Image
              source={require("../../assets/Profile/Communication.png")}
              style={styles.profileOptionIcon}
            />
            <Text style={styles.profileOptionText}>{t('profile.chatHistory')}</Text>
          </TouchableOpacity>
          <View style={styles.profileOption}>
            <Image
              source={require("../../assets/Profile/Headset.png")}
              style={styles.profileOptionIcon}
            />
            <Text style={styles.profileOptionText}>{t('profile.helpSupport')}</Text>
          </View>
        </View>
        <View style={{
          borderWidth: 1, borderColor: 'black', marginTop: 20, borderRadius: 10, padding: 15,
          height: '54%',
        }}>
          <ScrollView>
            <View style={styles.settingBar}>
              <Ionicons name="wallet-outline" size={24} color="black" />
              <Text style={styles.settingText}>{t('profile.wallet')}</Text>
            </View>
            <View style={styles.settingBar}>
              <FontAwesome name="star-o" size={24} color="black" />
              <Text style={styles.settingText}>{t('rankings.yourRatings')}</Text>
            </View>
            <View style={styles.settingBar}>
              <Ionicons name="location-outline" size={24} color="black" />
              <Text style={styles.settingText}>{t('profile.savedAddresses')}</Text>
            </View>
            <View style={styles.settingBar}>
              <Ionicons name="settings-outline" size={24} color="black" />
              <Text style={styles.settingText}>{t('profile.settings')}</Text>
            </View>
            <View style={styles.settingBar}>
              <View style={{ width: 24, height: 24, borderWidth: 1, borderColor: 'black', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: '500' }}>SV</Text>
              </View>
              <Text style={styles.settingText}>{t('profile.about')}</Text>
            </View>
            <View style={styles.referAndEarnSection}>
              <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: '95%' }}>
                <View style={{ width: '70%' }}>
                  <Text style={{ fontWeight: 'bold' }}>{t('profile.referEarn')} ₹100 </Text>
                  <Text>{t('profile.referDescription')}</Text>

                </View>
                <Image source={require('../../assets/Profile/Gift.png')} style={{ width: 50, height: 50 }} />
              </View>
              <View style={{ backgroundColor: 'rgba(114, 16, 234, 0.7)', paddingVertical: 5, paddingHorizontal: 15, borderRadius: 5, borderWidth: 1, borderColor: 'black', alignSelf: 'flex-start', marginLeft: 10, marginTop: 10 }}>
                <Text style={{ fontWeight: '500', color: "white" }}>{t('profile.referEarn')}</Text>

              </View>
            </View>
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 10, borderColor: 'black', borderWidth: 1, padding: 10, borderRadius: 10 }}>
              <Text style={{ color: 'red', fontSize: 20, fontWeight: '500' }}>{t('profile.logout')}</Text>
            </View>
          </ScrollView>
        </View>
      </View>
      <BottomNavBar />
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profileOption: {
    backgroundColor: "rgba(69, 96, 244, 0.2)",
    width: '30%', height: 110, borderColor: 'black',
    borderWidth: 1, borderRadius: 10, justifyContent: 'center',
    paddingHorizontal: 10
  },
  profileOptionIcon: { width: 32, height: 32, position: 'relative', right: 4 },
  profileOptionText: { fontSize: 18, fontWeight: '500', width: '80%' },
  settingBar: { flexDirection: 'row', gap: 20, alignItems: 'center', marginBottom: 15 },
  settingText: { fontSize: 18, fontWeight: '400' },
  referAndEarnSection: {
    backgroundColor: "#BEC7F6",
    height: 130,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    width: '100%',
  }
});
