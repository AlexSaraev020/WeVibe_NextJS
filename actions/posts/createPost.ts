import axios from "axios";

interface CreatePostProps {
  title: string
  description: string
  image: string
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
    console.error("Error creating post:", error);
  }
};
