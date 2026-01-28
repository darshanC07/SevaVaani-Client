import BottomNavBar from '@/components/BottomNavBar';
import NavBar from '@/components/NavBar';
import { fetchNearByWorkers } from '@/services/GlobalAPIs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

type MapContainerProps = {
    NearByWorkersLocList?: Array<[string, { lat: number; long: number }]>;
    UserLoc?: { lat: number; long: number };
};

const WorkerRankBar = ({ data }) => {
    const [iconToggle, setIconToggle] = useState(false);
    const handlePress = () => {
        setIconToggle(true);

        setTimeout(() => {
            setIconToggle(false);
        }, 200);
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
            <View><Text>{data.id}</Text></View>
            <View>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>{data.name}</Text>
                <Text style={{ fontSize: 14, color: 'grey' }}>{data.jobType}</Text>
            </View>
            <View>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>Rating: {data.rating}</Text>
            </View>
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
                        title={worker[0]}
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
    const searchIcon = require("../../assets/Client_HomeScreen/Search.png");
    const [mode, setMode] = useState('list');
    let { height, width } = useWindowDimensions();
    height = height - (StatusBar.currentHeight ? StatusBar.currentHeight : 24);
    const data = [
        {
            id: 1,
            name: 'Ramesh Kumar',
            jobType: 'Plumber',
            rating: 4.5,
        },
        {
            id: 2,
            name: 'Suresh Patel',
            jobType: 'Electrician',
            rating: 4.7,
        },
        {
            id: 3,
            name: 'Amit Singh',
            jobType: 'Carpenter',
            rating: 4.3,
        },
        {
            id: 4,
            name: 'Vikram Das',
            jobType: 'Painter',
            rating: 4.6,
        },
        {
            id: 5,
            name: 'Rajesh Sharma',
            jobType: 'Welder',
            rating: 4.4,
        },
        {
            id: 6,
            name: 'Manoj Yadav',
            jobType: 'Mason',
            rating: 4.2,
        }, {
            id: 7,
            name: 'Deepak Verma',
            jobType: 'Gardener',
            rating: 4.8,
        }, {
            id: 8,
            name: 'Anil Gupta',
            jobType: 'Roofer',
            rating: 4.1,
        }, {
            id: 9,
            name: 'Sunil Mehta',
            jobType: 'Tiler',
            rating: 4.0,
        }
    ]
    const [user, setUser] = useState<any>(null);
    const [nearByWorkersLoc, setNearbyWorkersLoc] = useState([]);
    const [clientLoc, setClientLoc] = useState({ "lat": 0, "long": 0 });
    // useEffect(() => {
    //     const fetchUser = async () => {
    //         const user = await AsyncStorage.getItem("uid");
    //         setUser(user);
    //         return user;
    //     };
    //     const res = fetchUser();
    //     if(!res) {
    //         router.replace('/registration/EmailScreen');
    //     }
    // }, [])

    async function handleMapOptionClick() {
        // if(!user) {
        //     router.replace('/registration/EmailScreen');
        //     return;
        // }
        setMode('map');
        const workersLoc = await fetchNearByWorkers("kXArdkSbtHhrAFVxMIsyR1lXeWF2");
        // const workersLoc = await fetchNearByWorkers(user);
        console.log("Nearby Workers Location Data:", workersLoc["nearby_workers"]);
        setNearbyWorkersLoc(workersLoc["nearby_workers"]);
        console.log("Client Location Data:", workersLoc["client_loc"]);
        setClientLoc(workersLoc["client_loc"]);
    }


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
                        <TouchableOpacity style={styles.options} onPress={handleMapOptionClick}>
                            {/* <FontAwesome6 name="map-location-dot" size={27} color="#605d5d" /> */}
                            <FontAwesome6 name="map-location-dot" size={22} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.contentContainer}>
                        {mode === 'list' ? (
                            <ScrollView style={{ marginTop: 0, width: '100%', height: '100%', padding: 10 }}>
                                {data.map((item) => (
                                    <WorkerRankBar key={item.id} data={item} />
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