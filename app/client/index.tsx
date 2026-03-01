import BottomNavBar from "../../components/BottomNavBar";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../../components/NavBar";
import { getUserId } from "../../utils/AsyncStorageUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchJobs, getPlan } from "../../services/GlobalAPIs";
import { initExtractorModel, predictAnswer, loadVocab } from '../../utils/Extractor';
import { GlobalStatesContext } from "@/contexts/GlobalContext";
import { useTranslation } from "react-i18next";
import LoaderKitView from "react-native-loader-kit";


const Index = () => {
  const router = useRouter();

  const contextObj = useContext(GlobalStatesContext);

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language.toUpperCase();

  const [showLoading, setShowLoading] = useState(false);

  const [user, setUser] = useState<string | null>('');
  const [name, setName] = useState<string | null>('');
  const [email, setEmail] = useState<string | null>('');

  const [jobData, setJobData] = useState([]);
  const [isJobDataLoading, setIsJobDataLoading] = useState(false);

  const navImage = require("../../assets/Client_HomeScreen/Washing_man.png");
  const searchIcon = require("../../assets/Client_HomeScreen/Search.png");
  const addIcon = require("../../assets/Client_HomeScreen/add.png");
  const worker = require("../../assets/Client_HomeScreen/worker.png");
  const plumbingIcon = require("../../assets/Client_HomeScreen/Plumbing.png");

  let { height } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ?? 24);

  // useEffect(() => {
  //   Immersive.on();

  //   return () => {
  //     Immersive.off();
  //   };
  // }, []);

  async function getJobData(userId) {
    setIsJobDataLoading(true);
    try {

      const data = await fetchJobs(userId, currentLanguage.toLocaleLowerCase());
      console.log("Raw job data response:", data);
      if (data) {
        console.log("Fetched job data:", data.jobs);
        console.log("type : ", typeof data.jobs);
        setJobData(data.jobs);
      } else {
        console.error("Failed to fetch job data - data.length:", data.jobs.length);
      }
    } catch (error) {
      console.error("Error fetching job data:", error);
    } finally {
      setIsJobDataLoading(false);
    }
  }

  const handlePlan = async () => {
    try {
      const plan = await AsyncStorage.getItem("plan");
      // if (!plan && user) {
        const res = await getPlan(user);
        console.log("Fetched plan from API:", res);
        if (res && res.plan) {
          await AsyncStorage.setItem("plan", res.plan);
          console.log("Plan stored in AsyncStorage:", res.plan);
        } else {
          console.error("Failed to fetch plan from API - invalid response:", res);
          await AsyncStorage.setItem("plan", "Basic");
        }
      // }
      // else{

      // }
    } catch (error) {
      console.error("Error fetching plan from AsyncStorage:", error);
    }
  }

  useEffect(() => {
    if (user) {
      getJobData(user);
      handlePlan();
    }
  }, [currentLanguage])

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserId();
      console.log("Fetched User ID:", userId);
      if (!userId) {
        router.replace("/login");
      }
      const uname = await AsyncStorage.getItem("name");
      const uemail = await AsyncStorage.getItem("email");
      setUser(userId);
      setName(uname);
      setEmail(uemail);
      getJobData(userId);

      // const answer = await predictAnswer("What is the job description?",
      //   "My bathroom taps are leaking and I need someone to fix them")
      // console.log("predicted answer : ", answer)
      // const answer = await predictAnswer("What is the job title?",
      //    "i want to post a job for fixing bathroom taps")
      //  console.log("predicted answer : ", answer)
    }
    fetchUserId();

  }, [])

  useEffect(() => {
    if (!contextObj.isIemodelLoaded) {
      setShowLoading(true);
    } else {
      setShowLoading(false);
    }
  }, [contextObj.isIemodelLoaded])

  function timeAgo(isoTime) {
    const past = new Date(isoTime);
    const now = new Date();
    const diff = now - past;

    const sec = Math.floor(diff / 1000);
    if (sec < 60) return `${sec} seconds ago`;

    const min = Math.floor(sec / 60);
    if (min < 60) return `${min} minutes ago`;

    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr} hours ago`;

    const day = Math.floor(hr / 24);
    return `${day} days ago`;
  }


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
      fontSize: currentLanguage === "EN" ? 30 : currentLanguage === "HI" ? 25 : 23,
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
    loadingModalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add a semi-transparent background
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 30,
      gap: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
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
      // gap : 5
    },
    leftColumn: {
      width: "44%",
      gap: 5,
    },
    rightColumn: {
      width: "54%",
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
      width: "100%",
      gap: 5,
      flex: 1,
    },
    actionCard: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      borderColor: "black",
      borderWidth: 1,
      width: '100%',
      height: "100%",
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
    workerIcon: {
      width: 40,
      height: 40,
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
      marginBottom: 10
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
      height: 30,
      width: "30%",
      justifyContent: "center",
      alignItems: "center",
    },
    viewRequest: {
      color: "white",
      fontWeight: "bold",
      fontSize: 14,
    },
  });


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <NavBar />

      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <View style={styles.horizontalLine} />

          <View style={styles.headerRow}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.greetingText}>{t('client.goodMorning')} {name}</Text>

              <Text style={styles.headerMainText}>
                {t('client.postJobHeader')}
              </Text>
            </View>

            <Image source={navImage} style={styles.headerImage} />
          </View>

          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchBar}
              placeholder={t('client.searchJobs')}
              placeholderTextColor="grey"
            />
            <View style={styles.searchIconBox}>
              <Image source={searchIcon} style={styles.searchIcon} />
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>{t('client.myJobsOverview')}</Text>


          <View style={styles.overviewRow}>
            <View style={styles.leftColumn}>
              <View style={styles.cardLarge}>
                <Text style={styles.cardTitle}>{t('client.postedJobs')}</Text>
                <Text style={styles.cardNumber}>11</Text>
              </View>

              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>{t('client.active')}</Text>
                <Text style={styles.cardNumber}>2</Text>
                <Text style={styles.cardSubText}>{t('client.ongoingJobs')}</Text>
              </View>
            </View>

            <View style={styles.rightColumn}>
              <View style={styles.ratingCard}>
                <Text style={styles.cardTitle}>{t('client.yourRating')}</Text>
                <Text style={styles.cardNumber}>4.5</Text>
              </View>

              <View style={styles.bottomCardsRow}>
                <TouchableOpacity onPress={() => router.push("/client/PostNewJob")} style={{ flex: 1 }}>
                  <View style={styles.actionCard}>
                    <Image source={addIcon} style={styles.addIcon} />
                    <Text style={styles.actionText}>{t('client.postNewJob')}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/client/WorkerRankingScreen")} style={{ flex: 1 }}>
                  <View style={styles.actionCard}>
                    <Image source={worker} style={styles.workerIcon} />
                    <Text style={styles.actionText}>Workers</Text>
                  </View>
                </TouchableOpacity>
                {/* <View style={styles.completedCard}>
                  <Text style={styles.cardNumber}>9</Text>
                  <Text style={styles.cardTitle}>Completed Jobs</Text>
                </View> */}
              </View>
            </View>
          </View>

          <View style={styles.scrollView}>
            <Text style={styles.recentTitle}>{t('client.myRecentJobs')}</Text>

            <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
              {isJobDataLoading ? <Text>Loading...</Text> :
                jobData.length === 0 ? <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}><Text>No recent jobs found.</Text></View> : (
                  // console.log("Rendering job data:", jobData[1].responses),
                  jobData.map((job, index) => (
                    <View style={styles.jobCard} key={job.job_id}>
                      <View style={styles.jobHeader}>
                        <Image source={plumbingIcon} style={styles.jobIcon} />
                        <Text style={styles.jobTitle}>
                          {job.job_details}
                        </Text>
                        <Text style={styles.jobTime}>{timeAgo(job.posted_at)}</Text>
                      </View>

                      <View style={styles.jobFooter}>
                        <Text style={styles.jobStatus}>{job.status}</Text>
                        <TouchableOpacity style={styles.viewRequestButton}
                          // onPress={() => router.push("/client/JobRequest")}
                          onPress={() => router.push({
                            pathname: "/client/ViewJob",
                            // params: { job: JSON.stringify(job) }
                            params: { jobId: job.job_id }
                          })}
                        >
                          <Text style={styles.viewRequest}>View</Text>
                        </TouchableOpacity>
                      </View>
                    </View>)))
              }
            </ScrollView>
          </View>
        </View>
      </View >

      <Modal
        transparent={true}
        visible={showLoading}
        animationType="fade"
        onRequestClose={() => {
          // console.log("attempt to close modal") 
        }}
      >
        <Pressable
          style={styles.loadingModalOverlay}
          onPress={() => {
            //  console.log("attempt to close modal")
          }}
        >
          <View style={styles.modalView}>
            <Text style={{ color: 'black', fontSize: 16 }}>Loading Assistant</Text>
            <LoaderKitView
              style={{ width: 50, height: 50 }}
              name={"BallSpinFadeLoader"}
              animationSpeedMultiplier={1.0} // speed up/slow down animation, default: 1.0, larger is faster
              color={"blue"} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
            />
          </View>
        </Pressable>
      </Modal>

      <BottomNavBar />
    </SafeAreaView >
  );
};

export default Index;

