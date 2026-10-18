export type RawAudio = {
  id: string;
  audioSource?: string; // eventual for r2
  audioPath: string; // local storage path
  title: string;
  type: RawAudioType;
};

export type RawAudioType = "riff" | "idea" | "song";
