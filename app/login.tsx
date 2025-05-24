import { useStrapi } from "@/providers/StrapiProvider";
import { useAuth, useOAuth, useUser } from "@clerk/clerk-expo";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { randomUUID } from "expo-crypto";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

export default function Login() {
  const router = useRouter();
  const params = useLocalSearchParams(); // <-- get params here
  const { isSignedIn, isLoaded } = useAuth();
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({
    strategy: "oauth_apple",
  });
  const { createUser } = useStrapi();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      isLoaded &&
      isSignedIn &&
      user?.primaryEmailAddress?.emailAddress &&
      user?.id
    ) {
      // Create user in Strapi if needed
      const email = user.primaryEmailAddress.emailAddress;
      const username = email;
      const password = randomUUID();
      const id = user.id;

      const strapiUser = {
        email,
        username,
        password,
        clerkId: id,
      };

      createUser(strapiUser).catch(() => {});

      // Redirect logic
      const redirectTo = params.redirectTo as string | undefined;
      if (redirectTo) {
        if (redirectTo.includes("?")) {
          const [pathname, queryString] = redirectTo.split("?");
          const paramObj: Record<string, string> = {};
          if (queryString) {
            queryString.split("&").forEach((pair) => {
              const [key, value] = pair.split("=");
              paramObj[key] = value;
            });
          }
          router.replace({ pathname: pathname as any, params: paramObj });
        } else {
          router.replace(redirectTo as any);
        }
      } else {
        router.replace("/dashboard");
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const isMobile = width < 600;
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [isMobile, navigation]);

  // Unified handler for both Google and Apple
  const handleSignInWithSSO = async (
    strategy: "oauth_google" | "oauth_apple"
  ) => {
    setLoading(true);
    try {
      const startOAuthFlow =
        strategy === "oauth_google"
          ? startGoogleOAuthFlow
          : startAppleOAuthFlow;
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
      // Do NOT access user here! Post-login logic is handled in useEffect above.
    } catch (err) {
      console.error("OAuth error", err);
    } finally {
      setLoading(false);
    }
  };

  const illustration = require("../assets/images/login.png");

  return (
    <View style={styles.root}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <View
          style={[
            styles.card,
            isMobile ? styles.cardMobile : styles.cardDesktop,
          ]}
        >
          <View style={[styles.left, isMobile && styles.leftMobile]}>
            <View style={styles.logoRow}>
              <FontAwesome name="headphones" size={28} color="#2d7ff9" />
              <Text style={styles.logoText}>Your Logo</Text>
            </View>
            {isMobile && (
              <Image
                source={illustration}
                style={styles.illustrationMobile}
                resizeMode="contain"
              />
            )}
            <Text style={styles.loginTitle}>Login</Text>
            <Text style={styles.loginSubtitle}>
              Login to access your LMS account
            </Text>
            <View style={styles.socialRow}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSignInWithSSO("oauth_google")}
              >
                <AntDesign name="google" size={20} color="#db4437" />
                <Text style={styles.socialButtonText}>Sign in with Google</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSignInWithSSO("oauth_apple")}
              >
                <AntDesign name="apple1" size={20} color="#000" />
                <Text style={styles.socialButtonText}>Sign in with Apple</Text>
              </TouchableOpacity>
            </View>
          </View>
          {!isMobile && (
            <View style={styles.right}>
              <Image
                source={illustration}
                style={styles.illustration}
                resizeMode="contain"
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,1.00)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 700,
    minHeight: 300,
    alignItems: "stretch",
    // Explicitly remove all shadow properties
    shadowColor: "transparent",
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  cardDesktop: {
    flexDirection: "row",
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  cardMobile: {
    flexDirection: "column",
    padding: 16,
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  left: {
    flex: 1,
    paddingRight: 32,
    justifyContent: "center",
  },
  leftMobile: {
    paddingRight: 0,
    alignItems: "center",
  },
  right: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    alignSelf: "flex-start",
  },
  logoText: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#222",
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#222",
    alignSelf: "flex-start",
  },
  loginSubtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 32,
    alignSelf: "flex-start",
  },
  socialRow: {
    marginTop: 16,
    gap: 16,
    width: "100%",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#222",
    fontWeight: "bold",
  },
  illustration: {
    width: 286, // 220 * 1.3 = 286
    height: 286, // 220 * 1.3 = 286
  },
  illustrationMobile: {
    width: 234, // 180 * 1.3 = 234
    height: 234, // 180 * 1.3 = 234
    marginBottom: 24,
    marginTop: 8,
  },
});
