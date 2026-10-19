import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";
import "../../global.css";
import { Suspense, useEffect } from "react";
import Home from "@/app";
import { SQLiteProvider } from "expo-sqlite";
import { DB_NAME, migrate } from "@/db/migrate";
import { MyText } from "@/components/MyText";
import { PlaybackProvider } from "@/context/audio/PlaybackProvider";

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
      <Suspense fallback={<MyText>Loading...</MyText>}>
        <SQLiteProvider databaseName={DB_NAME} onInit={migrate} useSuspense>
          <PlaybackProvider>
            <Home />
          </PlaybackProvider>
        </SQLiteProvider>
      </Suspense>
    </ThemeProvider>
  );
}
