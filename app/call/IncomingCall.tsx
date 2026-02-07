import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { hangUpCall, joinCall } from '@/services/GlobalAPIs';
import { getUserId } from '@/utils/AsyncStorageUtils';
const IncomingCall = () => {
    const router = useRouter()
    // const user = getUserId();
    const user = "EbQZRH72wnRu2DRpzieDdR9rSvG2";
    const myName = "Darshan";
    const { caller_uid, caller_name } = useLocalSearchParams();

    async function acceptCall(myself: string,Mname: string,anotherUser: string,Aname: string){
        const response = await joinCall(myself,Mname,anotherUser,Aname);
        console.log("join call response : ",response);
    }

    return (
        <SafeAreaProvider >
            <SafeAreaView >
                <View style={styles.bg}>
                    <View style={styles.callerInfoAndStatus}>
                        <Text style={[styles.text, { fontSize: 30, fontWeight: 'bold' }]}>
                            {caller_name || 'Unknown Caller'}
                        </Text>
                        <Image
                            source={{
                                uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    caller_name.toString()
                                )}&background=random&color=0d1117&bold=true&font-size=0.5&length=1&size=128`,
                            }}
                            style={styles.avatar}
                        />
                        <Text style={styles.text}>
                            Incoming voice call...
                        </Text>
                    </View>
                    <View style={styles.callOptions}>
                        <TouchableOpacity style={{ padding: 15, borderRadius: 50, borderColor: 'green', borderWidth: 2 }} onPress={()=>acceptCall(user,myName,caller_uid,caller_name)}>
                            <MaterialIcons name="call" size={45} color="green" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 15, borderRadius: 50, borderColor: 'red', borderWidth: 2 }} onPress={() => {
                            hangUpCall(caller_uid.toString());
                             router.back() }}>
                            <MaterialIcons name="call-end" size={45} color="red" />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider >
    )
}

export default IncomingCall

const styles = StyleSheet.create({
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
    callerInfoAndStatus: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 25
    },
    avatar: { width: 120, height: 120, borderRadius: 80, },
    callOptions: {
        flexDirection: 'row',
        width: '70%',
        justifyContent: 'space-between',
    }
})