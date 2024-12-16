import FormInput from "@/components/forms/formElements/input";
import { UserType } from "@/types/userTypes/user/userType";
import React, { useState } from "react";
import Image from "next/image";
import ShinyButton from "@/components/buttons/shinyButton";
import { IoClose } from "react-icons/io5";
import { updateProfile } from "@/actions/profile/updateProfile";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import Textarea from "@/components/forms/formElements/textarea";
import { useAlert } from "@/contexts/alert/alertContext";
import { useUserNavData } from "@/contexts/user/userNavContext";
import { updateAccount } from "@/actions/profile/updateAccount";
import { deleteImage } from "@/actions/posts/deletion/deleteImage";
import { ImageType } from "@/types/image/imageType";
import Upload from "@/components/uploadImage/upload";
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
  const [image, setImage] = useState<ImageType | undefined>(undefined);
  const [progress, setProgress] = useState<number>(0);
  const { setMessage, setError } = useAlert();
  const { setUsername, setUserImage } = useUserNavData();
  const [disable, setDisable] = useState<boolean>(false);
  const router = useRouter();
  const cancelProfileUpdate = async () => {
    try {
      if (image) {
        await deleteImage(image);
        setImage(undefined);
      }
      setEdit(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    {
      profile &&
        !account &&
        (await updateProfile({
          username,
          setMessage,
          setUserImage,
          setUsername,
          setError,
          setEdit,
          bio,
          image: image ? image : undefined,
          currentImage: user.image,
          router,
        }));
      account &&
        !profile &&
        (await updateAccount({
          email,
          password,
          router,
          setEdit,
          setMessage,
          setError,
        }));
    }
  };
  return (
    <>
      <form className="relative flex w-11/12 animate-fadeIn flex-col items-center justify-center gap-4 rounded-xl border-2 border-postBackground/50 bg-black py-5 shadow-glow shadow-postBackground/50 transition-all duration-500 sm:w-7/12 md:w-3/6 md:py-10 lg:w-5/12 xl:w-4/12">
        <div
          onClick={() => setAccount(!account)}
          className="relative z-10 flex h-12 w-[8.5rem] items-center justify-center gap-4 rounded-full border-2 border-postBackground/50 shadow-glow shadow-postBackground/50 hover:cursor-pointer md:h-14 md:w-[10.5rem]"
        >
          <div
            className={twMerge(
              "absolute h-10 w-16 rounded-full bg-postBackground/50 transition-all duration-500 md:h-12 md:w-20",
              !account ? "-translate-x-1/2" : "translate-x-1/2",
            )}
          />
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
              {/* profile image upload */}
              <Upload
                profile
                setImage={setImage}
                setMessage={setMessage}
                setProgress={setProgress}
                setDisable={setDisable}
                image={image}
              />

              <div className="relative h-20 w-20 md:h-40 md:w-40">
                <Image
                  src={image ? image.url : user.image.url}
                  width={100}
                  height={100}
                  alt="profile"
                  className="absolute z-20 h-full w-full rounded-full object-contain"
                />
                <Image
                  src={image ? image.url : user.image.url}
                  width={100}
                  height={100}
                  alt="profile"
                  className="absolute z-10 h-full w-full rounded-full object-cover opacity-50"
                />
              </div>
              <div className="absolute z-0 flex h-44 w-44 items-center justify-center rounded-full">
                <div
                  className="absolute h-full w-full rounded-full bg-gradient-to-tr from-postBackground/50 to-transparent"
                  style={{
                    background: `conic-gradient(rgba(14, 165, 233, 0.5) ${progress * 3.6}deg, #000000 ${progress * 3.6}deg)`,
                    boxShadow: `0 0 20px rgba(14, 165, 233, ${0.5 * (progress / 100)})`,
                  }}
                />
              </div>
            </div>
            <div className="flex w-11/12 flex-col items-start justify-center gap-2">
              <FormInput
                ariaLabel="Enter your username"
                update
                maxLength={50}
                minLength={3}
                labelDisplay
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

              <Textarea
                name="Bio"
                showLabel
                id="bio"
                rows={4}
                maxLength={200}
                minLength={0}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setBio(e.target.value)
                }
                value={bio}
                ariaLabel="Enter your bio"
              />
            </div>
          </>
        )}

        {account && (
          <div className="flex w-11/12 flex-col gap-2 md:gap-3">
            <FormInput
              ariaLabel="Enter your email"
              update
              maxLength={254}
              minLength={6}
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              type="text"
              name="Email"
              labelDisplay
              id="email"
              placeholder="Change your email"
              required
            />
            <FormInput
              ariaLabel="Enter your password"
              update
              maxLength={64}
              minLength={8}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              value={password}
              type="password"
              password
              labelDisplay
              name="Password"
              id="password"
              placeholder="Change your password"
              required
            />
          </div>
        )}
        <div
          className={twMerge(
            "mt-6 grid w-11/12 grid-cols-3 items-center justify-center gap-2 md:w-7/12",
            disable && "pointer-events-none hover:cursor-wait",
          )}
        >
          <ShinyButton
            type="button"
            disabled={disable}
            onClick={handleSave}
            background="bg-gradient-to-tr from-black via-neutral-950 py-2 md:py-1 to-black"
            className="text-sm font-semibold text-sky-100 shadow-2xl hover:shadow-postBackground/30 md:w-full md:text-lg"
            text={"Save"}
          />
          <ShinyButton
            disabled={disable}
            onClick={cancelProfileUpdate}
            bottomLineCollor="bg-gradient-to-r from-sky-500/0 via-white/70 to-sky-500/0"
            topLineColor="bg-gradient-to-r from-sky-500/0 via-white/70 to-sky-500/0"
            className="text-sm font-semibold shadow-2xl hover:shadow-white/30 md:w-full md:text-lg"
            background="bg-gradient-to-tr from-black py-2 md:py-1 via-neutral-950 to-black"
            text={"Cancel"}
            type="button"
          />

          <ShinyButton
            type="button"
            onClick={() => setLogout(true)}
            className="text-sm font-semibold text-red-100 shadow-2xl hover:text-red-400 hover:shadow-red-500/30 md:w-full md:text-lg"
            bottomLineCollor="bg-gradient-to-r from-sky-500/0 via-red-500/80 to-sky-500/0"
            topLineColor="bg-gradient-to-r from-sky-500/0 via-red-500/70 to-sky-500/0"
            background="bg-gradient-to-tr from-black py-2 md:py-1 via-neutral-950 to-black"
            text={"Logout"}
          />
          {account && (
            <ShinyButton
              type="button"
              onClick={handleSave}
              bottomLineCollor="bg-gradient-to-r from-sky-500/0 via-red-500/80 to-sky-500/0"
              topLineColor="bg-gradient-to-r from-sky-500/0 via-red-500/70 to-sky-500/0"
              background="bg-gradient-to-tr from-black py-2 via-neutral-950 to-black"
              className="col-span-3 text-sm font-semibold text-red-100 shadow-2xl hover:text-red-400 hover:shadow-red-500/30 md:w-full md:text-lg"
              text={"Delete Account"}
            />
          )}
        </div>
      </form>
    </>
  );
}
