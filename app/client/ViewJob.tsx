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
    Image,
    Alert,
    Modal,
    Pressable
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavBar from "../../components/BottomNavBar";
import Ionicons from '@expo/vector-icons/Ionicons';
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";
import { activityOnProposal, callUser, createRazorpayOrder, fetchJobDetails, fetchWorkerDetails, verifyRazorpayPayment } from "@/services/GlobalAPIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserId } from "@/utils/AsyncStorageUtils";
import { useTranslation } from "react-i18next";
import { CameraView, useCameraPermissions } from "expo-camera";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RazorpayCheckout from "react-native-razorpay";
import LoaderKitView from "react-native-loader-kit";

export function timeAgo(isoTime) {
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


const ViewJob = () => {
    const router = useRouter();
    // let { job } = useLocalSearchParams();
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language.toUpperCase();
    let { jobId } = useLocalSearchParams();
    console.log("Received jobId:", jobId);
    // job = JSON.parse(job);
    // console.log(job);
    let { height } = useWindowDimensions();
    height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

    const [showScanner, setShowScanner] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();

    const [showPaymentProcessingModal, setShowPaymentProcessingModal] = useState(false);

    const [user, setUser] = useState<string | null>('');
    const [name, setName] = useState<string | null>('');
    const [job, setJob] = useState({
        budget_max: "0",
        budget_min: "0",
        description: "-",
        duration: "0",
        job_details: "-",
        job_id: "-",
        location: "-",
        posted_at: "-",
        responses: [],
        service_type: "-",
        status: "-",
        user_id: "-"
    });
    const [worker, setWorker] = useState({
        name: "Worker",
        email: "abc@gmail.com",
        jobType: "General",
        workerRating: 0,
        jobsDoneCount: 0,
        experience: 0
    });

    const [isPaying, setIsPaying] = useState(false);

    const PAYMENT_AMOUNT_RUPEES = 100;

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("Worker is Confirmed.");

    const [isSuccessModal, setSuccessModal] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const [QRData, setQRData] = useState({});

    const handlePay = async (QRData) => {
        if (isPaying) return;
        try {
            if (job) {
                console.log("QR Data:", QRData);
                console.log("Job id:", jobId);
                console.log("Accepted worker id:", job.acceptedWorker);
                if (QRData.jobId !== jobId || QRData.workerId !== job.acceptedWorker) {
                    setErrorMessage("Scanned QR code does not match the job. Please scan the correct QR code.");
                    setShowErrorAlert(true);
                    return;
                }
                setIsPaying(true);
                const order = await createRazorpayOrder(job.budget_max || 100, null);

                const options: any = {
                    key: order.key_id,
                    amount: order.amount,
                    currency: order.currency,
                    order_id: order.order_id,
                    name: "SevaVaani",
                    description: "Test Payment",
                    prefill: {
                        name: name || "User",
                        email: "abc@gmail.com" || ""
                    },
                    theme: { color: "#4560F4" }
                };

                const data = await RazorpayCheckout.open(options);

                const verification = await verifyRazorpayPayment(
                    order.order_id,
                    data.razorpay_payment_id,
                    data.razorpay_signature,
                    jobId,
                    job.budget_max,
                    job.user_id,
                    QRData.clientName,
                    job.acceptedWorker,
                    QRData.workerName
                );
                console.log("Payment verification response:", verification);
                if (verification?.status === "success") {
                    // Alert.alert("Payment successful", "Your test payment was verified.");
                    setSuccessMessage("Payment successful");
                    setSuccessModal(true);
                } else {
                    // Alert.alert("Payment verification failed", "Please try again.");
                    setErrorMessage("Payment failed. Please try again.");
                    setShowErrorAlert(true);
                }
            }
        } catch (error: any) {
            Alert.alert("Payment failed", error?.message || "Something went wrong.");
        } finally {
            setIsPaying(false);
        }
    };

    const handleScanPress = async () => {
        if (!permission?.granted) {
            const { granted } = await requestPermission();
            if (!granted) {
                Alert.alert(t('navbar.permissionRequired'), t('navbar.cameraPermissionMessage'));
                return;
            }
        }
        setShowScanner(true);
    };

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        setShowScanner(false);
        console.log("QR Scan Result:", data);
        // Alert.alert(t('navbar.scanResult'), data, [{ text: t('common.ok') }]);
        data = JSON.parse(data);
        console.log("Parsed QR Data:", data.jobId);
        setQRData(data);
        setShowPaymentProcessingModal(true);

        setTimeout(() => {
            setShowPaymentProcessingModal(false);
            handlePay(data);
        }, 1500);
    };

    function viewRequest(requestId, request,optionEnabled) {
        console.log("Viewing request:", { requestId, request, optionEnabled });
        router.push({
            pathname: "/client/JobRequest",
            params: {
                request: JSON.stringify(request),
                requestId: requestId,
                jobId: jobId,
                optionEnabled : optionEnabled
            }
        })
    }

    const getJob = async () => {
        if (jobId) {
            const jobData = await fetchJobDetails(jobId, currentLanguage.toLocaleLowerCase());
            if (jobData) {
                // console.log("Fetched job details:", jobData);
                if (jobData.job_details.acceptedWorker) {
                    await getWorkerDetails(jobData.job_details.acceptedWorker, currentLanguage.toLocaleLowerCase());
                }
                // console.log("Job details set to state:", jobData.job_details);
                setJob(jobData.job_details);
            } else {
                setErrorMessage("Failed to fetch job details. Please try again later.");
                setShowErrorAlert(true);
            }
        }
    }

    useEffect(() => {
        getJob();
    }, [])

    useEffect(() => {
        const fetchUserId = async () => {
            const userId = await getUserId();
            console.log("Fetched User ID:", userId);
            if (!userId) {
                router.replace("/login");
            }
            const uname = await AsyncStorage.getItem("name");
            setUser(userId);
            setName(uname);
        }
        fetchUserId();

    }, [])

    async function handleConfirmWorker(request, requestId) {
        try {
            const res = await activityOnProposal(jobId, request.workerId, requestId, 1);
            console.log("Worker confirmation response:", res);
            setSuccessMessage("Worker is Confirmed.");
            setSuccessModal(true);
        } catch (err) {
            console.error("Error confirming worker:", err);
        }
    }

    async function handleRejectWorker(request, requestId) {
        try {
            const res = await activityOnProposal(jobId, request.workerId, requestId, 0);
            console.log("Worker rejection response:", res);
            setErrorMessage("Request is rejected.");
            setShowErrorAlert(true)
        } catch (err) {
            console.error("Error rejecting worker:", err);
        }
    }

    async function getWorkerDetails(uid, lang) {
        try {
            console.log("Fetching details for user ID:", uid);
            const workerData = await fetchWorkerDetails(uid, lang);
            console.log("worker details response:", workerData);
            setWorker(workerData.worker);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    }

    const JobAcceptanceRequest = ({ request, requestId, optionEnabled}) => {
        // console.log("Request ID:", requestId);
        return (
            <View style={{
                backgroundColor: "white",
                borderRadius: 10,
                padding: 16,
                // marginHorizontal: 20,
                // marginTop: 16,
                width: '100%',
                paddingVertical: 10,
                paddingHorizontal: 10,
                alignItems: 'center',
                justifyContent: "space-between",
                flexDirection: 'row'
            }}>
                <Text style={{ width: '70%', fontSize: 16 }}>Job Acceptance Request from {request.workerName}</Text>
                <View style={{ flexDirection: "row", gap: 5 }}>
                    <TouchableOpacity style={{ backgroundColor: "#8AFF8A", padding: 10, borderRadius: 10, borderColor: 'green', borderWidth: 1 }} onPress={() => handleConfirmWorker(request, requestId)} disabled={!optionEnabled}>
                        <Image source={require("../../assets/Jobs/accept.png")} style={{ width: 20, height: 20, borderRadius: 20 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: "#FF5C5C", padding: 10, borderRadius: 10, borderColor: 'red', borderWidth: 1 }} onPress={() => handleRejectWorker(request, requestId)} disabled={!optionEnabled}>
                        <Image source={require("../../assets/Jobs/reject.png")} style={{ width: 20, height: 20, borderRadius: 20 }} />
                    </TouchableOpacity>
                </View>
            </View >
        )
    }

    const RevisedProposalRequest = ({ request, requestId ,optionEnabled}) => {
        return (
            <View style={{
                backgroundColor: "white",
                borderRadius: 10,
                padding: 16,
                // marginHorizontal: 20,
                // marginTop: 16,
                width: '100%',
                paddingVertical: 10,
                paddingHorizontal: 10,
                alignItems: 'center',
                justifyContent: "space-between",
                flexDirection: 'row'
            }}>
                <Text style={{ width: '70%', fontSize: 16 }}>Negotiation Request from {request.workerName}</Text>
                <View style={{ flexDirection: "row", gap: 5 }}>
                    <TouchableOpacity style={{ backgroundColor: "#e3e6e3", padding: 10, borderRadius: 10, borderColor: 'black', borderWidth: 1 }} onPress={() => viewRequest(requestId, request,optionEnabled)}>
                        <Ionicons name="eye" size={24} color="black" />
                    </TouchableOpacity>

                </View>
            </View >
        )
    }

    const handleCall = async () => {
        if (job) {
            const workerId = job?.acceptedWorker;
            const response = await callUser(user, name, workerId);
            console.log("Call User Response:", response);

            if (response["code"] == -1) {
                Alert.alert('User offline', 'The recipient is offline, please try again after some time', [
                    {
                        text: 'OK',
                        onPress: () => console.log('OK Pressed'),
                    },
                ]);
            } else {
                router.push({
                    pathname: '/call/CallingScreen',
                    params: {
                        callee_uid: user,
                        callee_name: worker?.name || "Worker"
                    }
                });
            }
        }
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white", height, justifyContent: 'space-between' }}>
            <View style={styles.headerBg} />
            <NavBar />

            <View style={styles.horizontalLine} />
            <ScrollView style={{ flex: 1 }} style={{
                flex: 1,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                backgroundColor: 'white'
            }}
                contentContainerStyle={{ paddingBottom: 30 }} >
                <View style={styles.container}>

                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, justifyContent: 'space-between', marginBottom: 10, }}>
                        <Text style={styles.cardTitle}>Job Details</Text>
                        <Text style={styles.posted}>Posted {timeAgo(job?.posted_at)}</Text>
                    </View>

                    <View style={styles.card}>
                        {[
                            ["Status", job?.status],
                            ["Service", job?.service_type],
                            ["Job", job?.job_details],
                            ["Description", job?.description],
                            ["Duration", job?.duration],
                            ["Location", job?.location],
                            ["Budget Range", "₹" + job?.budget_min + "-₹" + job?.budget_max],
                        ].map(([label, value]) => (
                            <View key={label} style={styles.row}>
                                <Text style={styles.label}>{label}</Text>
                                {label === "Description" ? <Text style={{
                                    fontSize: 15,
                                    fontWeight: "500",
                                    width: 200,
                                    textAlign: 'right'
                                }}>{value}</Text> : <Text style={styles.value}>{value}</Text>}
                            </View>
                        ))}
                    </View>
                    {(job?.status === "assigned" || job?.status === "completed") && job?.acceptedWorker && (
                        <>
                            <View style={styles.workerCard}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <Text style={styles.sectionHeading}>Worker Information</Text>
                                    <Text style={[styles.sectionHeading, { alignSelf: 'flex-end' }]}>#{worker.jobType}</Text>
                                </View>
                                <View style={styles.workerRow}>
                                    <View style={styles.avatar}>
                                        <Text style={styles.avatarText}>{worker?.name[0]}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.name}>{worker?.name}</Text>
                                        {worker?.jobsDoneCount === 0 ? <Text style={styles.jobs}>No Jobs Completed</Text> : <Text style={styles.jobs}>• {worker?.jobsDoneCount} Jobs Completed</Text>}
                                    </View>
                                    <View style={styles.ratingBox}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <Text style={styles.star}>★</Text>
                                            <Text style={styles.rating}>{worker?.workerRating}</Text>
                                        </View>
                                        <Text style={{ fontSize: 12, color: "black" }}>{worker?.experience} yrs experience</Text>
                                    </View>
                                </View>
                                <View style={styles.actionRow}>
                                    <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
                                        <Text style={styles.callText}>📞 Call Worker</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.msgBtn} onPress={() => {
                                        router.push({
                                            pathname: '/client/ChatScreen',
                                            params: { workerId: job?.acceptedWorker || "sgsdsdg", workerName: worker?.name }
                                        });
                                    }}>
                                        <Text style={styles.msgText}>💬 Send Message</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <TouchableOpacity style={{ height: 50, backgroundColor: "#9facf3", borderRadius: 10, justifyContent: "center", alignItems: "center", marginTop: 10, borderWidth: 1, borderColor: "blue", flexDirection: 'row', gap: 10 }} onPress={handleScanPress} >
                                {/* <AntDesign name="qrcode" size={24} color="black" /> */}
                                <MaterialCommunityIcons name="qrcode-scan" size={24} color="black" />
                                <Text>Scan to complete job</Text>
                            </TouchableOpacity></>
                    )
                    }
                    <View style={[styles.horizontalLine, { backgroundColor: 'grey', width: '100%', marginVertical: 10 }]} />
                </View>
                <View style={[styles.card, {
                    borderRadius: 0,
                    // backgroundColor: '#578cf7', 
                    flex: 1, gap: 10
                }]}>
                    <Text style={styles.cardTitle}>Workers Response</Text>
                    {job?.responses ?
                        job?.responses?.length > 0 &&
                        (job?.responses?.map((response, index) => {
                            const [responseId, actualResponse] = Object.entries(response)[0];
                            console.log("Response ID:", responseId);
                            console.log("Actual Response:", actualResponse);
                            return (
                                actualResponse.type === "acceptance" ?
                                    <JobAcceptanceRequest key={index} request={actualResponse} requestId={responseId} optionEnabled={job.status==="assigned" || job.status==="completed" ? false : true} /> :
                                    actualResponse.type === "revised_proposal" ? <RevisedProposalRequest key={index} request={actualResponse} requestId={responseId} optionEnabled={job.status==="assigned" || job.status==="completed" ? false : true} /> : null
                            )
                        })
                        ) : <Text style={{ color: "black", fontSize: 16, textAlign: "center", marginTop: 20 }}>No responses yet</Text>

                    }
                    {/* <JobAcceptanceRequest request={{ workerName: "John Doe" }} />
                <RevisedProposalRequest request={{ workerName: "Mayuresh Choudhary and darshan choudhary " }} /> */}
                </View>
            </ScrollView>
            <SuccessModal isVisible={isSuccessModal} toggleModal={() => setSuccessModal(!isSuccessModal)} title="Success!" message={successMessage} handleOk={() => {
                setSuccessModal(false);
                getJob()
            }} />
            <ErrorModal isVisible={showErrorAlert} toggleModal={setShowErrorAlert} title="Reject" message={errorMessage} />

            <BottomNavBar />

            <Modal
                visible={showScanner}
                animationType="slide"
                onRequestClose={() => setShowScanner(false)}
            >
                <View style={styles.scannerContainer}>
                    <CameraView
                        style={StyleSheet.absoluteFillObject}
                        onBarcodeScanned={showScanner ? handleBarCodeScanned : undefined}
                        barcodeScannerSettings={{
                            barcodeTypes: ["qr"],
                        }}
                    />
                    <View style={styles.overlay}>
                        <Text style={styles.scanText}>{t('navbar.alignQRCode')}</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowScanner(false)}
                        >
                            <Text style={styles.closeButtonText}>{t('common.cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                transparent={true}
                visible={showPaymentProcessingModal}
                animationType="fade"
                onRequestClose={() => {
                    // console.log("attempt to close modal") 
                }}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => {
                        //  console.log("attempt to close modal")
                    }}
                >
                    <View style={styles.modalView}>
                        <Text style={{ color: 'black', fontSize: 16 }}>Proceeding to payment...</Text>
                        <LoaderKitView
                            style={{ width: 50, height: 50 }}
                            name={"BallTrianglePath"}
                            animationSpeedMultiplier={1.0} // speed up/slow down animation, default: 1.0, larger is faster
                            color={"green"} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
                        />
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    )
}

