import { setAudioModeAsync } from "expo-audio";

export const enableRecordingMode = () =>
  setAudioModeAsync({
    playsInSilentMode: true,
    allowsRecording: true,
    interruptionMode: "doNotMix",
  });

export const enablePlaybackMode = () =>
  setAudioModeAsync({
    playsInSilentMode: true,
    allowsRecording: false,
    shouldPlayInBackground: true,
    interruptionMode: "doNotMix",
  });