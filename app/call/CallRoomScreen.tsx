import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { use, useEffect } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useInitializeAgora, useRequestAudioHook } from './hooks';
import { requestAudioPermission } from './permissions';
import { useLocalSearchParams, useRouter } from 'expo-router';
const CallRoomScreen = () => {
  const { anotherUserId, anotherUserName, CN } = useLocalSearchParams();
  const router = useRouter();
  useRequestAudioHook();
  const {
    channelName,
    isMute,
    isSpeakerEnable,
    joinSucceed,
    peerIds,
    setChannelName,
    join,
    leaveChannel,
    toggleIsMute,
    toggleIsSpeakerEnable,
  } = useInitializeAgora();

  useEffect(() => {
    requestAudioPermission();
    setChannelName(CN);
  }, []);
  return (

    <SafeAreaProvider style={{ height: '100%' }}>
      <SafeAreaView style={{ flex: 1 }}>
        {
          peerIds.length == 2 ?
            <View style={styles.bg}>
              <View style={styles.header}>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                  Call Room : {anotherUserName}
                </Text>
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center', height: '80%' }}>
                <View style={{ width: 100, height: 100, borderRadius: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                  <FontAwesome5 name="user-alt" size={40} color="black" />
                </View>
              </View>
              <View style={{ height: '12%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', backgroundColor: '#222224' }}>
                <TouchableOpacity style={{ padding: 15, borderRadius: 50, borderColor: '#750000', borderWidth: 2, backgroundColor: '#f57474' }} onPress={leaveChannel}>
                  <MaterialIcons name="call-end" size={30} color="#750000" />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 15, borderRadius: 50, borderWidth: 2, backgroundColor: '#74e2f5', width: 65, height: 65, justifyContent: 'center', alignItems: 'center' }} onPress={toggleIsMute}>
                  {isMute ? <FontAwesome name="microphone" size={30} color="black" /> : <FontAwesome name="microphone-slash" size={30} color="black" />}
                </TouchableOpacity>
              </View>
            </View> : (console.log("no of users : ",peerIds.length), router.back(), null)
        }
      </SafeAreaView>
    </SafeAreaProvider >
  )
}

export default CallRoomScreen

const styles = StyleSheet.create({
  bg: {
    backgroundColor: '#515152',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingVertical: 50,
    flex: 1
  },
  header: { backgroundColor: '#222224', padding: 10, width: "100%", alignItems: 'center', height: '8%', justifyContent: 'center' },

})