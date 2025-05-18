import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useWindowDimensions } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { StrapiProvider } from "@/providers/StrapiProvider";
import { ClerkProvider } from "@clerk/clerk-expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a QueryClient instance
const queryClient = new QueryClient();

const CLERK_PUBLISHABLE_KEY =
  "pk_test_c2luY2VyZS1raXQtMjEuY2xlcmsuYWNjb3VudHMuZGV2JA";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 800;

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <QueryClientProvider client={queryClient}>
          <StrapiProvider>
            <Stack
              screenOptions={{
                headerShown: false, // Hides all stack headers
              }}
            >
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false, // This hides the (tabs) header
                }}
              />
              <Stack.Screen name="dashboard" />
              <Stack.Screen name="+not-found" />
              {/* Add your details screen here */}
            </Stack>
            <StatusBar style="auto" />
          </StrapiProvider>
        </QueryClientProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
}
