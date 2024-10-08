"use client";
import { logoutUser } from "@/actions/auth/logout";
import { useRouter } from "next/navigation";
import React from "react";

interface LogoutProps {
  setShowLogoutPrompt: (showLogoutPrompt: boolean) => void;
}
export default function Logout({ setShowLogoutPrompt }: LogoutProps) {
  const router = useRouter();
  const handleLogOut = async () => {
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
    <div className="fixed bg-black/60 h-screen w-full z-50 inset-0 flex items-center justify-center">
      <div className="bg-black/90 md:w-4/12 border-2 border-sky-500 transition-all duration-500 flex flex-col gap-6 p-6 rounded-xl shadow-glow shadow-sky-500 animate-fadeIn">
        <h2 className="text-3xl py-1 md:text-5xl font-extrabold bg-gradient-to-r from-sky-200 via-sky-400 to-sky-200 text-center text-transparent bg-clip-text neon-text">
          Confirm Logout
        </h2>
        <h3 className="text-center text-gray-300">
          Are you sure you want to log out?
        </h3>
        <div className="flex gap-10 justify-center">
          <button
            onClick={handleLogOut}
            className="w-24 text-xl md:text-2xl rounded-md border-2 border-gray-500 transition-all duration-500 hover:scale-110 shadow-glow-sm hover:shadow-glow shadow-white hover:shadow-sky-500 hover:border-sky-400 hover:text-sky-300"
          >
            Yes
          </button>
          <button
            onClick={() => setShowLogoutPrompt(false)}
            className="w-24 text-xl md:text-2xl rounded-md border-2 border-gray-500 transition-all duration-500 hover:scale-110 shadow-glow-sm hover:shadow-glow shadow-white hover:shadow-red-500 hover:border-red-400 hover:text-red-300"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
