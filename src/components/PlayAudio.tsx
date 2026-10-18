import { View } from "react-native";
import {
  useAudioPlayer,
  setAudioModeAsync,
  useAudioPlayerStatus,
} from "expo-audio";
import { useEffect, useState } from "react";
import { RawAudio } from "@/types";
import Btn from "@/components/buttons/Btn";
import { getFullAudioPath } from "@/db/util";

interface IPlayAudio {
  audio: RawAudio;
}

export default function PlayAudio({ audio }: IPlayAudio) {
  const [isPlaying, setIsPlaying] = useState(false);
  const localPath = getFullAudioPath(audio);
  const player = useAudioPlayer(localPath);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    // Configure audio session for background playback
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: "doNotMix",
    });
  }, []);

  // Monitor status changes & handle errors
  useEffect(() => {
    if (status.error) {
      console.error("Audio Player Error:", status.error);
    }
  }, [status.error]);

  const handlePlay = () => {
    player.setActiveForLockScreen(true, audio);
    player.play();
    setIsPlaying(true);
  };

  const handleStop = () => {
    player.pause();
    player.setActiveForLockScreen(false);
    setIsPlaying(false);
  };

  return (
    <View>
      <Btn
        text={isPlaying ? "Pause" : "Play"}
        onPress={isPlaying ? handleStop : handlePlay}
      />
    </View>
  );
}
