import { useStrapi } from "@/providers/StrapiProvider";
import { UserCourses } from "@/types/interfaces";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
  const { getUserCourses } = useStrapi();
  const [enrolledCourses, setEnrolledCourses] = useState<UserCourses[]>([]);
  const [loadingEnrolled, setLoadingEnrolled] = useState(true);
  const [selectedSection, setSelectedSection] = useState<"home" | "enrolled">(
    "home"
  );
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  useEffect(() => {
    if (selectedSection === "enrolled") {
      setLoadingEnrolled(true);
      getUserCourses()
        .then((courses) => setEnrolledCourses(courses))
        .catch(() => setEnrolledCourses([]))
        .finally(() => setLoadingEnrolled(false));
    }
  }, [selectedSection]);

  return (
    <View className="flex-1 flex-col md:flex-row bg-[#f6fbff]">
      {/* Sidebar */}
      <View className="hidden md:flex w-64 bg-white h-full shadow-lg px-4 py-6">
        {/* Logo and Title */}
        <View className="flex-row items-center mb-8">
          <Image
            source={require("@/assets/images/logo-edu.png")}
            style={{ width: 100, height: 60 }}
            resizeMode="contain"
          />
        </View>
        {/* Sidebar Menu */}
        <View className="space-y-2">
          <TouchableOpacity
            className={`flex-row items-center rounded-lg px-3 py-2 ${
              selectedSection === "home" ? "bg-[#e3f0fa]" : ""
            }`}
            onPress={() => setSelectedSection("home")}
          >
            <Ionicons
              name="home-outline"
              size={20}
              color={selectedSection === "home" ? "#2D7FF9" : "#222"}
            />
            <Text
              className={`ml-3 text-base font-semibold ${
                selectedSection === "home" ? "text-[#2D7FF9]" : "text-[#222]"
              }`}
            >
              Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center px-3 py-2">
            <Feather name="compass" size={20} color="#222" />
            <Text className="ml-3 text-base text-[#222]">Explore Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-row items-center rounded-lg px-3 py-2 ${
              selectedSection === "enrolled" ? "bg-[#e3f0fa]" : ""
            }`}
            onPress={() => setSelectedSection("enrolled")}
          >
            <Ionicons
              name="book-outline"
              size={20}
              color={selectedSection === "enrolled" ? "#2D7FF9" : "#222"}
            />
            <Text
              className={`ml-3 text-base font-semibold ${
                selectedSection === "enrolled"
                  ? "text-[#2D7FF9]"
                  : "text-[#222]"
              }`}
            >
              Enrolled Courses
            </Text>
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

      {/* Profile section top right (desktop only) */}
      <View className="hidden md:flex absolute right-12 top-8 z-50 flex-row items-center">
        <Pressable
          className="flex-row items-center px-2 py-1 rounded-lg bg-white shadow border border-gray-100"
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
            {user?.fullName || user?.username || user?.firstName || "User"}
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
              <Text className="ml-2 text-[#EF4444] font-semibold">Logout</Text>
            </TouchableOpacity>
          </View>
        )}
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
        {/* Only show Enrolled Courses OR Home, never both */}
        {selectedSection === "enrolled" ? (
          <View className="mb-10">
            <Text className="text-2xl font-bold mb-6 text-[#2D7FF9] px-2 md:px-12 text-center">
              Enrolled Courses
            </Text>
            {loadingEnrolled ? (
              <View className="items-center justify-center py-10">
                <ActivityIndicator size="large" />
              </View>
            ) : enrolledCourses.length === 0 ? (
              <Text className="text-center text-gray-500">
                You have not enrolled in any courses yet.
              </Text>
            ) : (
              <ScrollView
                horizontal={false}
                showsVerticalScrollIndicator={false}
              >
                <View className="flex-row flex-wrap justify-center gap-4">
                  {enrolledCourses.map((uc) => {
                    const course = uc.course;
                    // Robust image extraction logic (matches FeaturedCourses.tsx, with type guards)
                    let imgUrl: string | undefined = undefined;
                    // Strapi v4: image = { data: { attributes: { url, formats } } }
                    if (
                      course.image &&
                      typeof course.image === "object" &&
                      (course.image as any).data &&
                      (course.image as any).data.attributes
                    ) {
                      const attrs = (course.image as any).data.attributes;
                      if (
                        attrs.formats &&
                        attrs.formats.thumbnail &&
                        attrs.formats.thumbnail.url
                      ) {
                        imgUrl = attrs.formats.thumbnail.url.startsWith("http")
                          ? attrs.formats.thumbnail.url
                          : `http://192.168.31.180:1337${attrs.formats.thumbnail.url}`;
                      } else if (attrs.url) {
                        imgUrl = attrs.url.startsWith("http")
                          ? attrs.url
                          : `http://192.168.31.180:1337${attrs.url}`;
                      }
                    } else if (
                      course.image &&
                      typeof course.image === "object" &&
                      (course.image as any).formats &&
                      (course.image as any).formats.thumbnail?.url
                    ) {
                      // Legacy object format
                      imgUrl = `http://192.168.31.180:1337${
                        (course.image as any).formats.thumbnail.url
                      }`;
                    } else if (
                      course.image &&
                      typeof course.image === "object" &&
                      (course.image as any).url
                    ) {
                      imgUrl = (course.image as any).url.startsWith("http")
                        ? (course.image as any).url
                        : `http://192.168.31.180:1337${
                            (course.image as any).url
                          }`;
                    } else if (
                      typeof course.image === "string" &&
                      course.image.startsWith("http")
                    ) {
                      imgUrl = course.image;
                    } else if (
                      typeof course.image === "string" &&
                      course.image.length > 0
                    ) {
                      imgUrl = `http://192.168.31.180:1337${course.image}`;
                    }
                    // Fallback/default image if none present
                    if (!imgUrl) {
                      imgUrl =
                        "https://images.unsplash.com/photo-1506744038136-46273834b3fb"; // fallback image
                    }
                    // Debug: log the resolved image URL and course.image
                    console.log("[ENROLLED COURSE IMAGE]", {
                      imgUrl,
                      courseImage: course.image,
                      courseTitle: course.title,
                      fullCourse: course,
                    });
                    // Fallbacks for category/price
                    const category = (course as any).category || "";
                    const price = (course as any).price || "";
                    return (
                      <TouchableOpacity
                        key={uc.id}
                        activeOpacity={0.9}
                        onPress={() =>
                          router.push({
                            pathname: "/courses/[slug]",
                            params: { slug: course.slug },
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
                          {category ? (
                            <View className="absolute left-3 top-3 bg-[#23235F] px-3 py-1 rounded-lg">
                              <Text className="text-xs text-white font-semibold">
                                {category.toUpperCase()}
                              </Text>
                            </View>
                          ) : null}
                        </View>
                        {/* Card Content */}
                        <View className="px-4 pt-4 pb-2">
                          <Text className="text-[#23235F] font-bold text-lg mb-2">
                            {course.title}
                          </Text>
                          <Text className="text-[#B9B9B9] text-xs mb-2">
                            Progress: {uc.finished_percentage || 0}%
                          </Text>
                          <View className="flex-row items-center justify-between bg-[#F7F7FB] rounded-lg px-3 py-2 mb-4">
                            <Text className="text-[#23235F] text-xs">
                              {course.lessons?.length || 0} Lessons
                            </Text>
                            <Text className="text-[#23235F] text-xs">
                              {price ? `₹${price}` : "Free"}
                            </Text>
                          </View>
                          <TouchableOpacity
                            className="bg-[#23235F] rounded-full px-6 py-2 mt-2"
                            onPress={() =>
                              router.push({
                                pathname: "/courses/[slug]",
                                params: { slug: course.slug },
                              })
                            }
                          >
                            <Text className="text-white font-semibold text-sm">
                              Continue →
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            )}
          </View>
        ) : (
          <>
            {/* Dashboard Home content (stats, continue learning, etc) goes here. Remove Enrolled Courses from here. */}
            <View className="mb-10">
              <Text className="text-2xl font-bold mb-6 text-[#2D7FF9] px-2 md:px-12 text-center">
                {`Welcome to your Dashboard${
                  user?.fullName ? ", " + user.fullName : ""
                }`}
              </Text>
              <View className="flex flex-row flex-wrap justify-center gap-8 mb-8">
                <View className="bg-white rounded-2xl shadow p-6 min-w-[180px] max-w-[260px] flex-1 items-center">
                  <Text className="text-3xl font-bold text-[#2D7FF9] mb-2">
                    🎓
                  </Text>
                  <Text className="text-lg font-semibold text-[#23235F]">
                    Courses Enrolled
                  </Text>
                  <Text className="text-2xl font-bold text-[#23235F] mt-2">
                    {enrolledCourses.length}
                  </Text>
                </View>
                <View className="bg-white rounded-2xl shadow p-6 min-w-[180px] max-w-[260px] flex-1 items-center">
                  <Text className="text-3xl font-bold text-[#2DC97A] mb-2">
                    ⏳
                  </Text>
                  <Text className="text-lg font-semibold text-[#23235F]">
                    Continue Learning
                  </Text>
                  <Text className="text-base text-[#23235F] mt-2">
                    Pick up where you left off!
                  </Text>
                </View>
              </View>
              {/* Continue Learning Card (show first enrolled course if any) */}
              {enrolledCourses.length > 0 && (
                <View className="bg-[#e3f0fa] rounded-2xl p-6 flex-row items-center gap-6 max-w-[700px] mx-auto">
                  {/* Robust image extraction for continue learning card */}
                  {(() => {
                    const course = enrolledCourses[0].course;
                    let imgUrl: string | undefined = undefined;
                    if (
                      course.image &&
                      typeof course.image === "object" &&
                      course.image.url
                    ) {
                      imgUrl = course.image.url.startsWith("http")
                        ? course.image.url
                        : `http://192.168.31.180:1337${course.image.url}`;
                    } else if (
                      course.image &&
                      typeof course.image === "object" &&
                      course.image.formats?.thumbnail?.url
                    ) {
                      imgUrl = `http://192.168.31.180:1337${course.image.formats.thumbnail.url}`;
                    } else if (
                      typeof course.image === "string" &&
                      course.image.startsWith("http")
                    ) {
                      imgUrl = course.image;
                    } else if (
                      typeof course.image === "string" &&
                      course.image.length > 0
                    ) {
                      imgUrl = `http://192.168.31.180:1337${course.image}`;
                    } else {
                      imgUrl = undefined;
                    }
                    return (
                      <Image
                        source={
                          typeof imgUrl === "string" ? { uri: imgUrl } : imgUrl
                        }
                        className="w-24 h-24 rounded-xl bg-white border border-[#B9B9B9]"
                        resizeMode="cover"
                      />
                    );
                  })()}
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-[#23235F] mb-1">
                      {enrolledCourses[0].course?.title}
                    </Text>
                    <Text className="text-sm text-[#666] mb-2">
                      Progress: {enrolledCourses[0].finished_percentage || 0}%
                    </Text>
                    <TouchableOpacity
                      className="bg-[#2D7FF9] rounded-full px-6 py-2 self-start"
                      onPress={() =>
                        router.push({
                          pathname: "/courses/[slug]",
                          params: { slug: enrolledCourses[0].course?.slug },
                        })
                      }
                    >
                      <Text className="text-white font-semibold text-sm">
                        Continue Learning →
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
