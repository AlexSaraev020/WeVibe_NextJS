"use client";
import React, { useEffect, useState } from "react";
import EditForm from "@/components/forms/editProfileForm/editForm";
import { UserType } from "@/types/userTypes/user/userType";
import Logout from "./logout";
import { DeleteAccount } from "./deleteAccount";

interface EditProfileProps {
  user: UserType;
  setEdit: (edit: boolean) => void;
  edit: boolean;
}
export default function EditProfile({ user, setEdit, edit }: EditProfileProps) {
  const [account, setAccount] = useState<boolean>(false);
  const [logout, setLogout] = useState<boolean>(false);
  const [deleteAccount, setDeleteAccount] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.style.overflow =
      edit || logout ? "hidden" : "auto";
    document.body.style.overflow = edit || logout ? "hidden" : "auto";
  }, [edit, logout]);
  return (
    <>
      {deleteAccount && (
        <DeleteAccount
          searchedUserId={user._id}
          setDeleteAccount={setDeleteAccount}
        />
      )}
      {logout && <Logout setShowLogoutPrompt={setLogout} />}
      <div className="fixed inset-0 z-40 flex w-full animate-appear flex-col items-center justify-center bg-black/60 transition-all duration-500">
        {account ? (
          <EditForm
            setAccount={setAccount}
            setLogout={setLogout}
            account
            setDeleteAccount={setDeleteAccount}
            user={user}
            setEdit={setEdit}
          />
        ) : (
          <EditForm
            setAccount={setAccount}
            setDeleteAccount={setDeleteAccount}
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
