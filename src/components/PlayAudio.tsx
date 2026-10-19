import { View } from "react-native";
import { RawAudio } from "@/types";
import Btn from "@/components/buttons/Btn";
import { MyText } from "@/components/MyText";
import { usePlayback } from "@/context/audio/PlaybackProvider";

export default function PlayAudio({ audio }: { audio: RawAudio }) {
  const { currentId, playing, toggle } = usePlayback();
  const active = currentId === audio.id && playing;
  return (
    <View className="flex-row justify-between items-center w-full bg-orange-100 p-2 rounded-xs">
      <MyText className="bg-white p-[2px] rounded-xs" numberOfLines={1}>
        {audio.title}
      </MyText>
      <Btn
        btnClass="w-[4rem] bg-blue-200 rounded-md p-2"
        txtClass="text-sm w-full text-center"
        text={active ? "Pause" : "Play"}
        onPress={() => toggle(audio)}
      />
    </View>
  );
}
