import axios from "axios";
import { set } from "mongoose";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface UpdateProfileProps {
  username: string;
  bio: string;
  image: string | null;
  currentImage: string;
  router: AppRouterInstance;
  setEdit: (edit: boolean) => void;
  setMessage: (message: string | undefined) => void;
  setUserImage: (userImage: string) => void;
  setUsername: (username: string) => void;
  setError: (error: boolean) => void;
}
export const updateProfile = async ({
  setMessage,
  setError,
  username,
  setUserImage,
  setUsername,
  bio,
  image,
  currentImage,
  router,
  setEdit,
}: UpdateProfileProps) => {
  try {
    const response = await axios.put("/api/user/profile/update/profile", {
      username,
      bio,
      image,
    });
    if (response.status < 300) {
      setError(false);
      setMessage(response.data.message);
      setEdit(false);
    }
    if (response.data.usernameUpdated === true) {
      setUsername(response.data.username);
    }
    if (
      response.data.imageUpdated === true &&
      currentImage !==
        "https://utfs.io/f/0Ow274erzkuprXsskPX5iHvEWP0IfbBAOy328zVgFMk5Lcxe"
    ) {
      setUserImage(response.data.image);
      await axios.delete(`api/uploadthing`, {
        data: {
          url: currentImage,
        },
      });

      router.push("/home");
      setMessage(response.data.message);
    }
    router.refresh();
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Server response error:", error.response.data.message);
      setMessage(error.response.data.message);
      setError(true);
      return error.response.data.message;
    }
    console.error("Error following:", error);
  }
};
