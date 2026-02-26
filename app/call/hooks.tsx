import { useEffect, useState, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import {
    createAgoraRtcEngine,
    ChannelProfileType,
    ClientRoleType,
    RtcConnection,
    IRtcEngine,
} from 'react-native-agora';
import { requestAudioPermission } from './permissions';

export const useInitializeAgora = () => {
    // NOTE: Hardcoded tokens expire. Ensure this matches your Channel Name (CN)
    const appId = '7036b6dbe7134a1e98f2856306366bb6';
    // const token = '007eJxTYDj7KElz23SxhgeLd4T9vf4t+5Trl6a50t9Te57/zL4TeadEgcHcwNgsySwlKdXc0Ngk0TDV0iLNyMLUzNjAzNjMLCnJzE95QWZDICNDXqMkKyMDBIL4XAy5lbrJGYl5eak5DAwAS1MkdQ==';

    const [joinSucceed, setJoinSucceed] = useState(false);
    const [peerIds, setPeerIds] = useState([]);
    const [isMute, setIsMute] = useState(false);
    const [isSpeakerEnable, setIsSpeakerEnable] = useState(true);

    const engine = useRef(null);

    const initAgora = useCallback(async () => {
        if (Platform.OS === 'android') {
            await requestAudioPermission();
        }

        try {
            if (!engine.current) {
                engine.current = createAgoraRtcEngine();
                engine.current.initialize({ appId });

                engine.current.registerEventHandler({
                    onJoinChannelSuccess: (connection, uid) => {
                        console.log('Successfully joined:', connection.channelId, uid);
                        setJoinSucceed(true);
                    },
                    onUserJoined: (connection, remoteUid) => {
                        console.log('Remote user joined:', remoteUid);
                        setPeerIds((prev) => [...new Set([...prev, remoteUid])]);
                    },
                    onUserOffline: (connection, remoteUid) => {
                        console.log('Remote user left:', remoteUid);
                        setPeerIds((prev) => prev.filter((id) => id !== remoteUid));
                    },
                    onError: (err) => {
                        console.error('Agora Error:', err);
                    },
                });

                await engine.current.enableAudio();
                await engine.current.setEnableSpeakerphone(true);
            }
        } catch (e) {
            console.error('Initialization failed:', e);
        }
    }, [appId]);

    const join = async (channelName, token) => {
        if (!engine.current) {
            await initAgora();
        }

        try {
            // Use the token passed from the component
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

    useEffect(() => {
        initAgora();
        return () => {
            if (engine.current) {
                engine.current.release();
                engine.current = null;
            }
        };
    }, [initAgora]);

    const toggleSpeaker = useCallback(async () => {
        const nextState = !isSpeakerEnable;
        await engine.current?.setEnableSpeakerphone(nextState);
        setIsSpeakerEnable(nextState);
    }, [isSpeakerEnable]);

    return {
        isMute,
        isSpeakerEnable,
        joinSucceed,
        peerIds,
        join,
        leaveChannel,
        toggleIsMute,
        toggleSpeaker
    };
};