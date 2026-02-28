import { useEffect, useState, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs'; // Required for file handling
import axios from 'axios'; // Required for API calls
import {
    createAgoraRtcEngine,
    ChannelProfileType,
    ClientRoleType,
    RawAudioFrameOpModeType,
    AudioFrame,
    AudioFileRecordingType,
} from 'react-native-agora';
import { requestAudioPermission } from './permissions';
import { uploadRecording } from '@/services/GlobalAPIs';

export const useInitializeAgora = () => {
    const appId = '7036b6dbe7134a1e98f2856306366bb6';
    const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY'; // Add your key here

    const engine = useRef<any>(null);
    const [joinSucceed, setJoinSucceed] = useState(false);
    const [peerIds, setPeerIds] = useState<number[]>([]);
    const [isMute, setIsMute] = useState(false);
    const [isSpeakerEnable, setIsSpeakerEnable] = useState(true);

    // Transcription States
    const [transcribedData, setTranscribedData] = useState('');
    const [isTranscribing, setIsTranscribing] = useState(false);

    const SAMPLE_RATE = 16000;
    const SAMPLE_NUM_OF_CHANNEL = 1;
    const SAMPLES_PER_CALL = 1024;

    const recordingPath = `${RNFS.DocumentDirectoryPath}/recording.wav`;

    // 1. Transcription Logic (The missing part)
    const startTranscribe = async () => {
        setIsTranscribing(true);
        try {
            const fileExists = await RNFS.exists(recordingPath);
            if (!fileExists) {
                console.log('No recording file found to transcribe');
                return;
            }

            const formData = new FormData();
            formData.append('file', {
                uri: Platform.OS === 'android' ? `file://${recordingPath}` : recordingPath,
                type: 'audio/wav',
                name: 'recording.wav',
            } as any);
            formData.append('model', 'whisper-1');

            const response = await uploadRecording(formData);

            console.log('Transcription Response:', response);
            // setTranscribedData(response.data.text);
        } catch (error) {
            console.error('Transcription failed:', error);
        } finally {
            setIsTranscribing(false);
        }
    };

    const getRecordingFilePath = async () => {
        const fileExists = await RNFS.exists(recordingPath);
        if (!fileExists) {
            console.error('Recording file not found at:', recordingPath);
            return;
        }
        return recordingPath;
    }

    const iAudioFrameObserver = {
        onPlaybackAudioFrame: () => true,
        onPlaybackAudioFrameBeforeMixing: () => true,
        onRecordAudioFrame: (channelId: string, audioFrame: AudioFrame) => true,
    };

    const initAgora = useCallback(async () => {
        if (Platform.OS === 'android') {
            await requestAudioPermission();
        }

        try {
            if (!engine.current) {
                engine.current = createAgoraRtcEngine();
                engine.current.initialize({
                    appId: appId,
                    channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting
                });

                engine.current.registerEventHandler({
                    onJoinChannelSuccess: (connection, uid) => {
                        console.log('Successfully joined:', connection.channelId, uid);
                        setJoinSucceed(true);
                    },
                    onUserJoined: (connection, remoteUid) => {
                        setPeerIds((prev) => [...new Set([...prev, remoteUid])]);
                    },
                    onUserOffline: (connection, remoteUid) => {
                        setPeerIds((prev) => prev.filter((id) => id !== remoteUid));
                    },
                });

                // Configure Raw Audio Settings
                engine.current.setPlaybackAudioFrameParameters(SAMPLE_RATE, SAMPLE_NUM_OF_CHANNEL, RawAudioFrameOpModeType.RawAudioFrameOpModeReadWrite, SAMPLES_PER_CALL);
                engine.current.setRecordingAudioFrameParameters(SAMPLE_RATE, SAMPLE_NUM_OF_CHANNEL, RawAudioFrameOpModeType.RawAudioFrameOpModeReadWrite, SAMPLES_PER_CALL);
                engine.current.setMixedAudioFrameParameters(SAMPLE_RATE, SAMPLE_NUM_OF_CHANNEL, SAMPLES_PER_CALL);

                engine.current.getMediaEngine().registerAudioFrameObserver(iAudioFrameObserver);

                await engine.current.enableAudio();
            }
        } catch (e) {
            console.error('Initialization failed:', e);
        }
    }, []);

    const join = async (channelName: string, token: string) => {
        if (!engine.current) await initAgora();

        try {
            // Clean up old recording
            if (await RNFS.exists(recordingPath)) {
                await RNFS.unlink(recordingPath);
            }

            engine.current?.joinChannel(token, channelName, 0, {
                channelProfile: ChannelProfileType.ChannelProfileCommunication,
                clientRoleType: ClientRoleType.ClientRoleBroadcaster,
                publishMicrophoneTrack: true,
                autoSubscribeAudio: true,
            });

            // Start Recording to file for later transcription
            engine.current?.startAudioRecording({
                filePath: recordingPath,
                encode: false,
                sampleRate: SAMPLE_RATE,
                fileRecordingType: AudioFileRecordingType.AudioFileRecordingMixed,
            });
        } catch (e) {
            console.error('Join error:', e);
        }
    };

    const leaveChannel = useCallback(async () => {
        try {
            engine.current?.stopAudioRecording();
            await engine.current?.leaveChannel();
            setPeerIds([]);
            setJoinSucceed(false);

            // // Trigger transcription after leaving
            // startTranscribe();

            // uploadAudioToServer()
        } catch (e) {
            console.error('Leave error:', e);
        }
    }, []);

    const toggleIsMute = useCallback(async () => {
        const nextMuteState = !isMute;
        await engine.current?.muteLocalAudioStream(nextMuteState);
        setIsMute(nextMuteState);
    }, [isMute]);

    const toggleSpeaker = useCallback(async () => {
        const nextState = !isSpeakerEnable;
        await engine.current?.setEnableSpeakerphone(nextState);
        setIsSpeakerEnable(nextState);
    }, [isSpeakerEnable]);

    useEffect(() => {
        initAgora();
        return () => {
            if (engine.current) {
                engine.current.release();
                engine.current = null;
            }
        };
    }, [initAgora]);

    return {
        getRecordingFilePath,
        isMute,
        isSpeakerEnable,
        joinSucceed,
        peerIds,
        transcribedData,
        isTranscribing,
        join,
        leaveChannel,
        toggleIsMute,
        toggleSpeaker,
        setIsTranscribing,
    };
};