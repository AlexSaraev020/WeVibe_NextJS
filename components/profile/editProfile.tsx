import React from "react";
import Form from "../authForm/form";
import EditForm from "./editProfileComponents/editForm";
import { UserType } from "@/types/userTypes/user/userType";

interface EditProfileProps {
  user: UserType;
  setEdit: (edit: boolean) => void;
}
export default function EditProfile({ user , setEdit }: EditProfileProps) {

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
      <EditForm user={user} setEdit={setEdit}/>
    </div>
  );
}
