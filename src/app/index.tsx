import { MyText } from "@/components/MyText";
import PlayAudio from "@/components/PlayAudio";
import RecordAudio from "@/components/RecordAudio";
import { getAudio } from "@/db/dml";
import { RawAudio } from "@/types";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [audio, setAudio] = useState<RawAudio>()
  const db = useSQLiteContext();

  useEffect(() => {
    async function getRecentRecording() {
      const song = await getAudio(db, "62aee577-e940-4825-91cb-3ebdfd13a830");
      if (song) setAudio(song)
    }
    getRecentRecording();
  }, []);

  return (
    <View>
      <SafeAreaView>
        <View className="items-center justify-center bg-white p-[2rem] gap-2">
          <MyText className="text-xl mt-[5rem] font-bold text-blue-500">
            Write A Bad Song
          </MyText>
          <RecordAudio />
          {audio && <PlayAudio audio={audio} />}
        </View>
      </SafeAreaView>
    </View>
  );
}
