import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useInitializeAgora } from './hooks'; 
import { useLocalSearchParams, useRouter } from 'expo-router';

const CallRoomScreen = () => {
  const { anotherUserName, CN, channelToken } = useLocalSearchParams();
  console.log("CallRoomScreen Params:", { anotherUserName, CN, channelToken });
  const router = useRouter();

  const {
    isMute,
    joinSucceed,
    peerIds,
    join,
    leaveChannel,
    toggleIsMute,
    toggleSpeaker
  } = useInitializeAgora();

  useEffect(() => {
    // Only attempt to join if we have BOTH the channel name and the token
    if (CN && channelToken) {
      console.log("Attempting to join with token...");
      join(CN, channelToken);
    } else {
      console.error("Missing CN or Token:", { CN, channelToken });
    }
  }, [CN, channelToken]); 

  const handleHangup = async () => {
    await leaveChannel();
    router.back();
  };

  // COMBINED LOADING STATE
  if (!joinSucceed) {
    return (
      <View style={[styles.bg, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="white" />
        <Text style={{ color: 'white', marginTop: 10 }}>
          {!channelToken ? "Validating security token..." : `Connecting to ${anotherUserName}...`}
        </Text>
        <TouchableOpacity 
          style={[styles.hangupBtn, { marginTop: 30 }]} 
          onPress={() => router.back()}
        >
          <MaterialIcons name="call-end" size={25} color="#750000" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#222224' }}>
        <View style={styles.bg}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
              {peerIds.length > 0 ? `In call with ${anotherUserName}` : `Waiting for ${anotherUserName}...`}
            </Text>
          </View>

          {/* Profile Circle */}
          <View style={styles.centerContent}>
            <View style={styles.avatarCircle}>
              <FontAwesome5 name="user-alt" size={40} color="black" />
            </View>
            {peerIds.length === 0 && (
              <Text style={{ color: '#ccc', marginTop: 20 }}>Ringing...</Text>
            )}
          </View>

          {/* Bottom Controls */}
          <View style={styles.controls}>
            <TouchableOpacity style={styles.hangupBtn} onPress={handleHangup}>
              <MaterialIcons name="call-end" size={30} color="#750000" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.muteBtn} onPress={toggleIsMute}>
              <FontAwesome 
                name={isMute ? "microphone-slash" : "microphone"} 
                size={30} 
                color="black" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default CallRoomScreen;

const styles = StyleSheet.create({
  bg: {
    backgroundColor: '#515152',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: { 
    backgroundColor: '#222224', 
    padding: 10, 
    width: "100%", 
    alignItems: 'center', 
    height: 60, 
    justifyContent: 'center' 
  },
  centerContent: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    flex: 1 
  },
  avatarCircle: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'white' 
  },
  controls: { 
    height: 120, 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    width: '100%', 
    backgroundColor: '#222224',
    paddingBottom: 30
  },
  hangupBtn: { 
    padding: 15, 
    borderRadius: 50, 
    borderColor: '#750000', 
    borderWidth: 2, 
    backgroundColor: '#f57474' 
  },
  muteBtn: { 
    padding: 15, 
    borderRadius: 50, 
    borderWidth: 2, 
    backgroundColor: '#74e2f5', 
    width: 65, 
    height: 65, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }
});