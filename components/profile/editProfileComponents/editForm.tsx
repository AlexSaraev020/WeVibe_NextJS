import FormInput from "@/components/authForm/formElements/input";
import { UserType } from "@/types/userTypes/user/userType";
import React, { useState } from "react";
import Image from "next/image";
import ShinyButton from "@/components/buttons/shinyButton";
import { IoClose } from "react-icons/io5";
import { UploadDropzone } from "@/utils/uploadthing";
import axios from "axios";
import { updateProfile } from "@/actions/profile/updateProfile";
import { useRouter } from "next/navigation";
import Alert from "@/components/popups/alert";
import { twMerge } from "tailwind-merge";
interface EditFormProps {
  user: UserType;
  setEdit: (edit: boolean) => void;
  profile?: boolean;
  account?: boolean;
  setLogout: (logout: boolean) => void;
  setAccount: (account: boolean) => void;
}

export default function EditForm({
  user,
  setEdit,
  setLogout,
  setAccount,
  profile,
  account,
}: EditFormProps) {
  const [username, setUserName] = useState<string>(user.username);
  const [email, setEmail] = useState<string>(user.email);
  const [password, setPassword] = useState<string>("");
  const [bio, setBio] = useState<string>(user.bio);
  const [image, setImage] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [alert, setShowAlert] = useState<boolean>(false);
  const router = useRouter();
  const cancelProfileUpdate = async () => {
    try {
      if (image) {
        await axios.delete("api/uploadthing", {
          data: { url: image },
        });
        setImage("");
      }
      setEdit(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    {
      profile &&
        (await updateProfile({
          username,
          setMessage,
          setEdit,
          setShowAlert,
          bio,
          image: image && image?.length > 0 ? image : user.image,
          currentImage: user.image,
          router,
        }));
    }
  };
  return (
    <>
      <form className="relative flex w-11/12 flex-col items-center justify-center gap-4 rounded-xl border-2 border-postBackground/50 bg-black py-5 shadow-glow shadow-postBackground/50 transition-all duration-500 md:w-3/6 md:py-10 lg:w-5/12 xl:w-4/12">
        <div
          onClick={() => setAccount(!account)}
          className="relative z-10 flex h-12 w-[8.5rem] items-center justify-center gap-4 rounded-full border-2 border-postBackground/50 shadow-glow shadow-postBackground/50 hover:cursor-pointer md:h-14 md:w-[10.5rem]"
        >
          <div
            className={twMerge(
              "absolute h-10 w-16 rounded-full bg-postBackground/50 transition-all duration-500 md:h-12 md:w-20",
              !account ? "-translate-x-1/2" : "translate-x-1/2",
            )}
          />{" "}
          <button
            type="button"
            className={twMerge(
              "absolute z-10 h-10 w-16 -translate-x-1/2 rounded-full text-xs font-semibold transition-all duration-500 md:h-12 md:w-20 md:text-sm",
              !account ? "text-white" : "text-black",
            )}
          >
            Profile
          </button>
          <button
            type="button"
            className={twMerge(
              "absolute z-10 h-10 w-16 translate-x-1/2 rounded-full text-xs font-semibold transition-all duration-500 md:h-12 md:w-20 md:text-sm",
              account ? "text-white" : "text-black",
            )}
          >
            Account
          </button>
        </div>
        <button
          type="button"
          className="absolute right-2 top-2 rounded-full p-1 md:p-0"
          onClick={cancelProfileUpdate}
        >
          <IoClose className="h-7 w-7 cursor-pointer fill-sky-100 transition-all duration-500 hover:scale-105 hover:fill-postBackground/70 md:h-10 md:w-10" />
        </button>
        {profile && (
          <>
            <div className="relative flex w-11/12 items-center justify-center">
              <UploadDropzone
                config={{
                  mode: "auto",
                }}
                appearance={{
                  container: {
                    borderRadius: "50%",
                  },
                  button: {
                    display: "none",
                  },
                  uploadIcon: {
                    display: "none",
                  },
                  label: {
                    display: "none",
                  },
                  allowedContent: {
                    display: "none",
                  },
                }}
                onClientUploadComplete={(res) => {
                  setImage(res[0].url);
                }}
                onUploadError={(error: Error) => {
                  setMessage(error.message);
                }}
                onUploadProgress={(progress) => {
                  setProgress(progress);
                }}
                className="h-22 w-22 absolute z-20 rounded-full border-none transition-all duration-500 hover:cursor-pointer md:h-44 md:w-44"
                endpoint="imageUploader"
              />
              <Image
                src={image ? image : user.image}
                width={100}
                height={100}
                alt="profile"
                className="z-10 h-20 w-20 rounded-full md:h-40 md:w-40"
              />
              <div className="absolute z-0 flex h-44 w-44 items-center justify-center rounded-full">
                <div
                  className="absolute h-full w-full rounded-full bg-gradient-to-tr from-postBackground/50 to-transparent"
                  style={{
                    background: `conic-gradient(rgba(14, 165, 233, 0.5) ${progress * 3.6}deg, #000000 ${progress * 3.6}deg)`,
                    boxShadow: `0 0 20px rgba(14, 165, 233, ${0.5 * (progress / 100)})`, // scales shadow glow with progress
                  }}
                />
              </div>
            </div>
            <div className="flex w-11/12 flex-col items-start justify-center gap-2">
              <FormInput
                update
                maxLength={50}
                minLength={2}
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUserName(e.target.value)
                }
                type="text"
                name="Username"
                id="username"
                placeholder="Change your username"
                required
              />
              <label htmlFor="comment" className="text-xs md:text-base">
                Bio
              </label>
              <textarea
                name="Comment section"
                id="comment"
                placeholder="Change bio"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setBio(e.target.value)
                }
                value={bio}
                rows={4}
                maxLength={200}
                aria-label="Write a comment"
                className="w-full resize-none rounded-lg border-2 border-zinc-600 bg-transparent p-2 text-sm transition-all duration-500 scrollbar-none focus:border-postBackground/50 focus:shadow-glow focus:shadow-postBackground/50 focus:outline-none"
              />
            </div>
          </>
        )}

        {account && (
          <div className="flex w-11/12 flex-col gap-2 md:gap-3">
            <FormInput
              update
              maxLength={50}
              minLength={2}
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              type="text"
              name="Email"
              id="email"
              placeholder="Change your email"
              required
            />
            <FormInput
              update
              maxLength={50}
              minLength={2}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              type="password"
              password
              name="Password"
              id="password"
              placeholder="Change your password"
              required
            />
          </div>
        )}
        <div className="mt-6 grid w-11/12 grid-cols-3 items-center justify-center gap-4">
          <ShinyButton
            type="button"
            onClick={handleSave}
            background="bg-gradient-to-tr from-black via-neutral-950 to-black"
            className="w-24 text-sm font-semibold text-sky-100 shadow-2xl hover:shadow-postBackground/30 md:w-full md:text-lg"
            text={"Save"}
          />
          <ShinyButton
            onClick={cancelProfileUpdate}
            bottomLineCollor="bg-gradient-to-r from-sky-500/0 via-white/70 to-sky-500/0"
            topLineColor="bg-gradient-to-r from-sky-500/0 via-white/70 to-sky-500/0"
            className="w-24 bg-white/20 text-sm font-semibold shadow-2xl hover:shadow-white/30 md:w-full md:text-lg"
            background="bg-gradient-to-tr from-black via-neutral-950 to-black"
            text={"Cancel"}
            type="button"
          />

          <ShinyButton
            type="button"
            onClick={() => setLogout(true)}
            className="w-24 bg-red-950/50 text-sm font-semibold text-red-100 shadow-2xl hover:text-red-400 hover:shadow-red-500/30 md:w-full md:text-lg"
            bottomLineCollor="bg-gradient-to-r from-sky-500/0 via-red-500/80 to-sky-500/0"
            topLineColor="bg-gradient-to-r from-sky-500/0 via-red-500/70 to-sky-500/0"
            background="bg-gradient-to-tr from-black via-neutral-950 to-black"
            text={"Logout"}
          />
          {account && (
            <ShinyButton
              type="button"
              onClick={handleSave}
              bottomLineCollor="bg-gradient-to-r from-sky-500/0 via-red-500/80 to-sky-500/0"
              topLineColor="bg-gradient-to-r from-sky-500/0 via-red-500/70 to-sky-500/0"
              background="bg-gradient-to-tr from-black via-neutral-950 to-black"
              className="col-span-3 w-24 bg-red-950/50 text-sm font-semibold text-red-100 shadow-2xl hover:text-red-400 hover:shadow-red-500/30 md:w-full md:text-lg"
              text={"Delete Account"}
            />
          )}
        </div>
      </form>
      {alert && (
        <Alert
          setShowAlert={setShowAlert}
          message={message}
          setMessage={setMessage}
        />
      )}
    </>
  );
}
