import BottomNavBar from '@/components/BottomNavBar';
import NavBar from '@/components/NavBar';
import { callUser, fetchNearByWorkers } from '@/services/GlobalAPIs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserId } from '@/utils/AsyncStorageUtils';
import { useTranslation } from 'react-i18next';

type MapContainerProps = {
    NearByWorkersLocList?: Array<[string, { lat: number; long: number }]>;
    UserLoc?: { lat: number; long: number };
};


const WorkerRankBar = ({ data, id, userId, userName }) => {
    const [iconToggle, setIconToggle] = useState(false);
    const handlePress = () => {
        setIconToggle(true);

        setTimeout(() => {
            setIconToggle(false);
        }, 200);

        router.push({
            pathname: '/client/ChatScreen',
            params: { workerId: data[0], workerName: data[2] }
        });

    };
    return (
        <View style={{
            backgroundColor: 'white', width: '100%', height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, justifyContent: 'space-between', marginBottom: 15, borderWidth: 0.5, borderColor: 'grey',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.18,
            shadowRadius: 12,
            elevation: 4,
            borderRadius: 10
        }}>
            <View><Text>{id + 1}</Text></View>
            <View style={{ justifyContent: 'center', alignItems: 'left' }}>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>{data[2] || "User"}</Text>
                <Text style={{ fontSize: 14, color: 'grey' }}>{data[4] || "Worker"}</Text>
            </View>
            <View>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>Rating : 
                 {typeof data[3] === 'number' ? data[3].toFixed(3).substring(0, 3) : data[3]}</Text>
            </View>
            <TouchableOpacity onPress={async () => {
                // const userId = getUserId();
                // const userId = "0qD34d7S4FaD6afL6cVN3nOE9zJ2";
                // const clientName = "Dayanand"
                const workerId = data[0];
                console.log("userId:", userId, "workerId:", workerId, "userName:", userName);
                const response = await callUser(userId, userName, workerId);
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
                            callee_uid: workerId,
                            callee_name: data[2] || "Worker"
                        }
                    });
                }
            }}>
                <MaterialIcons name="call" size={24} color="green" />
            </TouchableOpacity>
            <TouchableWithoutFeedback onPress={handlePress}>
                {iconToggle ? (
                    <Ionicons name="chatbubbles-sharp" size={28} color="#1565C0" />
                ) : (
                    <Ionicons name="chatbubbles-outline" size={28} color="#5a5757" />
                )}
            </TouchableWithoutFeedback>
        </View>
    )
}

const MapContainer = ({
    NearByWorkersLocList = [],
    UserLoc = { lat: 0, long: 0 },
}: MapContainerProps) => {
    const initialLocation = {
        latitude: UserLoc.lat,
        longitude: UserLoc.long,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };
    const ref = useRef<MapView>(null);
    return (
        <View style={{ flex: 1 }}>
            <MapView style={{
                width: '100%',
                height: '100%',
            }}
                userInterfaceStyle="light"
                showsUserLocation={true}
                showsMyLocationButton={true}
                toolbarEnabled={true}
                provider={PROVIDER_GOOGLE}
                initialRegion={initialLocation}
                ref={ref}
            >
                {NearByWorkersLocList.length > 0 ? NearByWorkersLocList.map((worker: any, index: number) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: worker[1]["lat"], longitude: worker[1]["long"] }}
                        title={worker[2]}
                    />
                )) : null}

                {/* <Marker
                    key={1}
                    coordinate={{ latitude: 18.510777936903665, longitude: 73.78190009962982 }}
                    title="Peter Cafe"
                    description="Famous for coffee"
                /> */}

            </MapView>
            {/* <TouchableOpacity style={{ position: 'relative', width: 40, height: 40, borderColor: 'black', bottom: 50, alignSelf: 'flex-end', right: 10, borderRadius: '50%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }} onPress={() => ref.current?.animateCamera({ center: { latitude: initialLocation.latitude, longitude: initialLocation.longitude }, zoom: 15 }, { duration: 3000 })}>
                <MaterialIcons name="my-location" size={24} color="black" />
            </TouchableOpacity> */}
        </View>
    )
}



