import { MyText } from "@/components/MyText";
import PlayAudio from "@/components/PlayAudio";
import RecordAudio from "@/components/RecordAudio";
import { getAudio } from "@/db/dml";
import { getOrCreateLocalUserId } from "@/db/secureStore";
import { RawAudio } from "@/types";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [audioFiles, setAudioFiles] = useState<RawAudio[]>([]);
  const db = useSQLiteContext();

  useEffect(() => {
    async function getRecentRecording() {
      const userId = await getOrCreateLocalUserId();
      const files = await getAudio(db, userId);
      if (files) setAudioFiles(files);
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
          {audioFiles.map((file) => (
            <PlayAudio audio={file} />
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}
