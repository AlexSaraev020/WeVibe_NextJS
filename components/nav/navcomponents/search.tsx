"use client";
import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { MdClear } from "react-icons/md";

export default function Search() {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [showClear, setShowClear] = useState<boolean>(false);
  const encodedSearch = encodeURIComponent(search);
  const searchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search) {
      router.push(`/search` + `?q=${encodedSearch}`);
      setSearch("");
    }
  };
  useEffect(() => {
    if (search) {
      setShowClear(true);
    } else {
      setShowClear(false);
    }
  }, [search]);
  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSearch("");
  };  return (
    <form
      onSubmit={searchSubmit}
      autoComplete="off"
      className=" w-8/12 md:w-4/12 fixed top-16 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
    >
      <div className="relative">
        <input
          type="text"
          name="search"
          placeholder="Search"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          className="w-full h-12 px-4 bg-neutral-900 text-white focus:outline-none rounded-full border-2 border-zinc-600 shadow-glow-sm shadow-zinc-200 focus:shadow-glow focus:shadow-white transition-all duration-500 animate-fadeIn"
        />
        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1/2 right-12 transform -translate-y-1/2 transition-all duration-500 animate-fadeIn"
          >
            <MdClear className="w-5 h-5 fill-white/70" />
          </button>
        )}
        <button
          type="submit"
          className="absolute top-1/2 right-4 transform -translate-y-1/2 transition-all duration-500 animate-fadeIn"
        >
          <CiSearch className="w-7 h-7" />
        </button>
      </div>
    </form>
  );
}
