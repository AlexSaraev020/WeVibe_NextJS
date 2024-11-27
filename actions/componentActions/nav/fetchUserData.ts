import { getUser } from "@/actions/user/getUser";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface FetchUserWithTimeoutProps {
  setUserName: (userName: string) => void;
  setUserId: (userId: string) => void;
  setUserImage: (userImage: string) => void;
  paths: string[];
  path: string;
  router: AppRouterInstance;
}

export const fetchUserWithTimeout = async ({
  setUserName,
  setUserId,
  setUserImage,
  paths,
  path,
  router,
}: FetchUserWithTimeoutProps) => {
  if(!paths.includes(path)) {
    const fetchUser = async () => {
      const response = await getUser();
      if (response.status >= 400 && !paths.includes(path)) {
        router.push("/");
      }
      return response.user;
    };
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 3000)
    );
    try {
      const result = await Promise.race([fetchUser(), timeout]);
      setUserName(result.username);
      setUserId(result._id);
      setUserImage(result.image);
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
  }else{
    setUserName("");
    setUserId("");
    setUserImage("");
  }
};
