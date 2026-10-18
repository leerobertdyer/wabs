import { MyText } from "@/components/MyText";
import PlayAudio from "@/components/PlayAudio";
import RecordAudio from "@/components/RecordAudio";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <View>
      <SafeAreaView>
        <View className="items-center justify-center bg-white p-[2rem] gap-2">
          <MyText className="text-xl mt-[5rem] font-bold text-blue-500">
            Write A Bad Song
          </MyText>
          <RecordAudio />
          <PlayAudio audioSource="https://pub-746994d88a84421fa902c7e8a72ab0ce.r2.dev/themeSong.mp3" />
        </View>
      </SafeAreaView>
    </View>
  );
}
