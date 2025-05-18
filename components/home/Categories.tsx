import React from "react";
import { Image, Text, View } from "react-native";

const categories = [
  {
    name: "Business Management",
    icon: require("@/assets/images/business.png"),
    bg: "bg-[#E6F2FF]",
  },
  {
    name: "Arts & Design",
    icon: require("@/assets/images/and.png"),
    bg: "bg-[#FFE6EB]",
  },
  {
    name: "Personal Development",
    icon: require("@/assets/images/pdev.png"),
    bg: "bg-[#E6FFF4]",
  },
  {
    name: "UI/UX Design",
    icon: require("@/assets/images/uiux.png"),
    bg: "bg-[#FFF9E6]",
  },
  {
    name: "Graphic Design",
    icon: require("@/assets/images/gd.png"),
    bg: "bg-[#F1E6FF]",
  },
  {
    name: "Digital Marketing",
    icon: require("@/assets/images/dm.png"),
    bg: "bg-[#FFE6F8]",
  },
  {
    name: "Exclusive man",
    icon: require("@/assets/images/business.png"),
    bg: "bg-[#E6E9FF]",
  },
  {
    name: "Product Design",
    icon: require("@/assets/images/pdes.png"),
    bg: "bg-[#FFF9E6]",
  },
  {
    name: "Video & Photography",
    icon: require("@/assets/images/vpho.png"),
    bg: "bg-[#E6F2FF]",
  },
];

export default function Categories() {
  return (
    <View className="container mx-auto w-full py-10">
      <Text className="text-center text-[28px] font-extrabold text-[#222] mb-8">
        Browse By Categories
      </Text>
      <View className="w-full flex flex-row flex-wrap justify-center gap-6">
        {categories.map((cat, idx) => (
          <View
            key={cat.name}
            className={`${cat.bg} flex-row items-center rounded-xl px-6 py-6 min-w-[240px] max-w-[320px] flex-1 mb-2`}
            style={{
              minWidth: 160,
              maxWidth: 320,
              flexBasis: "30%",
            }}
          >
            <Image
              source={cat.icon}
              className="w-10 h-10 mr-4"
              resizeMode="contain"
            />
            <Text className="font-bold text-base text-[#222]">{cat.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
