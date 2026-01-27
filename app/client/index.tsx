import BottomNavBar from "@/components/BottomNavBar";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Immersive from 'react-native-immersive';
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../../components/NavBar";
const Index = () => {
  const router = useRouter();

  const navImage = require("../../assets/Client_HomeScreen/Washing_man.png");
  const searchIcon = require("../../assets/Client_HomeScreen/Search.png");
  const addIcon = require("../../assets/Client_HomeScreen/add.png");
  const plumbingIcon = require("../../assets/Client_HomeScreen/Plumbing.png");

  let { height } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ?? 24);

  useEffect(() => {
    Immersive.on();

    return () => {
      Immersive.off();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <NavBar />

      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <View style={styles.horizontalLine} />

          <View style={styles.headerRow}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.greetingText}>Good morning Ramesh</Text>
              <Text style={styles.headerMainText}>
                Post a job and get workers near you
              </Text>
            </View>

            <Image source={navImage} style={styles.headerImage} />
          </View>

          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search Jobs..."
              placeholderTextColor="grey"
            />
            <View style={styles.searchIconBox}>
              <Image source={searchIcon} style={styles.searchIcon} />
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>My Jobs Overview</Text>

          <View style={styles.overviewRow}>
            <View style={styles.leftColumn}>
              <View style={styles.cardLarge}>
                <Text style={styles.cardTitle}>Posted Jobs</Text>
                <Text style={styles.cardNumber}>11</Text>
              </View>

              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>Active</Text>
                <Text style={styles.cardNumber}>2</Text>
                <Text style={styles.cardSubText}>ongoing jobs</Text>
              </View>
            </View>

            <View style={styles.rightColumn}>
              <View style={styles.ratingCard}>
                <Text style={styles.cardTitle}>Your Rating</Text>
                <Text style={styles.cardNumber}>4.5</Text>
              </View>

              <View style={styles.bottomCardsRow}>
                <View style={styles.actionCard}>
                  <Image source={addIcon} style={styles.addIcon} />
                  <Text style={styles.actionText}>Post a New Job</Text>
                </View>

                <View style={styles.completedCard}>
                  <Text style={styles.cardNumber}>9</Text>
                  <Text style={styles.cardTitle}>Completed Jobs</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.scrollView}>
            <Text style={styles.recentTitle}>My Recent Jobs</Text>

            <ScrollView style={{flex : 1,paddingVertical  : 10}}>
              <View style={styles.jobCard}>
                <View style={styles.jobHeader}>
                  <Image source={plumbingIcon} style={styles.jobIcon} />
                  <Text style={styles.jobTitle}>
                    Repairing of bathroom tap
                  </Text>
                  <Text style={styles.jobTime}>2 mins ago</Text>
                </View>

                <View style={styles.jobFooter}>
                  <Text style={styles.jobStatus}>Completed</Text>
                  <TouchableOpacity style={styles.viewRequestButton}>
                    <Text style={styles.viewRequest}>View Request</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>

      <BottomNavBar />
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  topContainer: {
    height: 150,
    backgroundColor: "#4560F4",
    paddingHorizontal: 20,
  },
  horizontalLine: {
    height: 1,
    width: "94%",
    backgroundColor: "white",
    marginBottom: 10,
    alignSelf: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
    paddingTop: 10,
  },
  greetingText: {
    color: "white",
    fontSize: 15,
  },
  headerMainText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  headerImage: {
    width: 70,
    height: 67,
    resizeMode: "contain",
  },
  searchRow: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    gap: 5,
  },
  searchBar: {
    width: "85%",
    height: 45,
    borderColor: "black",
    borderWidth: 1,
    backgroundColor: "white",
    borderRadius: 10,
    color: "black",
    paddingHorizontal: 10,
    fontSize: 16,
  },
  searchIconBox: {
    height: 45,
    width: 45,
    backgroundColor: "#2781E2",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  searchIcon: {
    height: 30,
    width: 30,
  },
  contentContainer: {
    width: "94%",
    height: "69%",
    borderRadius: 10,
    alignSelf: "center",
    position: "relative",
    top: 30,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "500",
    color: "#4c4b4b",
  },
  overviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    height: 160,
  },
  leftColumn: {
    width: "43%",
    gap: 5,
  },
  rightColumn: {
    width: "55%",
    gap: 5,
  },
  cardLarge: {
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "60%",
  },
  cardRow: {
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "40%",
    gap: 8,
  },
  ratingCard: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    height: "30%",
    gap: 10,
  },
  bottomCardsRow: {
    flexDirection: "row",
    height: "70%",
    gap: 5,
  },
  actionCard: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    width: "49%",
  },
  completedCard: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    width: "49%",
  },
  cardTitle: {
    fontSize: 17,
    color: "black",
    textAlign: "center",
  },
  cardNumber: {
    fontSize: 27,
    fontWeight: "bold",
    color: "black",
  },
  cardSubText: {
    fontSize: 12,
    color: "black",
    width: 50,
  },
  addIcon: {
    width: 30,
    height: 30,
  },
  actionText: {
    fontSize: 16,
    color: "black",
    marginTop: 10,
    textAlign: "center",
  },
  scrollView: {
    marginTop: 15,
    height: "59%",
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    backgroundColor: "#fff",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 10,
  },
  recentTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  jobCard: {
    backgroundColor: "rgba(180,190,245,0.5)",
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
    marginBottom : 10
  },
  jobHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  jobIcon: {
    width: 30,
    height: 30,
  },
  jobTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  jobTime: {
    fontSize: 12,
    color: "black",
  },
  jobFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  jobStatus: {
    fontSize: 16,
    color: "#656363",
  },
  viewRequestButton: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#4560F4",
    height: 40,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  viewRequest: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
