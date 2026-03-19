import NavBar from "@/components/NavBar";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavBar from "../../components/BottomNavBar";
import { activityOnProposal, fetchWorkerDetails } from "@/services/GlobalAPIs";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
const JobRequest = () => {
  const router = useRouter();
  let { request, requestId, jobId, optionEnabled } = useLocalSearchParams();
  console.log("Received params:", { request, requestId, jobId, optionEnabled });
  request = JSON.parse(request);
  let { height } = useWindowDimensions();
  height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);
  const [worker, setWorker] = useState({
    name: "Worker",
    email: "",
    jobType: "",
    workerRating: 0,
    jobsDoneCount: 0,
    experience: 0
  });

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language.toLocaleLowerCase();

  const [isSuccessModal, setSuccessModal] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const [errorMessage, setErrorMessage] = useState("Request Rejected.");

  async function handleConfirmWorker() {
    try {
      if (optionEnabled === "false") {
        setErrorMessage("The job is already assigned to another worker. You cannot accept this request.");
        setShowErrorAlert(true);
        return;
      }
      const res = await activityOnProposal(jobId, request.workerId, requestId, 1);
      console.log("Worker confirmation response:", res);
      setSuccessModal(true);
    } catch (err) {
      console.error("Error confirming worker:", err);
    }
  }

  async function handleRejectWorker() {
    try {
      if (optionEnabled === "false") {
        setErrorMessage("The job is already assigned to another worker. You cannot reject this request.");
        setShowErrorAlert(true);
        return;
      }
      const res = await activityOnProposal(jobId, request.workerId, requestId, 0);
      console.log("Worker rejection response:", res);
      setErrorMessage("Request Rejected.");
      setShowErrorAlert(true)
    } catch (err) {
      console.error("Error rejecting worker:", err);
    }
  }

  async function getUserDetails(uid) {
    try {
      console.log("Fetching details for user ID:", uid);
      const workerData = await fetchWorkerDetails(uid, currentLanguage);
      console.log("Worker details response:", workerData);
      setWorker(workerData.worker);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }

  useEffect(() => {
    const startFunction = async () => {
      console.log("Received job id:", jobId);
      if (jobId) {
        await getUserDetails(request.workerId);
      }
    }
    startFunction();
  }, [jobId]);


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
      fontSize: currentLanguage=="EN"?16 : 14,
      fontWeight: "600",
    },
    horizontalLine: {
      height: 1,
      width: "90%",
      backgroundColor: "white",
      marginBottom: 10,
      alignSelf: "center",
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", height, justifyContent: 'space-between' }}>
      <View style={styles.headerBg} />

      <NavBar />
      <View style={styles.horizontalLine} />
      <View style={styles.container}>
        <View style={{ flexDirection: "row", width: "100%", alignItems: "center" }}>
          <Text style={styles.pageTitle}>{t('jobRequest.title')} {worker.name}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.workerRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{worker.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.workerName}>{worker.name}</Text>
                <Text style={styles.rating}><AntDesign name="star" size={12} color="gold" style={{ alignSelf: 'center' }} /> {typeof worker.workerRating === 'number' ? worker.workerRating.toFixed(3).substring(0, 3) : worker.workerRating} ({worker.jobsDoneCount} Jobs Completed)</Text>
                <Text style={styles.exp}>{t('jobRequest.experience')} - {worker.experience} {t('jobRequest.years')}</Text>
              </View>

              <Text style={styles.profession}>{worker.jobType}</Text>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{t('jobRequest.pricingDetails')}</Text>
            <Text style={styles.bullet}>• {t('jobRequest.serviceCharge')}: ₹480</Text>
            <Text style={styles.bullet}>• {t('jobRequest.inspectionFee')}: {t('jobRequest.included')}</Text>

            <Text style={styles.bullet}>
              • {t('jobRequest.additionalParts')}

            </Text>
            <Text style={styles.bullet}>• {t('jobRequest.taxesIncluded')}</Text>


            <Text style={[styles.sectionTitle, { marginTop: 15 }]}>
              {t('jobRequest.scopeOfWork')}

            </Text>
            <Text style={styles.bullet}>• {t('jobRequest.scopeItem1')}</Text>

            <Text style={styles.bullet}>
              • {t('jobRequest.scopeItem2')}

            </Text>
            <Text style={styles.bullet}>
              • {t('jobRequest.scopeItem3')}

            </Text>
            <Text style={styles.bullet}>
              • {t('jobRequest.scopeItem4')}

            </Text>
            <Text style={[styles.sectionTitle, { marginTop: 15 }]}>
              {t('jobRequest.timeAvailability')}

            </Text>
            <Text style={styles.bullet}>
              • {t('jobRequest.estimatedDuration')}

            </Text>
            <Text style={styles.bullet}>
              • {t('jobRequest.availabilityNote')}

            </Text>
            <TouchableOpacity style={styles.chatBtn}>
              <Text style={styles.chatText}>{t('jobRequest.startChat')}</Text>
            </TouchableOpacity>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.declineBtn} onPress={handleRejectWorker}>
                <Text style={styles.actionText}>{t('jobRequest.rejectRequest')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptBtn} onPress={handleConfirmWorker}>
                <Text style={[styles.actionText, { color: "white" }]}>
                  {t('jobRequest.acceptRequest')}

                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      <SuccessModal isVisible={isSuccessModal} toggleModal={() => setSuccessModal(!isSuccessModal)} title="Success!" message="Request Accepted." handleOk={() => {
        setSuccessModal(false);
        router.push({ pathname: "/client/ViewJob", params: { jobId: jobId } });
      }} />
      <ErrorModal isVisible={showErrorAlert} toggleModal={setShowErrorAlert} title="Reject" message={errorMessage} />
      <BottomNavBar />
    </SafeAreaView>
  );
};
export default JobRequest;
