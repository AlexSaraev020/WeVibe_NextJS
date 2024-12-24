import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { deleteImage } from "./deleteImage";
import { ImageType } from "@/types/image/imageType";
import { PostType } from "@/types/post/postType";

interface DeletePostProps {
  postId: string;
  createdBy: string;
  image: ImageType;
  setPosts: (updatePosts: (prevPosts: PostType[]) => PostType[]) => void;
}

export const deletePost = async ({
  postId,
  createdBy,
  image,
  setPosts,
}: DeletePostProps) => {
  try {
    const response = await axios.delete(`/api/posts/deletion/delete`, {
      data: {
        postId,
        createdBy,
      },
    });
    setPosts((prev) => prev.filter((post) => post._id !== postId));
    if (response.status < 300) {
      await deleteImage(image);
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
