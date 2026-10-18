import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";
import "../../global.css";
import { useEffect } from "react";
import Home from "@/app";

SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn("Failed to hide splash screen:", e);
      }
    }, 300);

    // Clean up timer if component unmounts
    return () => clearTimeout(timer);
  }, []);
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Home />
    </ThemeProvider>
  );
}
