import { ImageType } from "@/types/image/imageType";
import axios from "axios";

export const deleteImage = async (image: ImageType) => {
  try {
    if (image.fileId === "default") return;
    await axios.delete("/api/posts/deleteImage", {
      data: {
        fileId: image.fileId,
      },
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    console.error("Error following:", error);
  }
};
