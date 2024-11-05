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
  };
  return (
    <form
      onSubmit={searchSubmit}
      autoComplete="off"
      className="relative left-1/2 top-16 z-50 w-11/12 -translate-x-1/2 -translate-y-1/2 transform md:w-4/12 mb-10"
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
          className="h-12 w-full animate-fadeIn rounded-full border-2 border-sky-700 bg-black/30 px-4 text-white shadow-glow-sm shadow-sky-500 transition-all duration-500 focus:shadow-glow focus:shadow-sky-500 focus:outline-none"
        />
        <div className="flex gap-2 absolute top-1/2 -translate-y-1/2 transform right-2">
          {showClear && (
            <button
              type="button"
              onClick={handleClear}
              className="transform animate-fadeIn transition-all duration-500"
            >
              <MdClear className="h-5 w-5 fill-sky-100/80" />
            </button>
          )}
          <button
            type="submit"
            className="transform animate-fadeIn transition-all duration-500 bg-sky-900/80 rounded-full p-1"
          >
            <CiSearch className="h-7 w-7 fill-sky-100/80" />
          </button>
        </div>
      </div>
    </form>
  );
}
