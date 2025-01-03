"use client";
import React, { useEffect, useRef } from "react";
import { ImageKitProvider, IKImage, IKUpload } from "imagekitio-next";
import axios from "axios";
import { IoCloudUploadOutline } from "react-icons/io5";
import {
  IKUploadResponse,
  UploadError,
} from "imagekitio-next/dist/types/components/IKUpload/props";
import { ImageType } from "@/types/image/imageType";
import { twMerge } from "tailwind-merge";

interface UploadProps {
  setImage: React.Dispatch<React.SetStateAction<ImageType | undefined>>;
  setDisable?: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage: (message: string | undefined) => void;
  setError?: (error: boolean) => void;
  image: ImageType | undefined;
  profile?: boolean;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
}
export default function Upload(props: UploadProps) {
  const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY!;
  const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;
  const imageUploadRef = useRef<HTMLInputElement>(null);

  const authenticator = async () => {
    try {
      const response = await axios.get("/api/auth/uploadImageAuth");

      if (response.status >= 400) {
        throw new Error(response.data.message);
      }

      const { signature, expire, token } = response.data;
      return { signature, expire, token };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        console.log("Server response error:", error.response.data.message);
        return error.response.data.message;
      }
      console.error("Error following:", error);
    }
  };
  const handleSuccess = async (res: IKUploadResponse) => {
    props.setImage(res);
    props.setDisable && props.setDisable(false);
  };
  const handleError = (error: UploadError) => {
    props.setMessage(error.message);
  };

  const validateAndResetFile = (file: File) => {
    const isValid = file.size < 2000000;
    if (!isValid) {
      props.setMessage("File is too large (max 2MB)");
      props.setError && props.setError(true);
      if (imageUploadRef.current) {
        imageUploadRef.current.value = "";
      }
    }
    return isValid;
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        useUniqueFileName
        accept="image/*"
        onUploadProgress={(evt) => {
          const percent = Math.floor((evt.loaded / evt.total) * 100);
          props.setProgress(percent);
        }}
        onSuccess={handleSuccess}
        onError={handleError}
        style={{ display: "none" }}
        ref={imageUploadRef}
        validateFile={validateAndResetFile}
      />
      <div
        onClick={() => imageUploadRef.current?.click()}
        className={twMerge(
          "flex cursor-pointer items-center justify-center transition-all duration-500 hover:scale-105 md:h-80",
          props.profile
            ? "absolute z-50 h-20 w-20 rounded-full md:h-40 md:w-40"
            : "h-40 md:h-80",
        )}
      >
        {props.profile ? (
          <IoCloudUploadOutline className="hidden" />
        ) : (
          <IoCloudUploadOutline className="h-6 w-6 md:h-10 md:w-10" />
        )}
      </div>
    </ImageKitProvider>
  );
}