const WorkerRankingScreen = () => {
    const router = useRouter();

    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language.toLocaleLowerCase();

    const searchIcon = require("../../assets/Client_HomeScreen/Search.png");
    const [mode, setMode] = useState('list');
    let { height, width } = useWindowDimensions();
    height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);

    const [user, setUser] = useState<any>(null);
    const [name, setName] = useState<string | null>(null);
    const [nearByWorkersLoc, setNearbyWorkersLoc] = useState([]);
    const [clientLoc, setClientLoc] = useState({ "lat": 0, "long": 0 });

    const fetchWorkers = async (uid: string | null) => {
        console.log("Fetching nearby workers for User ID:", uid);
        setNearbyWorkersLoc([]);
        const workersLoc = await fetchNearByWorkers(uid,currentLanguage);
        // const workersLoc = await fetchNearByWorkers(user);
        console.log("API Response for Nearby Workers:", workersLoc);
        console.log("Nearby Workers Location Data:", workersLoc["nearby_workers"]);
        setNearbyWorkersLoc(workersLoc["nearby_workers"]);
        console.log("Client Location Data:", workersLoc["client_loc"]);
        setClientLoc(workersLoc["client_loc"]);
    };

    const fetchUser = async () => {
            const uid = await getUserId();
            if (!uid) {
                router.replace('/login/');
            }
            const uname = await AsyncStorage.getItem("name");
            await fetchWorkers(uid);
            setUser(uid);
            setName(uname);
        };

    useEffect(() => {
        fetchUser();
    }, [currentLanguage])


    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: "white", justifyContent: 'space-between' }}
        >
            <NavBar />
            <View style={{ backgroundColor: 'white', width: '100%', height: height - 60 - 40 - StatusBar.currentHeight!, paddingHorizontal: 15 }}>
                <View style={styles.horizontalLine} />
                <View
                    style={{
                        width: '110%',
                        height: 70,
                        backgroundColor: 'rgb(69, 96, 244)',
                        borderBottomRightRadius: '90%',
                        position: 'absolute',
                        top: 0,
                        zIndex: 1,
                        // borderTopColor : 'white',
                        // borderTopWidth : 1
                    }}
                    id='top-curve-design-container'
                >

                    <View
                        style={{
                            width: '50%',
                            height: 80,
                            backgroundColor: '#4560F4',
                            position: 'absolute',
                            top: 65,
                            zIndex: 2,
                        }}
                    />

                    <View
                        style={{
                            width: '50%',
                            height: 80,
                            backgroundColor: 'white',
                            borderTopLeftRadius: '85%',
                            position: 'absolute',
                            top: 65,
                            zIndex: 3,
                        }}
                    />
                </View>
                <View style={{ zIndex: 4 }}>
                    <Text style={styles.heading}>NearBy Workers</Text>
                    <View style={styles.searchRow}>
                        <TextInput
                            style={styles.searchBar}
                            placeholder="Search workers..."
                            placeholderTextColor="grey"
                        />
                        <View style={styles.searchIconBox}>
                            <Image source={searchIcon} style={styles.searchIcon} />
                        </View>
                    </View>
                    <View style={{ width: '100%', height: 40, flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                        <TouchableOpacity style={styles.options} onPress={() => setMode('list')}>
                            {/* <FontAwesome name="list-ul" size={27} color="#605d5d" /> */}
                            <FontAwesome name="list-ul" size={22} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.options} onPress={() => setMode('map')}>
                            {/* <FontAwesome6 name="map-location-dot" size={27} color="#605d5d" /> */}
                            <FontAwesome6 name="map-location-dot" size={22} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contentContainer}>
                        {mode === 'list' && user && name ? (
                            <ScrollView style={{ marginTop: 0, width: '100%', height: '100%', padding: 10 }}>
                                {/* {data.map((item) => (
                                    <WorkerRankBar key={item.id} data={item} />
                                ))} */}
                                {nearByWorkersLoc.map((item, index) => (
                                    <WorkerRankBar key={index} data={item} id={index} userId={user} userName={name} />
                                ))}
                            </ScrollView>
                        ) : (mode === 'map' && clientLoc.lat !== 0 && clientLoc.long !== 0 ? <MapContainer NearByWorkersLocList={nearByWorkersLoc} UserLoc={clientLoc || { lat: 0, long: 0 }} /> : null)
                        }
                    </View>
                </View>
            </View>

            <BottomNavBar />

        </SafeAreaView>
    )
}

export default WorkerRankingScreen

const styles = StyleSheet.create({

    searchRow: {
        flexDirection: "row",
        marginTop: 10,
        alignItems: "center",
        gap: 5,
        zIndex: 4
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
    heading: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
        fontWeight: '600',
        marginTop: 10
    },

    horizontalLine: {
        height: 1,
        width: "94%",
        backgroundColor: "white",
        marginBottom: 10,
        alignSelf: "center",
        zIndex: 4
    },
    options: { width: '48%', height: '100%', borderColor: 'black', borderWidth: 1, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgb(34, 57, 110)' },
    contentContainer: { width: '100%', height: '74%', marginTop: 15, borderColor: 'black', justifyContent: 'flex-start', },
})