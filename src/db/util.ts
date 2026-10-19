import { File, Paths } from "expo-file-system";
import { RawAudio } from "@/types";

export function getFullAudioPath(audio: RawAudio): string {
  const rawPath = audio.audioPath || "";
  let file = new File(Paths.document, rawPath);
  if (!file.exists) {
    console.error("No file found", audio);
  }
  return file.uri;
}
