import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import GlobalHeader from "../components/GlobalHeader";

// Dummy data for demonstration; replace with real data fetching logic
const course = {
  title: "The Complete AI Guide: Learn ChatGPT, Generative AI & More",
  subtitle:
    "Master the fundamentals and advanced concepts of AI, including practical applications with ChatGPT, machine learning models, and real-world AI solutions.",
  price: "$89.99",
  oldPrice: "$199.99",
  category: "Machine Learning",
  bestseller: true,
  image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", // Replace with your image URL
  instructor: {
    name: "Liam Anderson",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    title: "AI Enthusiast & Instructor",
    rating: 4.9,
    students: "35,000+",
    courses: 12,
    reviews: 4.8,
    bio: "Liam is an AI instructor with 10+ years of experience, passionate about making complex concepts easy to understand. He has taught thousands of students worldwide.",
  },
  rating: 4.9,
  ratingCount: "6,250",
  students: "35,000+",
  lastUpdated: "April 2025",
  whatYouWillLearn: [
    "Understand core AI concepts and their practical applications",
    "Build and deploy machine learning models",
    "Learn advanced neural network architectures",
    "Master ChatGPT and other generative AI tools",
    "Build AI solutions for real-world problems",
    "Develop advanced applications for business",
  ],
  features: [
    "42 hours of content",
    "22 downloadable resources",
    "Certificate of completion",
    "Lifetime access",
  ],
  progress: 0,
  recommendedPath: [
    { label: "AI Fundamentals", active: true },
    { label: "Deep Learning", active: false },
    { label: "AI Applications", active: false },
  ],
  feedback: [
    {
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      comment:
        "This course exceeded my expectations. The instructor's teaching style is clear, and the hands-on projects really helped me understand the concepts.",
    },
  ],
  reviewsBreakdown: [
    { stars: 5, percent: 82 },
    { stars: 4, percent: 13 },
    { stars: 3, percent: 3 },
    { stars: 2, percent: 1 },
    { stars: 1, percent: 1 },
  ],
};

