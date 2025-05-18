import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

type Course = {
  id: number;
  title: string;
  description: any;
  isPremium: boolean;
  slug: string;
  revenuecatId: string;
  image?: any;
  category?: string;
  price?: string;
  rating?: number;
  ratingCount?: number;
  lessons?: any[];
  duration?: string;
  students?: number;
  instructor?: {
    name: string;
    avatar?: string;
  };
};

type RootStackParamList = {
  "[slug]": { slug: string }; // Dynamic route for /courses/[slug]
  // add other routes here if needed
};

export default function FeaturedCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://192.168.1.5:1337/api/courses?populate=image")
      .then((res) => {
        setCourses(res.data?.data || []);
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  // Responsive: 1 on mobile, 2 on tablet, 3 on desktop
  let numColumns = 1;
  if (width >= 900) numColumns = 3;
  else if (width >= 600) numColumns = 2;

  // Split courses into rows
  const rows = [];
  for (let i = 0; i < courses.length; i += numColumns) {
    rows.push(courses.slice(i, i + numColumns));
  }

  if (loading) {
    return (
      <View className="container-fluid flex-1 items-center justify-center py-10">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="container-fluid w-full px-2 py-6">
      <Text className="text-2xl font-bold mb-6 text-[#2D7FF9] px-2 md:px-12 text-center">
        Featured Courses
      </Text>
      <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
        {rows.map((row, rowIndex) => (
          <View
            key={rowIndex}
            className="flex-row mb-8 w-full justify-center gap-4"
          >
            {row.map((course) => {
              // Get image URL if available
              let imgUrl: string | undefined = undefined;
              if (course.image && course.image.url) {
                imgUrl = course.image.url.startsWith("http")
                  ? course.image.url
                  : `http://192.168.1.5:1337${course.image.url}`;
              } else if (course.image && course.image.formats?.thumbnail?.url) {
                imgUrl = `http://192.168.1.5:1337${course.image.formats.thumbnail.url}`;
              }

              // Demo/fallback data for UI
              const category = course.category;
              const price = course.price || "$50.00";
              const rating = course.rating || 4.5;
              const ratingCount = course.ratingCount || "4.5k";
              const lessons = course.lessons?.length || 10;
              const duration = course.duration || "19h 30m";
              const students = course.students || "20+";
              const instructor = course.instructor || {
                name: "Samantha",
                avatar: undefined,
              };

              return (
                <TouchableOpacity
                  key={course.id}
                  activeOpacity={0.9}
                  onPress={() =>
                    router.push({
                      pathname: "/courses/[slug]",
                      params: {
                        slug: course.slug,
                      },
                    })
                  }
                  className="flex-1 max-w-[350px] min-w-[280px] mx-2 bg-white rounded-2xl border border-dashed border-[#B9B9B9] p-0 shadow-sm"
                >
                  {/* Course Image */}
                  <View className="relative w-full h-40 rounded-t-2xl overflow-hidden">
                    {imgUrl && (
                      <Image
                        source={{ uri: imgUrl }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    )}
                    {/* Category Badge */}
                    <View className="absolute left-3 top-3 bg-[#23235F] px-3 py-1 rounded-lg">
                      <Text className="text-xs text-white font-semibold">
                        {category?.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  {/* Card Content */}
                  <View className="px-4 pt-4 pb-2">
                    {/* Rating and Price */}
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center">
                        <Text className="text-[#FF6B00] text-base font-bold mr-1">
                          ★
                        </Text>
                        <Text className="text-[#23235F] font-semibold text-base mr-1">
                          {rating}
                        </Text>
                        <Text className="text-[#B9B9B9] text-xs">
                          {ratingCount}
                        </Text>
                      </View>
                      <Text className="text-[#23235F] font-semibold text-base">
                        {price}
                      </Text>
                    </View>
                    {/* Title */}
                    <Text className="text-[#23235F] font-bold text-lg mb-2">
                      {course.title}
                    </Text>
                    {/* Course Info Row */}
                    <View className="flex-row items-center justify-between bg-[#F7F7FB] rounded-lg px-3 py-2 mb-4">
                      <View className="flex-row items-center">
                        <Text className="text-[#23235F] text-xs mr-1">📚</Text>
                        <Text className="text-[#23235F] text-xs mr-2">
                          Lesson {lessons}
                        </Text>
                        <Text className="text-[#23235F] text-xs mr-1">⏰</Text>
                        <Text className="text-[#23235F] text-xs mr-2">
                          {duration}
                        </Text>
                        <Text className="text-[#23235F] text-xs mr-1">👥</Text>
                        <Text className="text-[#23235F] text-xs">
                          {students} Students
                        </Text>
                      </View>
                    </View>
                    {/* Enroll Button */}
                    <View className="flex-row items-center justify-start">
                      <TouchableOpacity
                        className="bg-[#23235F] rounded-full px-6 py-2"
                        onPress={() =>
                          router.push({
                            pathname: "/courses/[slug]",
                            params: { slug: course.slug },
                          })
                        }
                      >
                        <Text className="text-white font-semibold text-sm">
                          Enroll →
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
            {/* Fill empty columns for alignment */}
            {row.length < numColumns &&
              Array.from({ length: numColumns - row.length }).map((_, idx) => (
                <View
                  key={idx}
                  className="flex-1 max-w-[350px] min-w-[280px] mx-2"
                />
              ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
