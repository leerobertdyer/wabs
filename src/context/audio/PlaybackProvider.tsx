import { enablePlaybackMode } from "@/audioUtils";
import { getFullAudioPath } from "@/db/util";
import { RawAudio } from "@/types";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { createContext, useContext, useEffect, useState } from "react";

const Ctx = createContext<{
  currentId: string | null;
  playing: boolean;
  toggle: (audio: RawAudio) => Promise<void>;
} | null>(null);

export function PlaybackProvider({ children }: { children: React.ReactNode }) {
  const player = useAudioPlayer(null);           // no source until a song is picked
  const status = useAudioPlayerStatus(player);
  const [current, setCurrent] = useState<RawAudio | null>(null);

  const toggle = async (audio: RawAudio) => {
    if (current?.id === audio.id) {
      status.playing ? player.pause() : player.play();
      return;
    }
    await enablePlaybackMode();
    player.replace(getFullAudioPath(audio));
    player.setActiveForLockScreen(true, { title: audio.title });
    setCurrent(audio);
    player.play();
  };

  useEffect(() => {
    if (status.didJustFinish) player.seekTo(0);
  }, [status.didJustFinish]);

  return (
    <Ctx.Provider value={{ currentId: current?.id ?? null, playing: status.playing, toggle }}>
      {children}
    </Ctx.Provider>
  );
}

export const usePlayback = () => useContext(Ctx)!;