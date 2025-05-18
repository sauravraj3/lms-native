import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

export default function Benefits() {
  const { width } = useWindowDimensions();
  const isMobile = width < 900;

  // Replace with your actual asset paths
  const studentMain = require("@/assets/images/benefit-student-group.png");
  const deco = require("@/assets/images/benefit-deco.png");

  return (
    <View className="w-full flex justify-center">
      <View
        className={`${
          isMobile ? "flex-col px-4 py-8 gap-8" : "flex-row px-24 py-16 gap-12"
        } flex w-full max-w-[1300px] mx-auto items-start`}
      >
        {/* Left Side: Main Student Image */}
        <View
          className={`${
            isMobile
              ? "w-full flex-row items-center justify-center gap-4"
              : "w-[220px] flex-col items-center"
          }`}
        >
          <View className="relative">
            <Image
              source={studentMain}
              className="w-[180px] h-[220px] rounded-xl object-cover"
              resizeMode="cover"
            />
            <Image
              source={deco}
              className="w-8 h-8 absolute -left-4 -top-4 z-10"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Right Side: Text Content and Experience Box */}
        <View
          className={`${
            isMobile
              ? "w-full mt-8 items-center"
              : "flex-1 ml-12 items-start relative"
          } flex flex-col`}
        >
          <Text className="text-[#F55F44] font-bold text-[13px] mb-2 tracking-wider uppercase">
            <Text className="text-[#F55F44] text-[16px] font-bold">◇ </Text>
            About Us
          </Text>
          <Text className="text-[32px] font-extrabold text-[#222] mb-4 leading-tight">
            Benefit From Our Online{"\n"}
            Learning Expertise Earn{" "}
            <Text className="text-[#F55F44]">Professional</Text>
          </Text>
          <Text className="text-[16px] text-[#666] mb-6 max-w-[440px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore.
          </Text>
          <View className="flex-row w-full gap-8 mb-6">
            <View className="flex-1 min-w-[160px] max-w-[240px]">
              <Text className="font-bold text-[15px] text-[#222] mb-1 uppercase">
                Our Mission:
              </Text>
              <Text className="text-[14px] text-[#666]">
                Suspendisse ultrice gravida dictum fusce placerat ultricies
                integer quis auctor elit sed vulputate mi sit.
              </Text>
            </View>
            <View className="flex-1 min-w-[160px] max-w-[240px]">
              <Text className="font-bold text-[15px] text-[#222] mb-1 uppercase">
                Our Vission:
              </Text>
              <Text className="text-[14px] text-[#666]">
                Suspendisse ultrice gravida dictum fusce placerat ultricies
                integer quis auctor elit sed vulputate mi sit.
              </Text>
            </View>
          </View>
          <TouchableOpacity className="flex-row items-center bg-[#2DC97A] rounded-full py-3 px-8 mt-2 self-start shadow">
            <Text className="text-white font-bold text-[16px] mr-3">
              Admission Open
            </Text>
            <Text className="text-white text-[20px] font-bold">→</Text>
          </TouchableOpacity>

          {/* Experience Box - positioned diagonally bottom right to the text */}
          {!isMobile && (
            <>
              <View
                className="absolute right-0 bottom-0 translate-x-1/3 translate-y-1/3 flex flex-col items-center justify-center bg-white rounded-xl border border-[#E6E6E6] shadow-sm px-8 py-6 min-w-[160px]"
                style={{ elevation: 4 }}
              >
                <Text className="text-[#F55F44] text-[32px] font-bold mb-1">
                  35+
                </Text>
                <Text className="text-[#222] text-base font-medium text-center">
                  Years Experience
                </Text>
              </View>
              <View
                className="absolute right-0 bottom-32 translate-x-1/3 flex flex-col items-center justify-center bg-white rounded-xl border border-[#E6E6E6] shadow-sm px-8 py-6 min-w-[160px]"
                style={{ elevation: 4 }}
              >
                <Text className="text-[#2D7FF9] text-[32px] font-bold mb-1">
                  20000+
                </Text>
                <Text className="text-[#222] text-base font-medium text-center">
                  Users Enrolled
                </Text>
              </View>
            </>
          )}
          {/* On mobile, keep both below the image */}
          {isMobile && (
            <View className="w-full flex-row justify-center gap-4 mt-6">
              <View className="flex flex-col items-center justify-center bg-white rounded-xl border border-[#E6E6E6] shadow-sm px-8 py-6 min-w-[140px]">
                <Text className="text-[#F55F44] text-[32px] font-bold mb-1">
                  35+
                </Text>
                <Text className="text-[#222] text-base font-medium text-center">
                  Years Experience
                </Text>
              </View>
              <View className="flex flex-col items-center justify-center bg-white rounded-xl border border-[#E6E6E6] shadow-sm px-8 py-6 min-w-[140px]">
                <Text className="text-[#2D7FF9] text-[32px] font-bold mb-1">
                  2000+
                </Text>
                <Text className="text-[#222] text-base font-medium text-center">
                  Users Enrolled
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
