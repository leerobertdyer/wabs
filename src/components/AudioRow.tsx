import { Pressable, TextInput, View } from "react-native";
import { RawAudio } from "@/types";
import Btn from "@/components/buttons/Btn";
import { MyText } from "@/components/MyText";
import { usePlayback } from "@/context/audio/PlaybackProvider";
import {  updateAudioTitle } from "@/db/dml";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { getOrCreateLocalUserId } from "@/db/secureStore";

interface IAudioRow {
  audio: RawAudio
  refreshAudio: () => Promise<void>
}

export default function AudioRow({ audio, refreshAudio }: IAudioRow) {
  const { currentId, playing, toggle } = usePlayback();
  const db = useSQLiteContext();
  const active = currentId === audio.id && playing;

  const [showInput, setShowInput] = useState(false);
  const [newSongTitle, setNewSongTitle] = useState("");

  async function handleUpdateTitle() {
    await updateAudioTitle(db, audio.id, newSongTitle);
    const userId = await getOrCreateLocalUserId();
    await refreshAudio()
    setNewSongTitle("")
    setShowInput(false);
  }

  return (
    <View className="flex-row justify-between items-center w-full bg-orange-100 p-2 rounded-xs gap-2">
      <Pressable className="flex-1" onPress={() => setShowInput(true)}>
        {showInput ? (
          <View className="w-full p-2 flex-row items-center justify-between">
            <TextInput
              className="flex-1 p-2 bg-white rounded-xs"
              placeholder="type a new name"
              onChangeText={(v) => setNewSongTitle(v)}
            />
          </View>
        ) : (
          <MyText className="bg-white p-[2px] rounded-xs" numberOfLines={1}>
            {audio.title}
          </MyText>
        )}
      </Pressable>
      {showInput ? (
        <Btn
          btnClass="w-[4rem] bg-red-200 rounded-md p-2"
          txtClass="text-center"
          text="Save"
          onPress={() => handleUpdateTitle()}
        />
      ) : (
        <Btn
          btnClass="w-[4rem] bg-blue-200 rounded-md p-2"
          txtClass="text-sm w-full text-center"
          text={active ? "Pause" : "Play"}
          onPress={() => toggle(audio)}
        />
      )}
    </View>
  );
}
