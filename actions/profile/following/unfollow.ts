import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
interface UnfollowUserProps {
  query: string;
  router: AppRouterInstance;
}

export const unfollowUser = async ({ query,router }: UnfollowUserProps) => {
  try {
    const response = await axios.post(`/api/user/profile/unfollow`, { query });
    if (response.status < 300) {
      router.refresh();
      return response;
    }
    return;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error following:", error);
  }
};
