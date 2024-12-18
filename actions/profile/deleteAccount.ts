import axios from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { deleteImage } from "../posts/deletion/deleteImage";
import { ImageType } from "@/types/image/imageType";

interface DeleteAccountProps {
  searchedUserId: string;
  router: AppRouterInstance;
  setMessage: (message: string | undefined) => void;
  password: string;
}

export async function deleteAccount({
  searchedUserId,
  setMessage,
  password,
  router,
}: DeleteAccountProps) {
  try {
    const response = await axios.delete(
      `/api/user/profile/deleteAccount?user=${searchedUserId}`,
      {
        data: {
          password,
        },
      },
    );
    if (response.data.imagesToBeDeleted.length > 0) {
      response.data.imagesToBeDeleted.forEach((image: ImageType) => {
        deleteImage(image);
      });
    }
    if (response.status < 300) {
      setMessage(response.data.message);
      router.push("/");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      setMessage(error.response.data.message);
      return error.response.data.message;
    }
    console.error("Error following:", error);
  }
}
