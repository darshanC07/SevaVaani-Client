import NavBar from "@/components/NavBar";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavBar from "../../components/BottomNavBar";
const JobRequest = () => {
  const router = useRouter();
  let { height } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", height, justifyContent: 'space-between' }}>
      <View style={styles.headerBg} />

      <NavBar />
      <View style={styles.horizontalLine} />
      <View style={styles.container}>
        <View style={{ flexDirection: "row", width: "100%", alignItems: "center" }}>
          <Text style={styles.pageTitle}>Job request from Kishor Kumar</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.workerRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>KK</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.workerName}>Kishor Kumar</Text>
                <Text style={styles.rating}><AntDesign name="star" size={12} color="gold" style={{ alignSelf: 'center' }} /> 4.7 (150+ Jobs Completed)</Text>
                <Text style={styles.exp}>Experience - 6 Years</Text>
              </View>

              <Text style={styles.profession}>Plumber</Text>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Pricing Details</Text>
            <Text style={styles.bullet}>• Service Charge: ₹480</Text>
            <Text style={styles.bullet}>• Inspection Fee: Included</Text>
            <Text style={styles.bullet}>
              • Additional Parts: Charged only if required
            </Text>
            <Text style={styles.bullet}>• Taxes: Included</Text>

            <Text style={[styles.sectionTitle, { marginTop: 15 }]}>
              Scope of Work
            </Text>
            <Text style={styles.bullet}>• Inspection of bathroom tap</Text>
            <Text style={styles.bullet}>
              • Fixing leakage or loose fitting
            </Text>
            <Text style={styles.bullet}>
              • Replacement of washer/seal if required
            </Text>
            <Text style={styles.bullet}>
              • Basic functionality testing after repair
            </Text>
            <Text style={[styles.sectionTitle, { marginTop: 15 }]}>
              Time & Availability
            </Text>
            <Text style={styles.bullet}>
              • Estimated Duration: 30–40 minutes
            </Text>
            <Text style={styles.bullet}>
              • Availability: Can start within 1 hour
            </Text>
            <TouchableOpacity style={styles.chatBtn} onPress={() => router.push({
              pathname: "/client/ChatScreen",
              params: { 
                workerId: "NDlBf2F83abhtYaqVUSk0RC49K73", 
                workerName: "Worker" 
              }
            })}>
              <Text style={styles.chatText}>Chat with worker</Text>
            </TouchableOpacity>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.declineBtn}>
                <Text style={styles.actionText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptBtn}>
                <Text style={[styles.actionText, { color: "white" }]}>
                  Accept
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      <BottomNavBar />
    </SafeAreaView>
  );
};
export default JobRequest;

const styles = StyleSheet.create({
  headerBg: {
    backgroundColor: "#4560F4",
    height: 220,
    width: "100%",
    position: "absolute",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 15,
  },
  topRightIcons: {
    flexDirection: "row",
    gap: 10,
  },
  iconBtn: {
    backgroundColor: "white",
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  container: {
    backgroundColor: "white",
    // flex: 1,
    // marginTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    height: '80%',

  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 15,
  },
  card: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  workerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4560F4",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
  },
  workerName: {
    fontSize: 18,
    fontWeight: "600",
  },
  rating: {
    fontSize: 14
  },
  exp: {
    fontSize: 14,
    color: "gray",
  },
  profession: {
    fontSize: 16,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  bullet: {
    fontSize: 15,
    marginBottom: 5,
  },
  chatBtn: {
    backgroundColor: "#BFC9FF",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    marginTop: 15,
  },
  chatText: {
    fontSize: 16,
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  declineBtn: {
    backgroundColor: "#9CCBD6",
    width: "48%",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  acceptBtn: {
    backgroundColor: "#4560F4",
    width: "48%",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
  },
  horizontalLine: {
    height: 1,
    width: "94%",
    backgroundColor: "white",
    marginBottom: 10,
    alignSelf: "center",
  },
});