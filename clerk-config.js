import { ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";

const CLERK_PUBLISHABLE_KEY =
  "pk_test_c2luY2VyZS1raXQtMjEuY2xlcmsuYWNjb3VudHMuZGV2JA";

const tokenCache = {
  async getToken(key) {
    return SecureStore.getItemAsync(key);
  },
  async saveToken(key, value) {
    return SecureStore.setItemAsync(key, value);
  },
};

export { CLERK_PUBLISHABLE_KEY, ClerkProvider, tokenCache };
