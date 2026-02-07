// import AsyncStorage from '@react-native-async-storage/async-storage';
// import ZegoUIKitPrebuiltLiveAudioRoom, {
//     HOST_DEFAULT_CONFIG,
// } from '@zegocloud/zego-uikit-prebuilt-live-audio-room-rn';
// import { useRouter } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import { Button, StyleSheet, TextInput, View } from 'react-native';

// const CommunicationRoom = () => {
//     const [name, setName] = useState('');
//     const [userName, setUserName] = useState('');
//     const [roomId, setRoomId] = useState('');
//     const [seatNo, setSeatNo] = useState('0');
//     const [toJoin, setToJoin] = useState(false);
//     const router = useRouter();

//     // Load username from AsyncStorage on mount
//     useEffect(() => {
//         const loadUserName = async () => {
//             const storedName = await AsyncStorage.getItem('username');
//             if (storedName) {
//                 setUserName(storedName);
//             }
//         };
//         loadUserName();
//     }, []);

//     const handleJoin = async () => {
//         if (!roomId.trim() && !name.trim()) {
//             return;
//         }
//         // if (roomId.trim() !== '') {
//         await AsyncStorage.setItem('roomId', roomId);
//         await AsyncStorage.setItem('username', name);
//         await AsyncStorage.setItem('seatNo', seatNo);
//         console.log('Stored roomId:', roomId);
//         console.log('Stored username:', name);
//         console.log('Stored seatNo:', seatNo);
//         setUserName(name);
//         setRoomId(roomId);
//         setSeatNo(seatNo);


//         // } else {
//         //     await AsyncStorage.setItem('username', name);
//         //     setUserName(name);
//         //     setRoomId(roomId);
//         // }
//         setToJoin(true);

//     };

//     return (
//         <View style={styles.container}>
//             {toJoin && userName ? (
//                 <ZegoUIKitPrebuiltLiveAudioRoom
//                     appID={1830922669}
//                     appSign="aba2f828f2c5a350b424cf495e8219ecedb845efd76fc91a2b76c4a268b63f99"
//                     userID={`${userName}_1212`}
//                     userName={userName}
//                     roomID={roomId || 'test_room'}
//                     config={{
//                         ...HOST_DEFAULT_CONFIG,
//                         onLeave: () => {
//                               ZegoUIKitPrebuiltLiveAudioRoom.destroy();
//                             ZegoUIKitPrebuiltLiveAudioRoom.unload();
//                             router.navigate('/client');
//                         },
//                         onUserCountOrPropertyChanged: (userList : any) => {
//                             console.log('User list changed:', userList);
//                         },
//                     }}
//                     takeSeatIndexWhenJoining={parseInt(seatNo, 10)}

//                 />
//             ) : (
//                 <View style={{ flexDirection: 'column', width: '80%', gap: 10 }}>
//                     <TextInput
//                         value={name}
//                         onChangeText={setName}
//                         placeholder='enter name'
//                         placeholderTextColor={'black'}
//                         style={{
//                             borderWidth: 1,
//                             borderColor: 'black',
//                             width: '100%',
//                             marginRight: 10,
//                         }}
//                     />
//                     <TextInput
//                         value={roomId}
//                         onChangeText={setRoomId}
//                         placeholder='enter room id'
//                         placeholderTextColor={'black'}
//                         style={{
//                             borderWidth: 1,
//                             borderColor: 'black',
//                             width: '100%',
//                             marginRight: 10,
//                         }}
//                     />
//                     <TextInput
//                         value={seatNo.toString()}
//                         onChangeText={setSeatNo}
//                         keyboardType='numeric'
//                         placeholder='enter seat no'
//                         placeholderTextColor={'black'}
//                         style={{
//                             borderWidth: 1,
//                             borderColor: 'black',
//                             width: '100%',
//                             marginRight: 10,
//                         }}
//                     />
//                     <Button title="Join" onPress={handleJoin} />
//                 </View>
//             )}
//         </View>
//     );
// };

// export default CommunicationRoom;

// const styles = StyleSheet.create({
//     container: {
//         // flex: 1,
//         height: '90%',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
// });




// this is one-on-one voice call

import React from 'react';
import { StyleSheet, View } from 'react-native';
// !mark
import { ONE_ON_ONE_VIDEO_CALL_CONFIG, ZegoUIKitPrebuiltCall } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { useRouter } from 'expo-router';
export default function VoiceCallPage() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <ZegoUIKitPrebuiltCall
                appID={1830922669}
                appSign="aba2f828f2c5a350b424cf495e8219ecedb845efd76fc91a2b76c4a268b63f99"
                userID={Date.now().toString()} // userID can be something like a phone number or the user id on your own user system. 
                userName={Date.now().toString()}
                callID="call1" // callID can be any unique string. 

                config={{
                    // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
                    ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
                    onCallEnd: (callID : any, reason: any, duration: any) => {
                        // If you're using React Navigation 6, use the navigate method instead of popTo.
                        console.log('Call ended. CallID:', callID, 'Reason:', reason, 'Duration:', duration);
                        router.navigate('/client')
                    },
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 0,
  },
});