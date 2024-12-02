import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface FollowUserProps {
  query: string;
  router: AppRouterInstance;
}

export const followUser = async ({ query, router }: FollowUserProps) => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await axios.post(`/api/user/profile/follow`, { query });
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
