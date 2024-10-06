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
import ProfilePlaceholder from "@/public/placeholders/profilePlaceholder.png";
import { getUser } from "@/actions/user/getUser";
export default function Nav() {
  const paths = useMemo(() => ["/", "/register", "/login"], []);
  const path = usePathname();
  const router = useRouter();
  const [showLogoutPrompt, setShowLogoutPrompt] = useState<boolean>(false);
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
      return;
    }
    const fetchUserWithTimeout = async () => {
      const fetchUser = async () => {
        const response = await getUser();
        if (response.status > 400) {
          router.push("/");
        }
        console.log(response);
        return response;
      };
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 3000)
      );
      try {
        const result = await Promise.race([fetchUser(), timeout]);
        setUserName(result.username);
        setUserId(result._id);
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.message === "Timeout") {
            console.error("Request timed out, reloading page...");
            window.location.reload();
          } else {
            console.error("Error fetching user:", error);
          }
        } else {
          console.error("Unknown error:", error);
        }
      }
    };

    fetchUserWithTimeout();
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
  const handleLogOut = () => {
    setShowLogoutPrompt(!showLogoutPrompt);
  };
  const handleSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleCreatePost = () => {
    setShowCreatePost(!showCreatePost);
  };

  const handleProfile = () => {
    router.push("/profile" + `?user=${userId}`);
  };

  const navButtons = content({
    handleCreatePost,
    handleSearch,
    handleLogOut,
    handleProfile,
    userName: isLoaded ? userName : "Profile",
    profilePicture: ProfilePlaceholder.src,
  });

  return (
    <>
      {showLogoutPrompt && <Logout setShowLogoutPrompt={setShowLogoutPrompt} />}
      {showCreatePost && <CreatePost setShowCreatePost={setShowCreatePost} />}
      {showSearch && <Search />}
      {!paths.includes(path) && (
        <nav
          className={`transition-all duration-500 z-30 relative ${
            isLoaded ? "animate-fadeIn" : "animate-pulse"
          }`}
        >
          <div className="flex flex-row items-center gap-4 z-10 bg-black md:gap-0 justify-center md:justify-start md:items-start md:flex-col p-1 md:p-4 w-full h-fit order-2 md:order-1 fixed md:w-fit bottom-0 md:h-screen border-t-2 md:border-t-0 md:border-r-2 border-sky-500 shadow-glow-sm shadow-sky-400 ">
            <Link href={"/home"}>
              <Image
                src={Logo}
                alt="WeVibe Logo"
                priority
                className="w-14 h-14 md:w-36 md:h-36"
                width={100}
                height={100}
              />
            </Link>
            <div className="flex flex-row md:flex-col md:py-10 md:px-2 gap-4 md:gap-8">
              {navButtons.map((item) => (
                <div className="group relative" key={item.id}>
                  <button
                    onClick={item.onClick}
                    disabled={isLoaded ? false : true}
                    className="flex relative items-center justify-start gap-2"
                  >
                    {item.icon}
                    <h2 className="text-xl hidden md:block">{item.name}</h2>
                  </button>
                  {item.tooltip}
                </div>
              ))}
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
