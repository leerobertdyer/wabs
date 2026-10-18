import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";

const USER_ID_KEY = "wabs_local_user_id";

export async function getOrCreateLocalUserId(): Promise<string> {
  let userId = await SecureStore.getItemAsync(USER_ID_KEY);

  if (!userId) {
    userId = Crypto.randomUUID();
    await SecureStore.setItemAsync(USER_ID_KEY, userId);
  }

  return userId;
}