import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import GlobalHeader from "../components/GlobalHeader";
import { useStrapi } from "../providers/StrapiProvider";

type Course = {
  id: number;
  documentId?: string; // <-- add this line
  title: string;
  description?: string;
  subtitle?: string;
  price?: string;
  oldPrice?: string;
  category?: string;
  bestseller?: boolean;
  headerImage?: any;
  instructor?: {
    name: string;
    avatar?: string;
    title?: string;
    rating?: number;
    students?: string;
    courses?: number;
    reviews?: number;
    bio?: string;
  };
  rating?: number;
  ratingCount?: string;
  students?: string;
  lastUpdated?: string;
  whatYouWillLearn?: string[];
  features?: string[];
  progress?: number;
  recommendedPath?: { label: string; active: boolean }[];
  feedback?: {
    name: string;
    avatar: string;
    rating: number;
    comment: string;
  }[];
  reviewsBreakdown?: { stars: number; percent: number }[];
  lessons?: any[]; // Added lessons property
};

const fallbackCourse: Course = {
  id: 0,
  title: "The Complete AI Guide: Learn ChatGPT, Generative AI & More",
  subtitle:
    "Master the fundamentals and advanced concepts of AI, including practical applications with ChatGPT, machine learning models, and real-world AI solutions.",
  price: "₹89.99",
  oldPrice: "₹199.99",
  category: "Machine Learning",
  bestseller: true,
  headerImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
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

// Helper to render course description safely
function renderCourseDescription(course: Course) {
  if (typeof course.description === "string" && course.description.trim()) {
    return (
      <Text className="text-base text-gray-700 mb-4">{course.description}</Text>
    );
  } else if (
    Array.isArray(course.description) &&
    course.description.length > 0
  ) {
    return course.description.map((para: any, idx: number) => (
      <Text key={idx} className="text-base text-gray-700 mb-2">
        {para?.children?.map((child: any) => child.text).join(" ")}
      </Text>
    ));
  } else if (
    course.description &&
    typeof course.description === "object" &&
    (course.description as any).text
  ) {
    return (
      <Text className="text-base text-gray-700 mb-4">
        {(course.description as any).text}
      </Text>
    );
  } else if (
    course.description &&
    typeof course.description === "object" &&
    Array.isArray((course.description as any).children)
  ) {
    return (course.description as any).children.map(
      (child: any, idx: number) => (
        <Text key={idx} className="text-base text-gray-700 mb-2">
          {child.text}
        </Text>
      )
    );
  }
  return (
    <Text className="text-base text-gray-500 mb-4 italic">
      No description available.
    </Text>
  );
}

export default function SingleCourseUI() {
  const { slug } = useLocalSearchParams();
  const [course, setCourse] = useState<Course>(fallbackCourse);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(0);
  const [enrolling, setEnrolling] = useState(false); // loading state for post-payment
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false); // <-- new state
  const { width } = useWindowDimensions();
  const isMobile = width < 800;
  const router = useRouter();
  const { addUserToCourse, userHasCourse } = useStrapi(); // <-- get userHasCourse

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    axios
      .get(
        `http://192.168.31.180:1337/api/courses?filters[slug][$eq]=${slug}&populate=headerImage`
      )
      .then((res) => {
        const apiData = res.data?.data?.[0];
        if (!apiData) {
          setCourse(fallbackCourse);
          setLoading(false);
          return;
        }
        // Fetch lessons linked to this course
        axios
          .get(
            `http://192.168.31.180:1337/api/lessons?filters[course][id][$eq]=${apiData.id}`
          )
          .then((lessonsRes) => {
            const lessons = lessonsRes.data?.data || [];
            setCourse({
              ...fallbackCourse,
              ...apiData,
              documentId: apiData.documentId || apiData.id?.toString() || "", // ensure documentId is set
              lessons,
              title: apiData.title || fallbackCourse.title,
              description: apiData.description || fallbackCourse.description,
              headerImage: apiData.headerImage?.url
                ? apiData.headerImage.url.startsWith("http")
                  ? apiData.headerImage.url
                  : `http://192.168.31.180:1337${apiData.headerImage.url}`
                : fallbackCourse.headerImage,
              price: apiData.price || fallbackCourse.price,
              instructor: {
                ...fallbackCourse.instructor,
                ...apiData.instructor,
                avatar:
                  apiData.instructor?.avatar ||
                  fallbackCourse.instructor?.avatar,
              },
              whatYouWillLearn:
                apiData.whatYouWillLearn || fallbackCourse.whatYouWillLearn,
              features: apiData.features || fallbackCourse.features,
              recommendedPath:
                apiData.recommendedPath || fallbackCourse.recommendedPath,
              feedback: apiData.feedback || fallbackCourse.feedback,
              reviewsBreakdown:
                apiData.reviewsBreakdown || fallbackCourse.reviewsBreakdown,
              progress: apiData.progress ?? fallbackCourse.progress,
              lastUpdated: apiData.updatedAt
                ? new Date(apiData.updatedAt).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })
                : fallbackCourse.lastUpdated,
            });
            // Check if user is already enrolled
            const courseId = apiData.documentId || apiData.id?.toString() || "";
            if (courseId) {
              userHasCourse(courseId)
                .then((enrolled) => setAlreadyEnrolled(enrolled))
                .catch(() => setAlreadyEnrolled(false));
            } else {
              setAlreadyEnrolled(false);
            }
          })
          .catch(() => {
            setCourse({
              ...fallbackCourse,
              ...apiData,
              lessons: [],
            });
            setAlreadyEnrolled(false);
          })
          .finally(() => setLoading(false));
      })
      .catch(() => {
        setCourse(fallbackCourse);
        setLoading(false);
        setAlreadyEnrolled(false);
      });
  }, [slug, userHasCourse]);

  useEffect(() => {
    if (course && course.title) {
      if (typeof document !== "undefined") {
        document.title = course.title;
      }
    }
  }, [course.title]);

  const handleEnroll = async () => {
    // Check if course is premium (adjust logic as needed)
    const isPremium =
      course.price && course.price !== "Free" && course.price !== "0";
    if (!isPremium) {
      // Handle free enrollment logic here
      return;
    }

    // Platform check: if web, skip payment and enroll directly
    if (!isMobile) {
      try {
        setEnrolling(true);
        const courseId = course.id.toString(); // Always use numeric id as string
        await addUserToCourse(courseId);
        setEnrolling(false);
        router.replace("/dashboard");
      } catch (err) {
        setEnrolling(false);
        alert("Enrollment failed. Please contact support.");
        console.error("Enrollment error on web:", err);
      }
      return;
    }

    // Mobile: open Razorpay payment gateway
    let priceNumber = 0;
    if (typeof course.price === "number") {
      priceNumber = course.price;
    } else if (typeof course.price === "string") {
      priceNumber = parseFloat(course.price.replace(/[^\d.]/g, ""));
    }

    const options = {
      description: "Course Payment",
      image: course.headerImage,
      currency: "INR",
      key: "rzp_test_tCFIza9ek4XgQY", // Replace with your Razorpay Test Key
      amount: Math.round(priceNumber * 100), // Amount in paise
      name: course.title,
      prefill: {
        email: "user@example.com", // Optionally replace with user's email
        contact: "9876543210", // Optionally replace with user's contact
        name: "User Name", // Optionally replace with user's name
      },
      theme: { color: "#23235F" },
    };
    RazorpayCheckout.open(options)
      .then(async (data: any) => {
        try {
          setEnrolling(true);
          // Add user to course in Strapi
          const courseId = course.id.toString(); // Always use numeric id as string
          await addUserToCourse(courseId);
          setEnrolling(false);
          alert("Enrollment successful! Redirecting to dashboard...");
          // Redirect to dashboard
          router.replace("/dashboard");
        } catch (err) {
          setEnrolling(false);
          alert(
            "Payment succeeded but enrollment failed. Please contact support."
          );
          console.error("Enrollment error after payment:", err);
        }
      })
      .catch((error: any) => {
        setEnrolling(false);
        console.log("Razorpay Error:", error);
        alert(`Error: ${error?.description ?? JSON.stringify(error)}`);
      });
  };

  // Helper to format seconds/minutes
  const formatTime = (secondsOrString: any) => {
    if (!secondsOrString) return "";
    if (typeof secondsOrString === "string") return secondsOrString;
    const min = Math.floor(secondsOrString / 60);
    const sec = secondsOrString % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  // Only one section for now, as course.sections is not present
  const sections = [
    {
      title: course.title + " Content",
      lessons: course.lessons,
      lectureCount: course.lessons?.length || 0,
      totalTime: (course.lessons || []).reduce(
        (acc, l) => acc + (l.duration || 0),
        0
      ),
    },
  ];

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f7f9fa]">
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <ScrollView
      className="bg-[#f7f9fa] flex-1"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <GlobalHeader />
      {/* Main Content */}
      <View className="container-fluid mx-auto w-full flex flex-col gap-6 px-2 mt-4 items-start min-h-screen md:px-[80px]">
        {/* Header with image, then description and pricing in two columns */}
        <View className="w-full rounded-b-2xl">
          <View className="container-fluid px-0">
            <Image
              source={{ uri: course.headerImage }}
              className="w-full h-56 rounded-b-2xl object-cover"
              resizeMode="cover"
            />
          </View>
          {/* Two-column layout for description and pricing */}
          <View className="flex flex-col md:flex-row w-full gap-4 mt-4 mb-2">
            {/* Description column */}
            <View className="w-full md:w-9/12">
              <Text className="text-2xl font-bold mb-2 text-[#23235F]">
                {course.title}
              </Text>
              {renderCourseDescription(course)}
            </View>
            {/* Pricing column */}
            <View className="w-full md:w-3/12">
              <View className="rounded-2xl p-6 mb-6 bg-white shadow mt-2 w-full">
                <Text className="text-2xl font-bold text-[#23235F] mb-1">
                  ₹{course.price}
                </Text>
                <Text className="text-base text-gray-400 line-through mb-2">
                  {course.oldPrice}
                </Text>
                <TouchableOpacity
                  className={`bg-[#2D7FF9] py-3 rounded-xl mb-3 w-full ${
                    alreadyEnrolled ? "opacity-60" : ""
                  }`}
                  onPress={handleEnroll}
                  disabled={enrolling || alreadyEnrolled}
                >
                  <Text className="text-white text-center font-bold text-base">
                    {alreadyEnrolled
                      ? "Already Enrolled"
                      : enrolling
                      ? "Enrolling..."
                      : "Enroll Now"}
                  </Text>
                </TouchableOpacity>
                <View className="mb-3">
                  {(course.features || []).map((feature, idx) => (
                    <Text key={idx} className="text-[#23235F] text-sm mb-1">
                      • {feature}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* Pricing and Enroll button for mobile only, nothing for desktop */}
        {/* Left/Main Section (lessons, etc) */}
        <View className="flex-1 rounded-2xl p-6 mt-8">
          <View className="flex flex-row items-center mb-4 gap-2 flex-wrap">
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

          {/* Lessons Section (Accordion style like Udemy) */}
          {Array.isArray(course.lessons) && course.lessons.length > 0 && (
            <View className="mt-6">
              <Text className="font-bold text-lg mb-4 text-[#23235F]">
                Course content
              </Text>
              {/* Section summary (replace with real data if available) */}
              <Text className="text-base text-gray-500 mb-4">
                {/* Example: 1 section • 83 lectures • 5h 56m total length */}1
                section • {course.lessons.length} lectures
              </Text>
              {/* Collapsible Sections */}
              <View className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
                {sections.map((section: any, sIdx: number) => (
                  <View key={sIdx}>
                    <Pressable
                      className="flex flex-row items-center justify-between px-4 py-3 border-b border-gray-100 bg-[#f7f9fa]"
                      onPress={() =>
                        setExpanded(expanded === sIdx ? null : sIdx)
                      }
                    >
                      <Text className="font-semibold text-base text-[#23235F]">
                        {section.title}
                      </Text>
                      <Text className="text-xs text-gray-500 ml-2">
                        {section.lectureCount} lectures
                        {section.totalTime
                          ? ` • ${formatTime(section.totalTime)}`
                          : ""}
                      </Text>
                      <Text className="ml-2 text-[#2D7FF9] font-bold">
                        {expanded === sIdx ? "▲" : "▼"}
                      </Text>
                    </Pressable>
                    {expanded === sIdx && (
                      <View className="bg-white">
                        {section.lessons.map((lesson: any, lIdx: number) => (
                          <Pressable
                            key={lesson.id || lIdx}
                            className="flex flex-row items-center px-6 py-2 border-b border-gray-100"
                            onPress={() => {
                              if (lesson.slug) {
                                router.push(`/courses/lessons/${lesson.slug}`);
                              } else {
                                router.push(`/courses/lessons/${lesson.id}`);
                              }
                            }}
                          >
                            {/* Icon: video or file */}
                            <Text className="mr-3 text-lg">
                              {lesson.type === "pdf" || lesson.isDocument
                                ? "📄"
                                : "🎬"}
                            </Text>
                            <Text className="flex-1 text-base text-[#23235F]">
                              {lesson.name ||
                                lesson.title ||
                                `Lesson ${lIdx + 1}`}
                            </Text>
                            <Text className="text-xs text-gray-500 ml-2">
                              {lesson.pages
                                ? `${lesson.pages} pages`
                                : formatTime(lesson.duration)}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
