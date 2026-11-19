"use client";
import React, { useRef, useState } from "react";
import { ImageKitProvider, IKUpload } from "imagekitio-next";
import axios from "axios";
import {
  IKUploadResponse,
  UploadError,
} from "imagekitio-next/dist/types/components/IKUpload/props";
import { ImageType } from "@/types/image/imageType";

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
  /* local mirrors so the tile can show its own progress bar and its own preview
     while the upload is still in flight — the parent only ever learns the finished image */
  const [percent, setPercent] = useState(0);
  const [pending, setPending] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

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
    if (pending) URL.revokeObjectURL(pending);
    setPending(null);
    setPercent(0);
  };
  const handleError = (error: UploadError) => {
    props.setMessage(error.message);
    /* a failed upload used to leave the Post button disabled forever */
    props.setDisable && props.setDisable(false);
    if (pending) URL.revokeObjectURL(pending);
    setPending(null);
    setPercent(0);
  };

  const handleUploadStart = () => {
    props.setDisable && props.setDisable(true);
  };

  const validateAndResetFile = (file: File) => {
    const isValid = file.size < 2000000;
    if (!isValid) {
      props.setMessage("File is too large (max 2MB)");
      props.setError && props.setError(true);
      if (imageUploadRef.current) {
        imageUploadRef.current.value = "";
      }
      return isValid;
    }
    if (pending) URL.revokeObjectURL(pending);
    setPending(URL.createObjectURL(file));
    setPercent(0);
    return isValid;
  };

  const openPicker = () => imageUploadRef.current?.click();

  /* a dropped file goes through the same input, so it gets the same 2 MB check and the
     same ImageKit upload. shortcut: browsers that refuse a programmatic files= assignment
     fall back to opening the picker, which is the path that always worked. */
  const takeFile = (file: File | undefined) => {
    const input = imageUploadRef.current;
    if (!file || !input) { openPicker(); return; }
    try {
      const transfer = new DataTransfer();
      transfer.items.add(file);
      input.files = transfer.files;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    } catch {
      openPicker();
    }
  };

  const remove = () => {
    props.setImage(undefined);
    if (pending) URL.revokeObjectURL(pending);
    setPending(null);
    setPercent(0);
    props.setProgress(0);
    if (imageUploadRef.current) imageUploadRef.current.value = "";
  };

  const preview = pending ?? props.image?.url ?? null;
  const uploading = percent > 0 && percent < 100;

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
          const pct = Math.floor((evt.loaded / evt.total) * 100);
          setPercent(pct);
          props.setProgress(pct);
        }}
        onUploadStart={handleUploadStart}
        onSuccess={handleSuccess}
        onError={handleError}
        style={{ display: "none" }}
        ref={imageUploadRef}
        validateFile={validateAndResetFile}
      />

      <div className="wv-photo">
        <div
          role="button"
          tabIndex={0}
          onClick={openPicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openPicker(); }
          }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            takeFile(e.dataTransfer.files?.[0]);
          }}
          data-profile={props.profile ? "true" : undefined}
          data-empty={preview ? undefined : "true"}
          data-drag={dragging ? "true" : undefined}
          aria-busy={uploading}
          aria-describedby="wv-photo-hint"
          aria-label={preview ? "Open the picker to choose a different photo" : "Add a photo, up to 2 MB"}
          className="wv-photo-tile"
        >
          {preview ? (
            <img src={preview} alt="Selected photo" className="wv-photo-preview" />
          ) : (
            <>
              <span className="wv-photo-plus">
                <svg viewBox="0 0 24 24" className="od-icon [--od-icon-size:1.5rem]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true" focusable="false">
                  <path d="M12 5.5v13M5.5 12h13" />
                </svg>
              </span>
              <span className="wv-photo-caption">{dragging ? "Drop it here" : "Add a photo"}</span>
              <span className="wv-photo-hint">{dragging ? "Any image under 2 MB" : "Pick one or drop it in · up to 2 MB"}</span>
            </>
          )}

          {preview && uploading ? (
            <span className="wv-photo-scrim">Uploading… {percent}%</span>
          ) : preview && !uploading ? (
            <span className="wv-photo-scrim">Photo ready</span>
          ) : null}

          {uploading ? (
            <span
              className="wv-photo-bar"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Upload progress"
            >
              <span style={{ width: `${percent}%` }} />
            </span>
          ) : null}
        </div>

        {preview ? (
          <div className="wv-photo-actions">
            <button type="button" onClick={openPicker} className="wv-btn">Replace</button>
            <button type="button" onClick={remove} className="wv-btn wv-btn--danger">Remove</button>
          </div>
        ) : null}

        <p id="wv-photo-hint" className="wv-photo-status" role="status">
          {uploading
            ? `Uploading to ImageKit — ${percent}%`
            : preview
              ? "Uploaded. Replace or remove it before posting."
              : props.profile
                ? "Square crop, up to 2 MB."
                : "16:10 in the feed, up to 2 MB."}
        </p>
      </div>
    </ImageKitProvider>
  );
}
