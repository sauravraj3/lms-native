import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

export default function GlobalHeader() {
  const { isSignedIn, signOut } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 800;
  const isMobile = width < 800;

  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <View
      className="flex-row items-center justify-between px-4 py-2 bg-white shadow-sm w-full"
      style={!isDesktop ? { marginTop: 25 } : undefined}
    >
      {/* Logo on the left */}
      <TouchableOpacity onPress={() => router.push("/")}>
        <Image
          source={require("@/assets/images/logo-edu.png")}
          style={{
            width: 100,
            height: 60,
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
      {/* Desktop: Login, Dashboard, or Logout button */}
      {isDesktop && (
        <View className="flex-row items-center">
          {!isSignedIn && (
            <TouchableOpacity
              onPress={() => router.push("/login")}
              className="flex-row items-center px-4 py-2"
            >
              <Ionicons
                name="log-in-outline"
                size={20}
                color="#2D7FF9"
                style={{ marginRight: 6 }}
              />
              <Text className="text-[#2D7FF9] font-bold text-base">Login</Text>
            </TouchableOpacity>
          )}
          {isSignedIn && (
            <>
              <TouchableOpacity
                onPress={() => router.push("/dashboard")}
                className="flex-row items-center px-4 py-2"
              >
                <Ionicons
                  name="grid-outline"
                  size={20}
                  color="#2D7FF9"
                  style={{ marginRight: 6 }}
                />
                <Text className="text-[#2D7FF9] font-bold text-base">
                  Dashboard
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  setMenuOpen(false);
                  await signOut();
                }}
                className="flex-row items-center px-4 py-2"
              >
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color="#EF4444"
                  style={{ marginRight: 6 }}
                />
                <Text className="text-[#EF4444] font-bold text-base">
                  Logout
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
      {/* Mobile: Hamburger icon on the right */}
      {isMobile && (
        <>
          <TouchableOpacity
            onPress={() => setMenuOpen((open) => !open)}
            className="p-2"
            style={{ position: "absolute", right: 16 }}
          >
            <Ionicons
              name={menuOpen ? "close" : "menu"}
              size={32}
              color="#2D7FF9"
            />
          </TouchableOpacity>
          {menuOpen && (
            <View
              className="absolute right-4 bg-white border border-gray-200 shadow z-50 rounded-lg"
              style={{ top: 70, width: 180 }}
            >
              {!isSignedIn && (
                <TouchableOpacity
                  className="flex-row items-center px-6 py-4 border-b border-gray-100"
                  onPress={() => {
                    setMenuOpen(false);
                    router.push("/login");
                  }}
                >
                  <Ionicons
                    name="log-in-outline"
                    size={20}
                    color="#2D7FF9"
                    style={{ marginRight: 10 }}
                  />
                  <Text className="text-[#2D7FF9] font-bold text-base">
                    Login
                  </Text>
                </TouchableOpacity>
              )}
              {isSignedIn && (
                <>
                  <TouchableOpacity
                    className="flex-row items-center px-6 py-4 border-b border-gray-100"
                    onPress={() => {
                      setMenuOpen(false);
                      router.push("/dashboard");
                    }}
                  >
                    <Ionicons
                      name="grid-outline"
                      size={20}
                      color="#2D7FF9"
                      style={{ marginRight: 10 }}
                    />
                    <Text className="text-[#2D7FF9] font-bold text-base">
                      Dashboard
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-row items-center px-6 py-4"
                    onPress={async () => {
                      setMenuOpen(false);
                      await signOut();
                    }}
                  >
                    <Ionicons
                      name="log-out-outline"
                      size={20}
                      color="#EF4444"
                      style={{ marginRight: 10 }}
                    />
                    <Text className="text-[#EF4444] font-bold text-base">
                      Logout
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </>
      )}
    </View>
  );
}
