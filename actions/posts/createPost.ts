import axios from "axios";

interface CreatePostProps {
  title: string | undefined;
  description: string | undefined;
  image: string | undefined;
}

export const createPost = async ({
  title,
  description,
  image,
}: CreatePostProps) => {
  try {
    const response = await axios.post("/api/posts/create", {
      title,
      description,
      image,
    });
    if (response.status < 300) {
      return response.data;
    }
    return null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating post:", error.message);
      return null;
    }
  }
};
