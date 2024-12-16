import { getUser } from "@/actions/user/searchUser";
import { ImageType } from "@/types/image/imageType";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface FetchUserWithTimeoutProps {
  setUserId: (userId: string) => void;
  setUserImage: (userImage: ImageType) => void;
  setUsername: (username: string) => void;
  paths: string[];
  path: string;
  router: AppRouterInstance;
}

export const fetchUserWithTimeout = async ({
  setUserId,
  setUsername,
  setUserImage,
  paths,
  path,
  router,
}: FetchUserWithTimeoutProps) => {
  if (!paths.includes(path)) {
    const fetchUser = async () => {
      const response = await getUser();
      if (response.status >= 400 && !paths.includes(path)) {
        router.push("/");
      }
      return response.user;
    };
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 3000),
    );
    try {
      const result = await Promise.race([fetchUser(), timeout]);
      setUsername(result.username);
      setUserImage(result.image);
      setUserId(result._id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "Timeout") {
          console.log("Request timed out, reloading page...");
          window.location.reload();
        } else {
          console.log("Error fetching user:", error);
        }
      } else {
        console.log("Unknown error:", error);
      }
    }
  } else {
    setUserId("");
    setUserImage({} as ImageType);
    setUsername("");
  }
};
