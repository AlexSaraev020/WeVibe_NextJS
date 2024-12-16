"use client";
import React, { useEffect, useMemo, useState } from "react";
import Logo from "@/public/icons/WeVibe.png";
import Image from "next/image";
import ProfilePlaceholder from "@/public/placeholders/profilePlaceholder.png";
import { usePathname, useRouter } from "next/navigation";
import { displayedButtons } from "./navcomponents/buttons";
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
import { useUserNavData } from "@/contexts/user/userNavContext";
export default function Nav() {
  const paths = useMemo(
    () => ["/", "/auth/register", "/auth/login", "/auth/resetpassword"],
    [],
  );
  const path = usePathname();
  const router = useRouter();
  const { userImage, username, setUserImage, setUsername } = useUserNavData();
  const [showCreatePost, setShowCreatePost] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (paths.includes(path)) {
      setShowCreatePost(false);
      setShowSearch(false);
    }
    (async () => {
      await fetchUserWithTimeout({
        setUserId,
        setUsername,
        setUserImage,
        paths,
        path,
        router,
      });
    })();
  }, [router, path, paths]);

  useEffect(() => {
    if (username) {
      setIsLoaded(true);
    }
  }, [router, username]);

  useEffect(() => {
    document.documentElement.style.overflow = showCreatePost
      ? "hidden"
      : "auto";
    document.body.style.overflow = showCreatePost ? "hidden" : "auto";
  }, [showCreatePost]);

  const navButtons = displayedButtons({
    handleCreatePost: handleCreatePost,
    handleSearch: handleSearch,
    handleProfile: handleProfile,
    userName: isLoaded ? username : "Profile",
    profilePicture: userImage.url ? userImage.url : ProfilePlaceholder,
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
      {showSearch && <Search setShowSearch={setShowSearch} />}
      {!isLoaded && !paths.includes(path) && (
        <div className="fixed inset-0 top-0 z-40 min-h-screen w-screen bg-black bg-[radial-gradient(ellipse_60%_70%_at_50%_-20%,rgba(14,165,233,0.4),rgba(255,255,255,0))] transition-all duration-75" />
      )}
      {!paths.includes(path) && !showCreatePost && (
        <nav
          className={`group fixed bottom-0 z-30 order-2 flex h-fit w-full flex-row items-center justify-center gap-4 border-postBackground/50 bg-black p-1 shadow-glow-sm shadow-postBackground transition-all delay-0 duration-1000 group-hover:delay-0 lg:order-1 lg:h-screen lg:w-fit lg:flex-col lg:items-start lg:justify-start lg:gap-0 lg:border-r-2 lg:border-t-0 lg:bg-transparent lg:p-4 lg:hover:border-none lg:hover:shadow-none ${
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
