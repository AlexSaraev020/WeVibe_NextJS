import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface UpdateProfileProps {
  username: string;
  bio: string;
  image: string | null;
  currentImage: string;
  router: AppRouterInstance;
  setEdit: (edit: boolean) => void;
  setMessage: (message: string | undefined) => void;
  setShowAlert: (showAlert: boolean) => void;
}
export const updateProfile = async ({
  setMessage,
  username,
  setShowAlert,
  bio,
  image,
  currentImage,
  router,
  setEdit,
}: UpdateProfileProps) => {
  try {
    const response = await axios.put("/api/user/update/profile", {
      username,
      bio,
      image,
    });
    if(response.status < 300) {
      setMessage(response.data.message);
      setShowAlert(true);
    }
    if (
      response.data.imageUpdated === true &&
      currentImage !==
        "https://utfs.io/f/0Ow274erzkuprXsskPX5iHvEWP0IfbBAOy328zVgFMk5Lcxe"
    ) {
      await axios.delete(`api/uploadthing`, {
        data: {
          url: currentImage,
        },
      });
      router.refresh();
      setMessage(undefined);
      return response.data;
    }
    router.refresh();
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Server response error:", error.response.data.message);
      setMessage(error.response.data.message);
      return error.response.data.message;
    }
    console.error("Error following:", error);
  }
};
