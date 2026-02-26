import { Image, ImageBackground, StyleSheet, Text, View, Animated, Easing, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams } from 'expo-router';
const CallingScreen = () => {
    const rotation = useRef(new Animated.Value(0)).current;
    const { callee_uid, callee_name } = useLocalSearchParams();
    useEffect(() => {
        Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 9000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, [1]);

    const rotate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <SafeAreaProvider >
            <SafeAreaView >
                <View style={styles.bg}>
                    <View style={styles.calleeInfoAndStatus}>
                        <Text style={[styles.text, { fontSize: 30, fontWeight: 'bold' }]}>
                            {callee_name || 'Unknown Caller'}
                        </Text>
                        <Text style={styles.text}>
                            Calling...
                        </Text>
                    </View>
                    <View style={styles.avatarContainer}>
                        <Animated.View style={[styles.avatar, { transform: [{ rotate }] }]}>
                            <Image
                                source={require("../../assets/calls/avatarBg.png")}
                                style={styles.avatarImage}
                            />
                        </Animated.View>
                        <Text style={styles.avatarText}>{callee_name[0]}</Text>
                    </View>
                    <TouchableOpacity>
                        <View style={styles.hangupWrapper}>
                            <MaterialCommunityIcons name="phone-hangup" size={35} color="black" />
                        </View>
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default CallingScreen

const styles = StyleSheet.create({
    hangupWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: 190,
        height: 70,
        backgroundColor: "#ed675c",
        borderRadius: 35, 
    },

    bg: {
        backgroundColor: '#222224',
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 50
    },
    text: {
        color: 'white',
    },
    calleeInfoAndStatus: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    hangUpButton: {
        width: 50,
        height: 70,
        backgroundColor: '#ed675c',
        justifyContent: 'center',
        alignItems: 'center'
    },
    horizontalLine: {
        height: 1,
        width: "94%",
        backgroundColor: "grey",
        marginBottom: 10,
        alignSelf: "center",
    },
    avatarContainer: {
        width: 200,
        height: 200,
        alignItems: "center",
        justifyContent: "center",
    },

    avatar: {
        position: "absolute",
        width: 200,
        height: 200,
        alignItems: "center",
        justifyContent: "center",
    },

    avatarImage: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },

    avatarText: {
        position: "absolute",
        color: "white",
        fontSize: 80,
        fontWeight: "bold",
        zIndex: 2,
    },

})