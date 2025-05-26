import {
  Course,
  HomeInfo,
  Lesson,
  StrapiUser,
  UserCourses,
} from "@/types/interfaces";
import { useUser } from "@clerk/clerk-expo";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useContext } from "react";

// Define the context type
interface StrapiContextType {
  createUser: (user: StrapiUser) => Promise<StrapiUser>;
  getHomeInfo: () => Promise<HomeInfo>;
  getCourses: () => Promise<Course[]>;
  getCourse: (slug: string) => Promise<Course>;
  getLessonsForCourse: (slug: string) => Promise<Lesson[]>;
  getLessonForCourse: (slug: string, lessonIndex: number) => Promise<Lesson>;
  getUserCourses: () => Promise<UserCourses[]>;
  addUserToCourse: (courseId: string) => Promise<UserCourses>;
  userHasCourse: (courseId: string) => Promise<boolean>;
  markLessonAsCompleted: (
    lessonId: string,
    courseId: string,
    progress: number,
    nextLessonIndex?: number
  ) => Promise<void>;
  getUserCompletedLessons: () => Promise<number>;
}

const StrapiContext = createContext<StrapiContextType | undefined>(undefined);

export function StrapiProvider({ children }: { children: ReactNode }) {
  const baseUrl =
    process.env.EXPO_PUBLIC_STRAPI_API_URL || "http://192.168.31.180:1337";
  console.log("[StrapiProvider] Using baseUrl:", baseUrl);
  const { user } = useUser();
  const queryClient = useQueryClient();

  const createUser = async (user: StrapiUser): Promise<StrapiUser> => {
    try {
      const response = await fetch(`${baseUrl}/api/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  const getCourses = async (): Promise<Course[]> => {
    try {
      const response = await fetch(`${baseUrl}/api/courses?populate=image`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      result.data = result.data.map((item: any) => ({
        ...item,
        image: `${item.image.url}`,
      }));

      return result.data;
    } catch (error) {
      console.error("Error fetching data from Strapi:", error);
      throw error;
    }
  };

  const getCourse = async (slug: string): Promise<Course> => {
    try {
      const response = await fetch(
        `${baseUrl}/api/courses?filters[slug][$eq]=${slug}&populate=*`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      result.data[0] = {
        ...result.data[0],
        image: `${result.data[0].image.url}`,
      };
      return result.data[0];
    } catch (error) {
      console.error("Error fetching course:", error);
      throw error;
    }
  };

  const getLessonsForCourse = async (slug: string): Promise<Lesson[]> => {
    try {
      const response = await fetch(
        `${baseUrl}/api/lessons?filters[course][slug][$eq]=${slug}&sort=lesson_index`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      const completedLessons = await getUserCompletedLessonsForCourse(slug);

      result.data.forEach((lesson: any) => {
        lesson.completed = completedLessons.includes(lesson.documentId);
      });

      return result.data;
    } catch (error) {
      console.error("Error fetching lessons for course:", error);
      throw error;
    }
  };

  const getLessonForCourse = async (
    slug: string,
    lessonIndex: number
  ): Promise<Lesson> => {
    try {
      const response = await fetch(
        `${baseUrl}/api/lessons?filters[course][slug][$eq]=${slug}&filters[lesson_index][$eq]=${lessonIndex}&populate=*`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      result.data[0].video = `${result.data[0].video.url}`;
      return result.data[0];
    } catch (error) {
      console.error("Error fetching lessons for course:", error);
      throw error;
    }
  };

  const getUserCompletedLessonsForCourse = async (
    slug: string
  ): Promise<Lesson[]> => {
    try {
      const response = await fetch(
        `${baseUrl}/api/progresses?filters[course][slug][$eq]=${slug}&filters[clerkId][$eq]=${user?.id}&populate=lesson`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data.map((item: any) => item.lesson.documentId);
    } catch (error) {
      console.error("Error fetching user completed lessons for course:", error);
      throw error;
    }
  };

  const getHomeInfo = async (): Promise<HomeInfo> => {
    try {
      const response = await fetch(`${baseUrl}/api/home?populate=*`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      result.data = {
        ...result.data,
        image: `${result.data.image.url}`,
      };
      return result.data;
    } catch (error) {
      throw error;
    }
  };

  const addUserToCourse = async (courseId: string): Promise<UserCourses> => {
    console.log("Current user in StrapiProvider:", user);
    if (!user || !user.id) {
      console.error("[addUserToCourse] No user or user.id found! User:", user);
      throw new Error("User not authenticated or missing user id.");
    }
    try {
      const body = {
        data: {
          course: Number(courseId), // relation to Course (should be numeric id)
          clerkId: user.id,
          finished_percentage: 0,
          next_lesson_index: "",
        },
      };
      const url = `${baseUrl}/api/user-courses`;
      console.log("[addUserToCourse] POST URL:", url);
      console.log("[addUserToCourse] POST BODY:", JSON.stringify(body));
      // Log device IP for debugging
      try {
        console.log(
          "[addUserToCourse] Device IP:",
          (await (await fetch("https://api.ipify.org?format=json")).json()).ip
        );
      } catch (e) {
        console.log("[addUserToCourse] Could not fetch device IP");
      }
      console.log(
        "[addUserToCourse] FINAL POST BODY SENT TO STRAPI:",
        JSON.stringify(body, null, 2)
      );
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      console.log("[addUserToCourse] Response status:", response.status);
      const responseText = await response.text();
      console.log("[addUserToCourse] Raw response text:", responseText);
      if (!response.ok) {
        console.error("[addUserToCourse] Error response:", responseText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = JSON.parse(responseText);
      console.log("[addUserToCourse] Parsed response:", result);
      queryClient.invalidateQueries({ queryKey: ["userCourses"] });
      return result;
    } catch (error) {
      console.error("[addUserToCourse] Network or logic error:", error);
      console.error("[addUserToCourse] Troubleshooting tips: ");
      console.error(
        "- Is your Strapi server running and accessible at the LAN IP from your device?"
      );
      console.error(
        "- Is your device/emulator on the same WiFi network as your server?"
      );
      console.error(
        "- Is your Strapi CORS config set to allow requests from your app?"
      );
      console.error(
        "- Are you using the correct course id (should be a Strapi numeric id, not a UID)?"
      );
      console.error(
        "- Try opening the URL in your device's browser to check connectivity."
      );
      throw error;
    }
  };

  const getUserCourses = async (): Promise<UserCourses[]> => {
    try {
      // Deep populate course.image for enrolled courses
      const url = `${baseUrl}/api/user-courses?filters[clerkId]=${user?.id}&populate[course][populate][image][populate]=*`;
      const response = await fetch(encodeURI(url));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      throw error;
    }
  };

  const userHasCourse = async (courseId: string): Promise<boolean> => {
    const userCourses = await getUserCourses();
    return userCourses.some((course) => course.course.documentId === courseId);
  };

  const markLessonAsCompleted = async (
    lessonId: string,
    courseId: string,
    progress: number,
    nextLessonIndex?: number
  ) => {
    try {
      const response = await fetch(`${baseUrl}/api/progresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            lesson: lessonId,
            course: courseId,
            clerkId: user?.id,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Also update user-course with progress and lesson_index
      const userCourse = await getUserCourses();
      const userCourseToUpdate = userCourse.find(
        (course) => course.course.documentId === courseId
      );
      if (userCourseToUpdate) {
        updateUserCourseProgress(
          userCourseToUpdate.documentId,
          progress,
          nextLessonIndex
        );
      }
      queryClient.invalidateQueries({ queryKey: ["userCourses"] });

      return response.json();
    } catch (error) {
      throw error;
    }
  };

  const updateUserCourseProgress = async (
    courseId: string,
    progress: number,
    nextLessonIndex?: number
  ) => {
    try {
      const response = await fetch(`${baseUrl}/api/user-courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            finished_percentage: progress,
            next_lesson_index: `${nextLessonIndex}`,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  };

  const getUserCompletedLessons = async (): Promise<number> => {
    try {
      const response = await fetch(
        `${baseUrl}/api/progresses?filters[clerkId]=${user?.id}&populate=lesson`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Filter out duplicate lessons by documentId
      const lessonIds = data.data.map((item: any) => item.lesson.documentId);
      const uniqueLessonIds = [...new Set(lessonIds)];
      return uniqueLessonIds.length;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    createUser,
    getCourses,
    getLessonsForCourse,
    getLessonForCourse,
    getHomeInfo,
    getUserCourses,
    addUserToCourse,
    getCourse,
    userHasCourse,
    markLessonAsCompleted,
    getUserCompletedLessons,
  };

  return (
    <StrapiContext.Provider value={value}>{children}</StrapiContext.Provider>
  );
}

// Custom hook to use the Strapi context
export function useStrapi() {
  const context = useContext(StrapiContext);
  if (context === undefined) {
    throw new Error("useStrapi must be used within a StrapiProvider");
  }
  return context;
}
