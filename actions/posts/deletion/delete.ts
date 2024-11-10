import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface DeletePostProps {
  postId: string;
  createdBy: string;
  imageUrl: string;
  router:AppRouterInstance
}

export const deletePost = async ({
  postId,
  createdBy,
  imageUrl,
  router
}: DeletePostProps) => {
  try {
    const response = await axios.delete(`/api/posts/deletion/delete`, {
      data: {
        postId,
        createdBy,
      },
    });
    if (response.status < 300) {
      await axios.delete(`api/uploadthing`, {
        data: {
          url: imageUrl,
        },
      });
      router.refresh();
      return response.data.message;
    }
    return response.data.message;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Server response error:", error.response.data.message);
      return error.response.data.message;
    }
    console.error("Error following:", error);
  }
};
