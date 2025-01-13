"use client";
import { deleteAccount } from "@/actions/profile/deleteAccount";
import ShinyButton from "@/components/buttons/shinyButton";
import FormInput from "@/components/forms/formElements/input";
import { useAlert } from "@/contexts/alert/alertContext";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface DeleteAccountProps {
  setDeleteAccount: (deleteAccount: boolean) => void;
  searchedUserId: string;
}

export const DeleteAccount = ({ setDeleteAccount, searchedUserId }: DeleteAccountProps) => {
  const [password, setPassword] = useState<string>("");
  const { setMessage } = useAlert();
  const router = useRouter();
  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await deleteAccount({ searchedUserId, setMessage , router , password });
    setDeleteAccount(false);
  }
  return (
    <form onSubmit={handleDelete} className="fixed inset-0 z-50 flex h-[100dvh] w-full items-center justify-center bg-black/60">
      <div className="flex animate-fadeIn flex-col gap-2 rounded-xl border-2 border-postBackground/50 bg-black/90 p-6 shadow-glow shadow-postBackground/50 transition-all duration-500 md:w-3/12">
        <h2 className="neon-text bg-gradient-to-r from-postBackground/50 via-sky-400 to-postBackground/50 bg-clip-text py-1 text-center text-base font-extrabold text-transparent md:text-2xl">
          Confirm Account Deletion
        </h2>
        <h3 className="text-center text-xs text-gray-300 md:text-sm">
          Enter your password to delete your account
        </h3>
        <FormInput
          type="password"
          name="password"
          placeholder="Enter your password"
          id="password"
          maxLength={64}
          minLength={8}
          password
          required={false}
          value={password}
          ariaLabel="Enter your password to delete your account"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        <div className="mt-2 flex justify-center gap-3 md:gap-10">
          <ShinyButton
            ariaLabel='DeleteAccountButton'
            id='DeleteAccountButton'
            type="submit"
            className="w-24 bg-red-950/50 text-sm font-semibold text-red-100 hover:text-red-400 hover:shadow-red-500/70 md:w-28 md:text-lg"
            bottomLineCollor="bg-gradient-to-r from-sky-500/0 via-red-500/80 to-sky-500/0"
            topLineColor="bg-gradient-to-r from-sky-500/0 via-red-500/70 to-sky-500/0"
            background="bg-gradient-to-tr py-2 md:py-1 from-black via-neutral-950 to-black"
            text="Delete"
          />
          <ShinyButton
            ariaLabel='CancelDeleteAccountButton'
            id='CancelDeleteAccountButton'
            type="button"
            onClick={() => setDeleteAccount(false)}
            background="bg-gradient-to-tr from-black py-2 md:py-1 via-neutral-950 to-black"
            className="w-24 text-sm font-semibold text-sky-100 md:w-28 md:text-lg"
            text="Cancel"
          />
        </div>
      </div>
    </form>
  );
};
