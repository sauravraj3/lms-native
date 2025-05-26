import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function LessonPage() {
  const { lessonSlug } = useLocalSearchParams();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!lessonSlug) return;
    setLoading(true);
    axios
      .get(
        `http://192.168.31.180:1337/api/lessons?filters[slug][$eq]=${lessonSlug}&populate=video`
      )
      .then((res) => {
        const apiData = res.data?.data?.[0];
        setLesson(apiData);
      })
      .catch(() => setLesson(null))
      .finally(() => setLoading(false));
  }, [lessonSlug]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f7f9fa]">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!lesson) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f7f9fa]">
        <Text className="text-lg text-gray-500">Lesson not found.</Text>
      </View>
    );
  }

  // Get video URL
  let videoUrl = lesson.video?.url;
  if (videoUrl && !videoUrl.startsWith("http")) {
    videoUrl = `http://192.168.31.180:1337${videoUrl}`;
  }

  return (
    <ScrollView
      className="bg-[#f7f9fa] flex-1"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="container mx-auto w-full flex flex-col items-center px-2 py-6 md:px-[80px]">
        <Text className="text-2xl font-bold mb-4 text-[#23235F] text-center">
          {lesson.title || lesson.name}
        </Text>
        {videoUrl ? (
          <View className="w-full aspect-video max-w-3xl rounded-2xl overflow-hidden bg-black mb-6">
            {/* Responsive HTML5 video embed for web */}
            {Platform.OS === "web" ? (
              <video
                src={videoUrl}
                controls
                className="w-full h-full object-contain rounded-2xl"
                style={{ maxHeight: 400, background: "#000" }}
              />
            ) : (
              <Text className="text-base text-gray-500">
                Video playback is only available on web.
              </Text>
            )}
          </View>
        ) : (
          <Text className="text-base text-gray-500 mb-6">
            No video available for this lesson.
          </Text>
        )}
        <Text className="text-base text-gray-700 mb-4 w-full max-w-3xl">
          {lesson.description || "No description available."}
        </Text>
      </View>
    </ScrollView>
  );
}