export default function SingleCourseUI() {
  const { width } = useWindowDimensions();
  const isMobile = width < 800;

  return (
    <ScrollView className="bg-[#f7f9fa] flex-1">
      <GlobalHeader />
      {/* Header with image */}
      <View className="w-full  rounded-b-2xl ">
        <View className="container mx-auto px-2 md:px-8">
          <Image
            source={{ uri: course.image }}
            className="w-full h-56 md:h-80 rounded-b-2xl"
            resizeMode="cover"
          />
          <View className="absolute left-4 top-4 flex-row gap-2">
            <Text className="bg-[#23235F] text-white text-xs px-3 py-1 rounded-lg font-semibold">
              {course.category}
            </Text>
            {course.bestseller && (
              <Text className="bg-[#2DC97A] text-white text-xs px-3 py-1 rounded-lg font-semibold">
                Bestseller
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View className="container mx-auto w-full flex-col md:flex-row gap-6 px-2 md:px-8 mt-[-32px]">
        {/* Left/Main Section */}
        <View className="flex-1  rounded-2xl  p-6 mt-8">
          <Text className="text-2xl md:text-3xl font-bold mb-2 text-[#23235F]">
            {course.title}
          </Text>
          <Text className="text-base text-gray-700 mb-4">
            {course.subtitle}
          </Text>
          <View className="flex-row items-center mb-4 gap-2 flex-wrap">
            <Text className="text-[#FF6B00] font-bold text-base">
              ★ {course.rating}
            </Text>
            <Text className="text-gray-500 text-sm">
              ({course.ratingCount} ratings) • {course.students} students
              enrolled
            </Text>
            <Text className="text-gray-400 text-xs ml-2">
              Last updated {course.lastUpdated}
            </Text>
          </View>
          {/* Instructor */}
          <View className="flex-row items-center mb-6">
            <Image
              source={{ uri: course.instructor.avatar }}
              className="w-10 h-10 rounded-full mr-3"
            />
            <View>
              <Text className="font-semibold text-[#23235F]">
                {course.instructor.name}
              </Text>
              <Text className="text-xs text-gray-500">
                {course.instructor.title}
              </Text>
            </View>
          </View>
          {/* What You'll Learn */}
          <Text className="font-bold text-lg mb-2 text-[#23235F]">
            What You'll Learn
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {course.whatYouWillLearn.map((item, idx) => (
              <View
                key={idx}
                className="bg-[#F7F7FB] px-4 py-2 rounded-lg mb-2"
                style={{ minWidth: isMobile ? "100%" : "45%" }}
              >
                <Text className="text-[#23235F] text-sm">{item}</Text>
              </View>
            ))}
          </View>
          {/* Instructor Bio */}
          <Text className="font-bold text-lg mb-2 text-[#23235F]">
            Your Instructor
          </Text>
          <View className="flex-row items-center mb-4">
            <Image
              source={{ uri: course.instructor.avatar }}
              className="w-10 h-10 rounded-full mr-3"
            />
            <View>
              <Text className="font-semibold text-[#23235F]">
                {course.instructor.name}
              </Text>
              <Text className="text-xs text-gray-500">
                {course.instructor.title}
              </Text>
              <Text className="text-xs text-gray-500">
                {course.instructor.courses} Courses •{" "}
                {course.instructor.students} Students •{" "}
                {course.instructor.reviews} Instructor Rating
              </Text>
            </View>
          </View>
          <Text className="text-gray-700 mb-6">{course.instructor.bio}</Text>
          {/* Student Feedback */}
          <Text className="font-bold text-lg mb-2 text-[#23235F]">
            Student Feedback
          </Text>
          <View className="bg-[#F7F7FB] rounded-xl p-4 mb-4">
            {course.reviewsBreakdown.map((item, idx) => (
              <View key={idx} className="flex-row items-center mb-1">
                <Text className="w-8 text-xs text-[#23235F]">
                  {item.stars} star
                </Text>
                <View className="flex-1 h-2 bg-gray-200 rounded-full mx-2 overflow-hidden">
                  <View
                    className="h-2 bg-[#2D7FF9] rounded-full"
                    style={{ width: `${item.percent}%` }}
                  />
                </View>
                <Text className="w-8 text-xs text-[#23235F]">
                  {item.percent}%
                </Text>
              </View>
            ))}
          </View>
          {/* Single Feedback */}
          {course.feedback.map((fb, idx) => (
            <View key={idx} className="flex-row items-start mb-2">
              <Image
                source={{ uri: fb.avatar }}
                className="w-8 h-8 rounded-full mr-3"
              />
              <View>
                <Text className="font-semibold text-[#23235F]">{fb.name}</Text>
                <Text className="text-xs text-gray-500 mb-1">
                  ★ {fb.rating}
                </Text>
                <Text className="text-gray-700">{fb.comment}</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity className="mt-2">
            <Text className="text-[#2D7FF9] font-semibold">
              See all Reviews
            </Text>
          </TouchableOpacity>
        </View>

        {/* Right/Sidebar Section */}
        <View className="w-full md:w-[350px] flex-shrink-0 mt-8">
          <View className=" rounded-2xl  p-6 mb-6">
            <Text className="text-2xl font-bold text-[#23235F] mb-1">
              {course.price}
            </Text>
            <Text className="text-base text-gray-400 line-through mb-2">
              {course.oldPrice}
            </Text>
            <TouchableOpacity className="bg-[#2D7FF9] py-3 rounded-xl mb-3">
              <Text className="text-white text-center font-bold text-base">
                Enroll Now
              </Text>
            </TouchableOpacity>
            <View className="mb-3">
              {course.features.map((feature, idx) => (
                <Text key={idx} className="text-[#23235F] text-sm mb-1">
                  • {feature}
                </Text>
              ))}
            </View>
          </View>
          {/* Progress */}
          <View className=" rounded-2xl  p-6 mb-6">
            <Text className="font-bold text-[#23235F] mb-2">
              Your Learning Progress
            </Text>
            <View className="flex-row items-center mb-2">
              <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                <View
                  className="h-2 bg-[#2D7FF9] rounded-full"
                  style={{ width: `${course.progress}%` }}
                />
              </View>
              <Text className="text-xs text-[#23235F]">{course.progress}%</Text>
            </View>
            <TouchableOpacity className="bg-[#2DC97A] py-2 rounded-xl">
              <Text className="text-white text-center font-semibold text-sm">
                Start Learning
              </Text>
            </TouchableOpacity>
          </View>
          {/* Recommended Path */}
          <View className=" rounded-2xl  p-6">
            <Text className="font-bold text-[#23235F] mb-2">
              Recommended Path
            </Text>
            {course.recommendedPath.map((item, idx) => (
              <Text
                key={idx}
                className={`text-sm mb-1 ${
                  item.active ? "text-[#2D7FF9] font-bold" : "text-gray-500"
                }`}
              >
                {item.label}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
