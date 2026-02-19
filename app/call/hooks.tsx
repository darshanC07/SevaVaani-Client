import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import {
    ChannelProfileType,
    ClientRoleType,
    createAgoraRtcEngine,
    IRtcEngine,
    RtcConnection
} from 'react-native-agora';
import { requestAudioPermission } from './permissions';

export const useRequestAudioHook = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Request required permissions from Android

      requestAudioPermission().then(() => {
        console.log('requested!');
      });
    }
  }, []);
};

export const useInitializeAgora = () => {
    // Replace with your actual App ID and Token
    const appId = '7036b6dbe7134a1e98f2856306366bb6';
    const token = '007eJxTYNhyePeP7FlC14P4TnwzEZkR/9H37vxjXH/Mbkm7l1/Un7BQgcHcwNgsySwlKdXc0Ngk0TDV0iLNyMLUzNjAzNjMLCnJzP9hQ2ZDICND+CcLFkYGCATxuRhyK3WTMxLz8lJzGBgAjQoiyQ==';

    const [channelName, setChannelName] = useState('my-channel');
    const [joinSucceed, setJoinSucceed] = useState(false);
    const [peerIds, setPeerIds] = useState<number[]>([]);
    const [isMute, setIsMute] = useState(false);
    const [isSpeakerEnable, setIsSpeakerEnable] = useState(true);

    const engine = useRef<IRtcEngine | null>(null);

    const initAgora = useCallback(async () => {
        if (Platform.OS === 'android') {
            await requestAudioPermission();
        }

        try {
            // 1. Create the engine instance
            engine.current = createAgoraRtcEngine();
            
            // 2. Initialize the engine
            engine.current.initialize({ appId });

            // 3. Register Event Handlers (Recommended v4.x way)
            engine.current.registerEventHandler({
                onJoinChannelSuccess: (connection: RtcConnection, uid: number) => {
                    console.log('Successfully joined:', connection.channelId, uid);
                    setJoinSucceed(true);
                },
                onUserJoined: (connection: RtcConnection, remoteUid: number) => {
                    console.log('Remote user joined:', remoteUid);
                    setPeerIds((prev) => [...new Set([...prev, remoteUid])]);
                },
                onUserOffline: (connection: RtcConnection, remoteUid: number) => {
                    console.log('Remote user left:', remoteUid);
                    setPeerIds((prev) => prev.filter((id) => id !== remoteUid));
                },
                onError: (err) => {
                    console.error('Agora Error:', err);
                },
            });

            // 4. Global configurations
            await engine.current.enableAudio();
            await engine.current.setEnableSpeakerphone(true);
            
        } catch (e) {
            console.error('Initialization failed:', e);
        }
    }, [appId]);

    const join = async () => {
        if (joinSucceed) return;

        try {
            // Communication profile is optimized for 1-on-1 or small group calls
            engine.current?.joinChannel(token, channelName, 0, {
                channelProfile: ChannelProfileType.ChannelProfileCommunication,
                clientRoleType: ClientRoleType.ClientRoleBroadcaster,
                publishMicrophoneTrack: true,
                autoSubscribeAudio: true,
            });
        } catch (e) {
            console.error('Join error:', e);
        }
    };

    const leaveChannel = useCallback(async () => {
        try {
            await engine.current?.leaveChannel();
            setPeerIds([]);
            setJoinSucceed(false);
        } catch (e) {
            console.error('Leave error:', e);
        }
    }, []);

    const toggleIsMute = useCallback(async () => {
        const nextMuteState = !isMute;
        await engine.current?.muteLocalAudioStream(nextMuteState);
        setIsMute(nextMuteState);
    }, [isMute]);

    const toggleIsSpeakerEnable = useCallback(async () => {
        const nextSpeakerState = !isSpeakerEnable;
        await engine.current?.setEnableSpeakerphone(nextSpeakerState);
        setIsSpeakerEnable(nextSpeakerState);
    }, [isSpeakerEnable]);

    useEffect(() => {
        initAgora();

        return () => {
            // Fixed cleanup logic
            const currentEngine = engine.current;
            if (currentEngine) {
                currentEngine.leaveChannel();
                currentEngine.release();
                engine.current = null;
            }
        };
    }, [initAgora]);

    return {
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
        
    };
};

// Add default export for Expo Router
export default function HooksPage() {
  return null;
}