import Categories from "@/components/home/Categories";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { ScrollView, useWindowDimensions } from "react-native";
import Benefits from "../../components/home/Benefits"; // <-- Fixed import path
import HeroSection from "../../components/home/HeroSection"; // <-- Fixed import path
import "../../global.css";
export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 800;
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [isMobile, navigation]);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <HeroSection />
      <Benefits />
      <Categories />

      <FeaturedCourses />
    </ScrollView>
  );
}
