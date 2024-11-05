"use client";
import { logoutUser } from "@/actions/auth/logout";
import { useRouter } from "next/navigation";
import React from "react";

interface LogoutProps {
  setShowLogoutPrompt: (showLogoutPrompt: boolean) => void;
}
export default function Logout({ setShowLogoutPrompt }: LogoutProps) {
  const router = useRouter();
  const handleLogOut = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await logoutUser();
      if (response?.status === 200) {
        setShowLogoutPrompt(false);
        router.push("/");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  return (
    <form
      onSubmit={handleLogOut}
      className="fixed inset-0 z-50 flex h-[100dvh] w-full items-center justify-center bg-black/60"
    >
      <div className="flex animate-fadeIn flex-col gap-6 rounded-xl border-2 border-postBackground/50 bg-black/90 p-6 shadow-glow shadow-postBackground/50 transition-all duration-500 md:w-4/12">
        <h2 className="neon-text bg-gradient-to-r from-postBackground/50 via-sky-400 to-postBackground/50 bg-clip-text py-1 text-center text-xl font-extrabold text-transparent md:text-3xl">
          Confirm Logout
        </h2>
        <h3 className="text-center text-gray-300">
          Are you sure you want to log out?
        </h3>
        <div className="flex justify-center gap-10">
          <button
            type="submit"
            className="z-50 w-24 rounded-md border-2 border-zinc-600 text-xl shadow-glow-sm shadow-zinc-600 transition-all duration-500 hover:scale-110 hover:border-postBackground/50 hover:text-sky-100 hover:shadow-glow hover:shadow-postBackground/50 md:text-2xl"
          >
            Yes
          </button>
          <button
            onClick={() => setShowLogoutPrompt(false)}
            className="w-24 rounded-md border-2 border-zinc-600 text-xl shadow-glow-sm shadow-zinc-600 transition-all duration-500 hover:scale-110 hover:border-red-400/70 hover:text-red-100 hover:shadow-glow hover:shadow-red-400/70 md:text-2xl"
          >
            No
          </button>
        </div>
      </div>
    </form>
  );
}
