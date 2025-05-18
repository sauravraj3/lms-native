import { useAuth, useUser } from "@clerk/clerk-expo";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DashboardUi() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <View className="flex-1 flex-col md:flex-row bg-[#f6fbff]">
      {/* Sidebar */}
      <View className="hidden md:flex w-64 bg-white h-full shadow-lg px-4 py-6">
        {/* Logo and Title */}
        <View className="flex-row items-center mb-8">
          <Image
            source={require("@/assets/images/logo-edu.png")}
            style={{
              width: 100,
              height: 60,
            }}
            resizeMode="contain"
          />
        </View>
        {/* Sidebar Menu */}
        <View className="space-y-2">
          <TouchableOpacity className="flex-row items-center bg-[#e3f0fa] rounded-lg px-3 py-2">
            <Ionicons name="home-outline" size={20} color="#2D7FF9" />
            <Text className="ml-3 text-base font-semibold text-[#2D7FF9]">
              Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center px-3 py-2">
            <Feather name="compass" size={20} color="#222" />
            <Text className="ml-3 text-base text-[#222]">Explore Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center px-3 py-2">
            <Ionicons name="git-compare-outline" size={20} color="#222" />
            <Text className="ml-3 text-base text-[#222]">Compare Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center px-3 py-2">
            <Ionicons name="cart-outline" size={20} color="#222" />
            <Text className="ml-3 text-base text-[#222]">My Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center px-3 py-2">
            <Ionicons name="settings-outline" size={20} color="#222" />
            <Text className="ml-3 text-base text-[#222]">Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mobile Header */}
      <View
        className="flex md:hidden flex-row items-center justify-between px-4 bg-white shadow-sm"
        style={{ height: 80, marginTop: 12 }}
      >
        {/* Logo */}
        <View className="flex-row items-center">
          <Image
            source={require("@/assets/images/logo-edu.png")}
            style={{
              width: 100,
              height: 60,
            }}
            resizeMode="contain"
          />
        </View>
        {/* Right: Notification, Help, User */}
        <View className="flex-row items-center relative">
          <TouchableOpacity className="mr-3">
            <Ionicons name="notifications-outline" size={22} color="#222" />
          </TouchableOpacity>
          <TouchableOpacity className="mr-3">
            <Ionicons name="help-circle-outline" size={22} color="#222" />
          </TouchableOpacity>
          <Pressable
            className="flex-row items-center px-2 py-1 rounded-lg"
            onPress={() => setDropdownOpen((open) => !open)}
          >
            {user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                className="w-7 h-7 rounded-full mr-2"
              />
            ) : (
              <View className="w-7 h-7 bg-gray-300 rounded-full mr-2" />
            )}
            <Text className="font-semibold text-[#222] text-sm">
              {user?.username || user?.firstName || "User"}
            </Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color="#888"
              className="ml-1"
            />
          </Pressable>
          {dropdownOpen && (
            <View className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-100 z-50 min-w-[140px]">
              <TouchableOpacity
                className="flex-row items-center px-4 py-3"
                onPress={async () => {
                  setDropdownOpen(false);
                  await signOut();
                  router.replace("/");
                }}
              >
                <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                <Text className="ml-2 text-[#EF4444] font-semibold">
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 px-4 md:px-12 py-6">
        {/* Add spacing from top for mobile */}
        <View className="block md:hidden" style={{ marginTop: 8 }} />

        {/* Header (desktop only) */}
        <View className="hidden md:flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <View>
            <Text className="text-2xl md:text-3xl font-bold text-gray-900">
              Welcome back, {user?.username || user?.firstName || "User"}!{" "}
              <Text className="text-2xl">👋</Text>
            </Text>
            <Text className="text-base text-gray-500 mt-1">
              Continue your learning journey from where you left off
            </Text>
          </View>
          {/* User Info */}
          <View className="flex-row items-center mt-4 md:mt-0 relative">
            <TouchableOpacity className="mr-4">
              <Ionicons name="notifications-outline" size={22} color="#222" />
            </TouchableOpacity>
            <TouchableOpacity className="mr-4">
              <Ionicons name="help-circle-outline" size={22} color="#222" />
            </TouchableOpacity>
            <Pressable
              className="flex-row items-center px-3 py-2 rounded-lg"
              onPress={() => setDropdownOpen((open) => !open)}
            >
              {user?.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  className="w-8 h-8 rounded-full mr-2"
                />
              ) : (
                <View className="w-8 h-8 bg-gray-300 rounded-full mr-2" />
              )}
              <View>
                <Text className="font-semibold text-[#222] text-sm">
                  {user?.username || user?.firstName || "User"}
                </Text>
                <Text className="text-xs text-gray-400">User Account</Text>
              </View>
              <Ionicons
                name="chevron-down"
                size={18}
                color="#888"
                className="ml-2"
              />
            </Pressable>
            {dropdownOpen && (
              <View className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-100 z-50 min-w-[160px]">
                <TouchableOpacity
                  className="flex-row items-center px-4 py-3"
                  onPress={async () => {
                    setDropdownOpen(false);
                    await signOut();
                    router.replace("/");
                  }}
                >
                  <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                  <Text className="ml-2 text-[#EF4444] font-semibold">
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Add spacing here */}
        <View className="h-6" />

        {/* Stats */}
        <View
          className="
          flex-col md:flex-row
          md:space-x-4
          space-y-4 md:space-y-0
          mb-8
        "
        >
          {/* Mobile: 2 columns, 2 rows */}
          <View className="block md:hidden">
            <View className="flex-row space-x-4 mb-4">
              <View className="flex-1 bg-white border border-[#e3f0fa] rounded-xl p-5 items-center">
                <Ionicons name="time-outline" size={28} color="#2D7FF9" />
                <Text className="text-2xl font-bold text-[#222] mt-2">
                  12.5h
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Learning time
                </Text>
                <Text className="text-xs text-gray-400 mt-1">This week</Text>
              </View>
              <View className="flex-1 bg-white border border-[#e3f0fa] rounded-xl p-5 items-center">
                <Ionicons name="albums-outline" size={28} color="#2D7FF9" />
                <Text className="text-2xl font-bold text-[#222] mt-2">4</Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Courses in progress
                </Text>
                <Text className="text-xs text-gray-400 mt-1">Total</Text>
              </View>
            </View>
            <View className="flex-row space-x-4">
              <View className="flex-1 bg-white border border-[#e3f0fa] rounded-xl p-5 items-center">
                <Ionicons name="ribbon-outline" size={28} color="#2D7FF9" />
                <Text className="text-2xl font-bold text-[#222] mt-2">12</Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Certificates earned
                </Text>
                <Text className="text-xs text-gray-400 mt-1">Total</Text>
              </View>
              <View className="flex-1 bg-white border border-[#e3f0fa] rounded-xl p-5 items-center">
                <Ionicons name="trophy-outline" size={28} color="#2D7FF9" />
                <Text className="text-2xl font-bold text-[#222] mt-2">85%</Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Average score
                </Text>
                <Text className="text-xs text-gray-400 mt-1">Current</Text>
              </View>
            </View>
          </View>
          {/* Desktop: 4 in a row */}
          <View className="hidden md:flex flex-1 flex-row md:space-x-4 space-y-0">
            <View className="flex-1 bg-white border border-[#e3f0fa] rounded-xl p-5 items-center">
              <Ionicons name="time-outline" size={28} color="#2D7FF9" />
              <Text className="text-2xl font-bold text-[#222] mt-2">12.5h</Text>
              <Text className="text-xs text-gray-500 mt-1">Learning time</Text>
              <Text className="text-xs text-gray-400 mt-1">This week</Text>
            </View>
            <View className="flex-1 bg-white border border-[#e3f0fa] rounded-xl p-5 items-center">
              <Ionicons name="albums-outline" size={28} color="#2D7FF9" />
              <Text className="text-2xl font-bold text-[#222] mt-2">4</Text>
              <Text className="text-xs text-gray-500 mt-1">
                Courses in progress
              </Text>
              <Text className="text-xs text-gray-400 mt-1">Total</Text>
            </View>
            <View className="flex-1 bg-white border border-[#e3f0fa] rounded-xl p-5 items-center">
              <Ionicons name="ribbon-outline" size={28} color="#2D7FF9" />
              <Text className="text-2xl font-bold text-[#222] mt-2">12</Text>
              <Text className="text-xs text-gray-500 mt-1">
                Certificates earned
              </Text>
              <Text className="text-xs text-gray-400 mt-1">Total</Text>
            </View>
            <View className="flex-1 bg-white border border-[#e3f0fa] rounded-xl p-5 items-center">
              <Ionicons name="trophy-outline" size={28} color="#2D7FF9" />
              <Text className="text-2xl font-bold text-[#222] mt-2">85%</Text>
              <Text className="text-xs text-gray-500 mt-1">Average score</Text>
              <Text className="text-xs text-gray-400 mt-1">Current</Text>
            </View>
          </View>
        </View>

        {/* Continue Learning */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-gray-900">
            Continue Learning
          </Text>
          <TouchableOpacity>
            <Text className="text-[#2D7FF9] font-semibold">
              View all courses
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row space-x-4"
        >
          {/* Card 1 */}
          <View className="bg-white rounded-xl border border-[#e3f0fa] w-72 mr-4">
            <Image
              source={{
                uri: "https://dummyimage.com/320x120/2d7ff9/fff&text=Practical+Graphic+Design",
              }}
              className="w-full h-28 rounded-t-xl"
              resizeMode="cover"
            />
            <View className="p-4">
              <Text className="font-bold text-base text-[#222] mb-1">
                The Complete AI Guide: Learn ChatGPT
              </Text>
              <Text className="text-xs text-gray-500 mb-2">
                65% completed · Last visited 2 days ago
              </Text>
              <TouchableOpacity className="bg-[#2D7FF9] rounded-lg py-2 flex-row items-center justify-center">
                <Ionicons name="play-circle-outline" size={18} color="#fff" />
                <Text className="text-white font-bold ml-2">
                  Continue Learning
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Card 2 */}
          <View className="bg-white rounded-xl border border-[#e3f0fa] w-72 mr-4">
            <Image
              source={{
                uri: "https://dummyimage.com/320x120/222/fff&text=Copywriting",
              }}
              className="w-full h-28 rounded-t-xl"
              resizeMode="cover"
            />
            <View className="p-4">
              <Text className="font-bold text-base text-[#222] mb-1">
                Advanced Copywriting Techniques
              </Text>
              <Text className="text-xs text-gray-500 mb-2">
                45% completed · Last visited 5 days ago
              </Text>
              <TouchableOpacity className="bg-[#2D7FF9] rounded-lg py-2 flex-row items-center justify-center">
                <Ionicons name="play-circle-outline" size={18} color="#fff" />
                <Text className="text-white font-bold ml-2">
                  Continue Learning
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Card 3 */}
          <View className="bg-white rounded-xl border border-[#e3f0fa] w-72">
            <Image
              source={{
                uri: "https://dummyimage.com/320x120/fff/222&text=Notion",
              }}
              className="w-full h-28 rounded-t-xl"
              resizeMode="cover"
            />
            <View className="p-4">
              <Text className="font-bold text-base text-[#222] mb-1">
                Notion Masterclass: Maximise Your Workflow
              </Text>
              <Text className="text-xs text-gray-500 mb-2">
                25% completed · Last visited 1 week ago
              </Text>
              <TouchableOpacity className="bg-[#2D7FF9] rounded-lg py-2 flex-row items-center justify-center">
                <Ionicons name="play-circle-outline" size={18} color="#fff" />
                <Text className="text-white font-bold ml-2">
                  Continue Learning
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}
