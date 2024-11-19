"use client";
import React, { useState } from "react";
import Form from "../authForm/form";
import EditForm from "./editProfileComponents/editForm";
import { UserType } from "@/types/userTypes/user/userType";
import { twMerge } from "tailwind-merge";
import Logout from "../nav/navcomponents/prompts/logout";

interface EditProfileProps {
  user: UserType;
  setEdit: (edit: boolean) => void;
}
export default function EditProfile({ user, setEdit }: EditProfileProps) {
  const [account, setAccount] = useState<boolean>(false);
  const [logout, setLogout] = useState<boolean>(false);

  return (
    <>
      {logout && <Logout setShowLogoutPrompt={setLogout} />}
      <div className="absolute inset-0 z-40 w-full flex flex-col items-center justify-center bg-black/60">
        {account ? (
          <EditForm
            setAccount={setAccount}
            setLogout={setLogout}
            account
            user={user}
            setEdit={setEdit}
          />
        ) : (
          <EditForm
            setAccount={setAccount}
            setLogout={setLogout}
            profile
            user={user}
            setEdit={setEdit}
          />
        )}
      </div>
    </>
  );
}
