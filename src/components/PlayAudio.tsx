import { View, Button } from "react-native";
import {
  useAudioPlayer,
  setAudioModeAsync,
  useAudioPlayerStatus,
} from "expo-audio";
import { useEffect, useState } from "react";
import { songMeta } from "@/types";
import Btn from "@/components/buttons/Btn";

interface IPlayAudio {
  audioSource: string;
  songMeta?: songMeta;
}

export default function PlayAudio({ audioSource, songMeta }: IPlayAudio) {
  const [isPlaying, setIsPlaying] = useState(false);

  const player = useAudioPlayer({ uri: audioSource });
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
    } else console.error("WTF")
  }, [status.error]);

  const handlePlay = () => {
    player.setActiveForLockScreen(true, songMeta);
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
