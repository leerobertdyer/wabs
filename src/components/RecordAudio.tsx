import * as Crypto from "expo-crypto";
import { useEffect } from "react";
import { View, Alert } from "react-native";
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from "expo-audio";
import { useSQLiteContext } from "expo-sqlite";
import Btn from "@/components/buttons/Btn";
import { getOrCreateLocalUserId } from "@/db/secureStore";
import { storeAudio } from "@/db/dml";

export default function RecordAudio() {
  const RECORDING_OPTIONS = {
    ...RecordingPresets.HIGH_QUALITY,
    directory: "document" as const,
  };
  const audioRecorder = useAudioRecorder(RECORDING_OPTIONS);
  const recorderState = useAudioRecorderState(audioRecorder);

  const db = useSQLiteContext();

  const record = async () => {
    await audioRecorder.prepareToRecordAsync(); // arms the recorder with RECORDING_OPTIONS
    audioRecorder.record();
  };

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    await audioRecorder.stop();

    const recordingUri = audioRecorder.uri; // e.g. ".../Documents/ExpoAudio/recording-123.m4a"
    if (!recordingUri) return;
    const relativePath = recordingUri.split("Documents/").pop();

    const userId = await getOrCreateLocalUserId();
    const title = "fuckin test it bro"; // TODO USE INPUT FOR TITLE USE TITLE PLUS _CRYPTO FOR ID USE INPUT FOR TYPE/NOTES/LYRICS
    await storeAudio(
      db,
      {
        id: Crypto.randomUUID(),
        audioPath: relativePath!,
        title,
        type: "riff",
      },
      userId,
    );
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        // TODO add Linking.s
        Alert.alert("Permission to access microphone was denied");
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
        // To record in the background, also set allowsBackgroundRecording: true
        // and enable the enableBackgroundRecording config plugin option.
      });
    })();
  }, []);

  return (
    <View className="bg-[#ecf0f1]">
      <Btn
        type="WARNING"
        text={recorderState.isRecording ? "Stop recording" : "Start recording"}
        onPress={recorderState.isRecording ? stopRecording : record}
      />
    </View>
  );
}
