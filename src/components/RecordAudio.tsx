import { useEffect } from "react";
import { View, Button, Alert } from "react-native";
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from "expo-audio";
import Btn from "@/components/buttons/Btn";

export default function RecordAudio() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const record = async () => {
    await audioRecorder.prepareToRecordAsync({ directory: "document" });
    audioRecorder.record();
  };

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    await audioRecorder.stop();
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
