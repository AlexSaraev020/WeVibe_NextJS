import FormInput from "@/components/authForm/formElements/input";
import { UserType } from "@/types/userTypes/user/userType";
import React, { useState } from "react";
import Image from "next/image";
import ShinyButton from "@/components/buttons/shinyButton";
import { IoClose } from "react-icons/io5";
interface EditFormProps {
  user: UserType;
  setEdit: (edit: boolean) => void;
}

export default function EditForm({ user, setEdit }: EditFormProps) {
  const [username, setUserName] = useState<string>(user.username);
  const [email, setEmail] = useState<string>(user.email);
  const [password, setPassword] = useState<string>("");
  const [bio, setBio] = useState<string>(user.bio);
  return (
    <form className="relative z-10 flex w-11/12 flex-col items-center justify-center gap-4 rounded-xl border-2 border-postBackground/50 bg-transparent py-5 shadow-glow shadow-postBackground/50 md:w-3/6 md:py-10 lg:w-5/12 xl:w-4/12">
      <h2 className="font-sans text-2xl font-bold text-sky-400 md:text-4xl">
        Edit Profile
      </h2>
      <button
        className="absolute right-2 top-2 rounded-full p-1 md:p-0"
        onClick={() => setEdit(false)}
      >
        <IoClose className="h-7 w-7 cursor-pointer fill-sky-100 transition-all duration-500 hover:scale-105 hover:fill-postBackground/70 md:h-10 md:w-10" />
      </button>

      <Image
        src={user.image}
        width={100}
        height={100}
        alt="profile"
        className="h-20 w-20 rounded-full md:h-40 md:w-40"
      />
      <textarea
        name="Comment section"
        id="comment"
        placeholder="Change bio"
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setBio(e.target.value)
        }
        value={bio}
        rows={2}
        aria-label="Write a comment"
        className="w-11/12 resize-none rounded-lg border-2 border-zinc-600 bg-transparent p-2 text-sm transition-all duration-500 focus:border-postBackground/50 focus:shadow-glow focus:shadow-postBackground/50 focus:outline-none"
      />
      <div className="flex w-11/12 flex-col gap-2 md:gap-3">
        <FormInput
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
        <FormInput
          maxLength={50}
          minLength={2}
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUserName(e.target.value)
          }
          type="text"
          name="Email"
          id="email"
          placeholder="Change your email"
          required
        />
        <FormInput
          maxLength={50}
          minLength={2}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUserName(e.target.value)
          }
          type="password"
          password
          name="Password"
          id="password"
          placeholder="Change your password"
          required
        />
        <div className="mt-2 flex w-full items-center justify-center gap-2">
          <ShinyButton
            className="w-24 text-sm font-semibold text-sky-100 md:w-32 md:text-lg"
            text={"Save"}
          />
          <ShinyButton
            bottomLineCollor="bg-gradient-to-r from-sky-500/0 via-white/70 to-sky-500/0"
            topLineColor="bg-gradient-to-r from-sky-500/0 via-white/70 to-sky-500/0"
            className="w-24 bg-white/20 text-sm font-semibold hover:shadow-white/50 md:w-32 md:text-lg"
            text={"Cancel"}
          />
        </div>
      </div>
    </form>
  );
}
