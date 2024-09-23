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
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
