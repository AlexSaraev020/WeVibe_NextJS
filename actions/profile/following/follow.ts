import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface FollowUserProps {
  query: string;
  router: AppRouterInstance;
}

export const followUser = async ({ query, router }: FollowUserProps) => {
  try {
    const response = await axios.post(`/api/user/profile/follow`, { query });
    if (response.status < 300) {
      router.refresh();
    }
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error following:", error);
  }
};
