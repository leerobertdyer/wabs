import { File, Paths } from "expo-file-system";
import { RawAudio } from "@/types";

export function getFullAudioPath(audio: RawAudio): string {
  const rawPath = audio.audioPath || "";

  let file = new File(Paths.document, rawPath);

  if (!file.exists) {
    console.error("No file found", audio)
  }

  console.log("File exists on disk:", file.exists);
  console.log("Playable URI:", file.uri);

  return file.uri;
}
