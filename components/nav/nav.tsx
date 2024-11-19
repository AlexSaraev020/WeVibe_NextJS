"use client";
import React, { useEffect, useMemo, useState } from "react";
import Logo from "@/public/icons/WeVibe.png";
import Image from "next/image";
import ProfilePlaceholder from "@/public/placeholders/profilePlaceholder.png";
import { usePathname, useRouter } from "next/navigation";
import { displayedButtons } from "./navcomponents/buttons";
import Logout from "./navcomponents/prompts/logout";
import CreatePost from "./navcomponents/prompts/createPost";
import Search from "./navcomponents/search";
import Link from "next/link";
import { fetchUserWithTimeout } from "@/actions/componentActions/nav/fetchUserData";
import {
  handleCreatePost,
  handleProfile,
  handleSearch,
} from "@/actions/componentActions/nav/toggleFunctions";
import { Router } from "next/router";
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

  const navButtons = displayedButtons({
    handleCreatePost: handleCreatePost,
    handleSearch: handleSearch,
    handleProfile: handleProfile,
    userName: isLoaded ? userName : "Profile",
    profilePicture: userImage ? userImage : ProfilePlaceholder,
  });

  useEffect(() => {
    const disable__Search__OnRouteChange = () => {
      setShowSearch(false);
    };
    Router.events.on("routeChangeComplete", disable__Search__OnRouteChange);
    return () => {
      Router.events.off("routeChangeComplete", disable__Search__OnRouteChange);
    };
  }, []);

  return (
    <>
      {showCreatePost && <CreatePost setShowCreatePost={setShowCreatePost} />}
      {showSearch && <Search />}
      {!paths.includes(path) && !showCreatePost && (
        <nav
          className={`group fixed bottom-0 z-50 order-2 flex h-fit w-full flex-row items-center justify-center gap-4 border-postBackground/50 bg-black p-1 shadow-glow-sm shadow-postBackground transition-all delay-0 duration-1000 group-hover:delay-0 lg:order-1 lg:h-screen lg:w-fit lg:flex-col lg:items-start lg:justify-start lg:gap-0 lg:border-r-2 lg:border-t-0 lg:bg-transparent lg:p-4 lg:hover:border-none lg:hover:shadow-none ${
            isLoaded ? "animate-fadeIn" : "animate-pulse"
          }`}
        >
          <Link href={"/home"}>
            <Image
              src={Logo}
              alt="WeVibe Logo"
              priority
              className="h-10 w-10 transition-all delay-1000 duration-1000 lg:h-14 lg:w-14 lg:group-hover:h-28 lg:group-hover:w-28 lg:group-hover:delay-0"
              width={100}
              height={100}
            />
          </Link>
          <div className="flex flex-row items-start gap-4 lg:flex-col lg:gap-8 lg:px-2 lg:py-10">
            {navButtons.map((item) => (
              <div className="group relative" key={item.id}>
                <button
                  onClick={() =>
                    item.onClick({
                      setShowCreatePost,
                      setShowSearch,
                      router,
                      userId,
                      showSearch,
                      showCreatePost,
                    })
                  }
                  disabled={isLoaded ? false : true}
                  className="relative flex items-center justify-center gap-2"
                >
                  {item.icon}
                  <h2 className="text-md hidden max-w-0 overflow-hidden font-semibold opacity-0 transition-all lg:block lg:delay-1000 lg:duration-1000 lg:group-hover:max-w-xs lg:group-hover:opacity-100 lg:group-hover:delay-0">
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
