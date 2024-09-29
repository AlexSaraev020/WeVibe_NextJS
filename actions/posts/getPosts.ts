import axios from "axios";

export const getPosts = async () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await axios.get(`${url}/api/posts/get`);
    if (response.status < 300) {
      return response.data.posts;
    }
    return [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};
