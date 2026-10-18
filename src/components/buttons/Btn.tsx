import { Pressable } from "react-native";
import { MyText } from "../MyText";

type BtnType = "SAVE" | "WARNING" | "CANCEL" | "DEFAULT"

interface IBtn {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  btnClass?: string;
  txtClass?: string;
  shadow?: boolean;
  children?: React.ReactNode;
  type?: BtnType;
}

export default function Btn({
  children,
  text,
  onPress,
  btnClass,
  txtClass,
  disabled = false,
  shadow = false,
  type = "DEFAULT"
}: IBtn) {
  return (
    <Pressable
      disabled={disabled}
      className={
        btnClass ??
        `rounded-lg 
         h-[4.5rem] w-[20rem] 
         p-2 items-center justify-center m-auto 
         disabled:opacity-40
         ${type === "DEFAULT" ? "bg-blue-400" : type === "SAVE" ? "bg-green-200" : type === "WARNING" ? "bg-red-400" : "bg-yellow-400"}`
      }
      onPress={onPress}
      style={
        shadow && {
          shadowColor: "#121212",
          shadowOffset: { width: 3, height: 2 },
          shadowOpacity: 0.85,
          shadowRadius: 6,
        }
      }
    >
      {text && <MyText className={txtClass ?? ""}>{text}</MyText>}
      {children}
    </Pressable>
  );
}
