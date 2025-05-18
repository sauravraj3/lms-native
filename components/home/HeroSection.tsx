import axios from "axios"; // Make sure axios is installed
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

function HeroSection() {
  const { width } = useWindowDimensions();
  const isMobile = width < 800;

  // Replace these with your actual asset paths
  const student1 = require("@/assets/images/student1.png");
  const student2 = require("@/assets/images/student2.png");
  const avatars = require("@/assets/images/avatars.png");

  // State for highlight text and titles
  const [highlightAboveTitle, setHighlightAboveTitle] = useState("");
  const [titleLineOne, setTitleLineOne] = useState("");
  const [titleLineTwo, setTitleLineTwo] = useState("");
  const [titleLineThree, setTitleLineThree] = useState("");
  // Add state for belowTitle
  const [belowTitle, setBelowTitle] = useState("");
  // Add state for leftImage and rightImage
  const [leftImage, setLeftImage] = useState<string | null>(null);
  const [rightImage, setRightImage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch from Strapi single type: homepage
    axios
      .get("http://192.168.1.5:1337/api/homepage")
      .then((res) => {
        const attrs = res.data?.data || {};
        setHighlightAboveTitle(attrs.highlightAboveTitle || "");
        setTitleLineOne(attrs.titleLineOne || "");
        setTitleLineTwo(attrs.titleLineTwo || "");
        setTitleLineThree(attrs.titleLineThree || "");
        setBelowTitle(attrs.belowTitle || "");
        setLeftImage(attrs.leftImage?.data?.attributes?.url || null);
        setRightImage(attrs.rightImage?.data?.attributes?.url || null);
      })
      .catch((err) => {
        // Optionally set fallback values
        // setHighlightAboveTitle("Learn & Get Certificates");
        // setTitleLineOne("Free Online Courses");
        // setTitleLineTwo("With Certificates &");
        // setTitleLineThree("Diplomas");
        // setBelowTitle("Your fallback text here");
      });
  }, []);

  return (
    <View className="container-fluid">
      <LinearGradient
        colors={["#F5E5E5", "#E0F0ED"]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View className="flex-1 w-full min-h-full items-center justify-center py-6 bg-transparent mt-8">
          <View
            className={`flex ${
              isMobile ? "flex-col py-4 px-4 mt-0" : "flex-row py-12 px-10"
            } w-full items-center justify-center rounded-none bg-transparent`}
          >
            {/* Left Side: Text and Search */}
            <View
              className={`${
                isMobile
                  ? "w-full items-start mb-8 pl-4"
                  : "w-1/2 justify-center pr-8 pl-60"
              }`}
            >
              <View className="bg-[#DFF6ED] self-start rounded-lg py-1 px-3 mb-4">
                <Text className="text-[#2DC97A] font-bold text-base">
                  {highlightAboveTitle}
                </Text>
              </View>
              <Text className="w-full text-[32px] font-bold text-[#111] mb-4 leading-10 text-left">
                {titleLineOne}
                {"\n"}
                {titleLineTwo}
                {"\n"}
                {titleLineThree}
              </Text>
              <Text className="w-full text-base text-[#444] mb-6 text-left">
                {belowTitle}
              </Text>
              <View className="flex-row items-center bg-white rounded-full border border-[#e0e0e0] px-2 py-1 w-full max-w-[380px] mt-2">
                <TextInput
                  className="flex-1 text-base py-2 px-3 text-[#222] bg-transparent"
                  placeholder="What do you want to learn today?"
                  placeholderTextColor="#888"
                />
                <TouchableOpacity className="bg-[#2DC97A] rounded-full p-2 ml-2 justify-center items-center">
                  <Text className="text-white text-lg font-bold">🔍</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Right Side: Images and Stats */}
            <View
              className={`${
                isMobile ? "w-full mt-4" : "w-1/2 mt-32"
              } flex items-center justify-center`}
            >
              <View
                className={`${
                  isMobile ? "w-80 h-[340px]" : "w-[416px] h-[442px]"
                } flex-row items-end justify-center relative`}
              >
                <Image
                  source={
                    leftImage
                      ? {
                          uri: leftImage.startsWith("http")
                            ? leftImage
                            : `http://localhost:1337${leftImage}`,
                        }
                      : student1
                  }
                  className={`${
                    isMobile
                      ? "w-32 h-44 rounded-full border-4 border-[#E5D6F6] bg-[#E5D6F6] z-20"
                      : "w-44 h-60 rounded-full border-4 border-[#E5D6F6] bg-[#E5D6F6] z-20"
                  }`}
                />
                {/* Student 2 */}
                <Image
                  source={
                    rightImage
                      ? {
                          uri: rightImage.startsWith("http")
                            ? rightImage
                            : `http://localhost:1337${rightImage}`,
                        }
                      : student2
                  }
                  className={`${
                    isMobile
                      ? "w-40 h-56 rounded-full border-4 border-[#2D7FF9] bg-[#2D7FF9] z-10 ml-6"
                      : "w-52 h-72 rounded-full border-4 border-[#2D7FF9] bg-[#2D7FF9] z-10 ml-10"
                  }`}
                />
                {/* Top stat bubble */}
                <View
                  className={`flex-row items-center bg-white rounded-full py-2 px-4 absolute left-10 ${
                    isMobile ? "top-9" : "top-2"
                  } shadow z-30`}
                >
                  <Image source={avatars} className="w-10 h-6 rounded-xl" />
                  <View className="ml-2">
                    <Text className="font-bold text-lg text-[#2D7FF9] text-center">
                      2k+
                    </Text>
                    <Text className="text-xs text-[#222] text-center">
                      Student
                    </Text>
                  </View>
                </View>
              </View>

              {/* Bottom stat bubble placed below the images, not overlapping */}
              <View className={`w-full flex-row justify-end mt-4 pr-4`}>
                <View className="bg-white rounded-full py-2 px-5 shadow z-30 items-center">
                  <Text className="font-bold text-lg text-[#2D7FF9] text-center">
                    5.8k
                  </Text>
                  <Text className="text-xs text-[#222] text-center">
                    Success Courses
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

export default HeroSection;
