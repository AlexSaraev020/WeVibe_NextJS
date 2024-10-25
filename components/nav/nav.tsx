"use client";
import React, { useEffect, useMemo, useState } from "react";
import Logo from "@/public/icons/WeVibe.png";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { content } from "./navcomponents/buttons";
import Logout from "./navcomponents/prompts/logout";
import CreatePost from "./navcomponents/prompts/createPost";
import Search from "./navcomponents/search";
import Link from "next/link";
import { fetchUserWithTimeout } from "@/actions/componentActions/nav/fetchUserData";
import {
  handleCreatePost,
  handleLogOut,
  handleProfile,
  handleSearch,
} from "@/actions/componentActions/nav/toggleFunctions";
export default function Nav() {
  const paths = useMemo(() => ["/", "/register", "/login"], []);
  const path = usePathname();
  const router = useRouter();
  const [showLogoutPrompt, setShowLogoutPrompt] = useState<boolean>(false);
  const [userImage, setUserImage] = useState<string>("");
  const [showCreatePost, setShowCreatePost] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (paths.includes(path)) {
      setShowCreatePost(false);
      setShowLogoutPrompt(false);
      setShowSearch(false);
    }
    fetchUserWithTimeout({
      setUserName,
      setUserId,
      setUserImage,
      paths,
      path,
      router,
    });
  }, [router, path, paths]);

  useEffect(() => {
    if (userName) {
      setIsLoaded(true);
    }
  }, [router, userName]);

  useEffect(() => {
    document.documentElement.style.overflow =
      showLogoutPrompt || showCreatePost ? "hidden" : "auto";
  }, [showLogoutPrompt, showCreatePost]);

  const navButtons = content({
    handleCreatePost: handleCreatePost,
    handleSearch: handleSearch,
    handleLogOut: handleLogOut,
    handleProfile: handleProfile,
    userName: isLoaded ? userName : "Profile",
    profilePicture: userImage,
  });

  return (
    <>
      {showLogoutPrompt && <Logout setShowLogoutPrompt={setShowLogoutPrompt} />}
      {showCreatePost && <CreatePost setShowCreatePost={setShowCreatePost} />}
      {showSearch && <Search />}
      {!paths.includes(path) && (
        <nav
          className={`group fixed bottom-0 z-10 order-2 flex h-fit w-full flex-row items-center justify-center gap-4 border-t-2 border-sky-500 bg-black p-1 shadow-glow-sm shadow-sky-400 transition-all duration-1000 group-hover:delay-0 delay-1000 md:order-1 md:h-screen md:w-fit md:flex-col md:items-start md:justify-start md:gap-0 md:border-r-2 md:border-t-0 md:p-4 ${
            isLoaded ? "animate-fadeIn" : "animate-pulse"
          }`}
        >
          <Link href={"/home"}>
            <Image
              src={Logo}
              alt="WeVibe Logo"
              priority
              className="md:w-18 md:h-18 h-14 w-14 transition-all duration-1000 group-hover:delay-0 delay-1000 group-hover:h-28 group-hover:w-28"
              width={100}
              height={100}
            />
          </Link>
          <div className="flex flex-row gap-4 md:flex-col md:gap-8 md:px-2 md:py-10">
            {navButtons.map((item) => (
              <div className="group relative" key={item.id}>
                <button
                  onClick={() =>
                    item.onClick({
                      setShowLogoutPrompt,
                      setShowCreatePost,
                      setShowSearch,
                      router,
                      userId,
                      showLogoutPrompt,
                      showSearch,
                      showCreatePost,
                    })
                  }
                  disabled={isLoaded ? false : true}
                  className="relative flex items-center justify-start gap-2"
                >
                  {item.icon}
                  <h2 className="text-md max-w-0 overflow-hidden font-semibold opacity-0 transition-all duration-1000 group-hover:delay-0 delay-1000 group-hover:max-w-xs group-hover:opacity-100">
                    {item.name}
                  </h2>
                </button>
              </div>
            ))}
          </div>
        </nav>
      )}
    </>
  );
}
