import NavBar from "@/components/NavBar";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
    Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavBar from "../../components/BottomNavBar";
import Ionicons from '@expo/vector-icons/Ionicons';
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/ErrorModal";

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
    let { job } = useLocalSearchParams();
    job = JSON.parse(job);
    console.log(job);
    let { height } = useWindowDimensions();
    height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

    const [isSuccessModal, setSuccessModal] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    async function handleConfirmWorker() {
        setSuccessModal(true);
    }

    function viewRequest(requestId,request){
        router.push({
            pathname: "/client/JobRequest",
            params: {
                request: JSON.stringify(request),
                requestId: requestId,
                jobId: job.job_id
            }
        })
    }

    const JobAcceptanceRequest = ({ request ,requestId}) => {
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
                    <TouchableOpacity style={{ backgroundColor: "#8AFF8A", padding: 10, borderRadius: 10, borderColor: 'green', borderWidth: 1 }} onPress={handleConfirmWorker}>
                        <Image source={require("../../assets/Jobs/accept.png")} style={{ width: 20, height: 20, borderRadius: 20 }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: "#FF5C5C", padding: 10, borderRadius: 10, borderColor: 'red', borderWidth: 1 }} onPress={() => setShowErrorAlert(true)}>
                        <Image source={require("../../assets/Jobs/reject.png")} style={{ width: 20, height: 20, borderRadius: 20 }} />
                    </TouchableOpacity>
                </View>
            </View >
        )
    }

    const RevisedProposalRequest = ({ request,requestId }) => {
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
                    <TouchableOpacity style={{ backgroundColor: "#e3e6e3", padding: 10, borderRadius: 10, borderColor: 'black', borderWidth: 1 }} onPress={()=>viewRequest(requestId,request)}>
                        <Ionicons name="eye" size={24} color="black" />
                    </TouchableOpacity>

                </View>
            </View >
        )
    }



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white", height, justifyContent: 'space-between' }}>
            <View style={styles.headerBg} />
            <NavBar />
            <View style={styles.horizontalLine} />
            <View style={styles.container}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, justifyContent: 'space-between', marginBottom: 10, }}>
                    <Text style={styles.cardTitle}>Job Details</Text>
                    <Text style={styles.posted}>Posted {timeAgo(job.posted_at)}</Text>
                </View>

                <View style={styles.card}>
                    {[
                        ["Status", job.status],
                        ["Service", job.service_type],
                        ["Job", job.job_details],
                        ["Description", job.description],
                        ["Duration", job.duration],
                        ["Location", job.location],
                        ["Budget Range", "₹" + job.budget_min + "-₹" + job.budget_max],
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
                        return (
                            actualResponse.type === "acceptance" ?
                                <JobAcceptanceRequest key={index} request={actualResponse} requestId = {responseId} /> :
                                actualResponse.type === "revised_proposal" ? <RevisedProposalRequest key={index} request={actualResponse} requestId = {responseId}/> : null
                        )
                    })
                    ) : <Text style={{ color: "black", fontSize: 16, textAlign: "center", marginTop: 20 }}>No responses yet</Text>

                }
                {/* <JobAcceptanceRequest request={{ workerName: "John Doe" }} />
                <RevisedProposalRequest request={{ workerName: "Mayuresh Choudhary and darshan choudhary " }} /> */}
            </View>
            <SuccessModal isVisible={isSuccessModal} toggleModal={() => setSuccessModal(!isSuccessModal)} title="Success!" message="Worker is Confirmed." handleOk={() => setSuccessModal(false)} />
            <ErrorModal isVisible={showErrorAlert} toggleModal={setShowErrorAlert} title="Reject" message="Request is rejected." />

            <BottomNavBar />
        </SafeAreaView>
    )
}

export default ViewJob

const styles = StyleSheet.create({
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
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
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
        width: "94%",
        backgroundColor: "white",
        marginBottom: 10,
        alignSelf: "center",
        marginTop : 10
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