export default ViewJob

const styles = StyleSheet.create({
    qrIcon: {
        marginLeft: 10,
        backgroundColor: '#D7D3D3',
        borderRadius: 8,
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
    }, scannerContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    modalOverlay: {
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
    overlay: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 50,
    },
    scanText: {
        color: 'white',
        fontSize: 18,
        marginBottom: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 5,
    },
    closeButton: {
        backgroundColor: '#4560F4',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    workerCard: {
        backgroundColor: "#E4E7FF",
        borderRadius: 20,
        padding: 16,
        // marginHorizontal: 20,
        borderWidth: 1,
        borderColor: "#000",
        marginTop: 10
    },
    sectionHeading: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 10,
    },

    workerRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    avatar: {
        height: 44,
        width: 44,
        borderRadius: 22,
        backgroundColor: "#2F4BE3",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },

    avatarText: {
        color: "white",
        fontWeight: "bold",
    },

    name: {
        fontSize: 16,
        fontWeight: "500",
    },

    jobs: {
        fontSize: 12,
    },

    ratingBox: {
        alignItems: "center",
    },

    star: {
        color: "#FFD700",
        fontSize: 18,
    },

    rating: {
        fontSize: 16,
        marginLeft: 4,
    },

    actionRow: {
        flexDirection: "row",
        marginTop: 14,
        gap: 10,
    },

    callBtn: {
        flex: 1,
        backgroundColor: "#4560F4",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        borderWidth: 1,
    },

    callText: {
        color: "white",
        fontWeight: "500",
    },

    msgBtn: {
        flex: 1,
        backgroundColor: "#9FD0DC",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        borderWidth: 1,
    },

    msgText: {
        fontWeight: "500",
    },

    headerBg: {
        backgroundColor: "#4560F4",
        height: 220,
        width: "100%",
        position: "absolute",
    },
    posted: {
        textAlign: "center",
        fontWeight: '400',
        fontSize: 13,
        color: 'grey'
    },
    container: {
        // backgroundColor: "yellow",
        backgroundColor: "white",
        // flex: 1,
        marginTop: 10,
        paddingHorizontal: 17,
        // height: '50%',
        paddingTop: 15,
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
    horizontalLine: {
        height: 1,
        width: "90%",
        backgroundColor: "white",
        marginBottom: 10,
        alignSelf: "center",
        marginTop: 10
    },
    card: {
        backgroundColor: "#F4F6FF",
        borderRadius: 16,
        padding: 16,
        // marginHorizontal: 20,
        // marginTop: 16,
        width: '100%',
    },

    cardTitle: {
        fontSize: 20,
        fontWeight: "500",
        marginBottom: 5
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#DDD",
    },

    label: {
        fontSize: 15,
    },

    value: {
        fontSize: 15,
        fontWeight: "500",
    },

    messageBox: {
        backgroundColor: "#9FD0DC",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },

    voiceBox: {
        backgroundColor: "#9FD0DC",
        padding: 12,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

})