"use client";
import React, { useEffect, useState } from "react";
import ShinyButton from "../buttons/shiny-button";
import FormInput from "./formElements/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/auth/register";
import { loginUser } from "@/actions/auth/login";
import { AiOutlineLoading } from "react-icons/ai";

interface FormProps {
  register?: boolean;
  className?: string;
}
export default function Form({ register, className }: FormProps) {
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [failure, setFailure] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    {
      register
        ? await registerUser({
            userName,
            email,
            password,
            setSuccess,
            setFailure,
            router,
          })
        : await loginUser({ email, password, setSuccess, setFailure, router });
    }
  };
  useEffect(() => {
    setLoading(false);
  }, [success, failure]);
  return (
    <form
      className={`${className} w-11/12 md:w-3/6 lg:w-4/12 xl:w-3/12 border border-sky-400 flex flex-col items-center justify-center bg-transparent py-5 md:py-10 z-10 gap-8 rounded-xl shadow-glow shadow-sky-400`}
      onSubmit={handleSubmit}
    >
      <h2 className="text-4xl font-bold font-sans text-sky-400">
        {register ? "Register" : "Login"}
      </h2>
      <div className="w-full flex flex-col justify-center items-center gap-3">
        {register && (
          <div className="w-9/12 flex flex-col gap-3">
            <FormInput
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              name="Name"
              id="name"
              placeholder="Enter your name"
              required
            />
          </div>
        )}
        <div className="w-9/12 flex flex-col gap-3">
          <FormInput
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="Email"
            id="email"
            placeholder="Enter your email"
            required
          />
          <FormInput
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="Password"
            id="password"
            placeholder="Enter your password"
            required
          />
        </div>
      </div>
      <ShinyButton type="submit" text={register ? "Register" : "Login"} />
      {loading && (
        <AiOutlineLoading className="text-sky-500 animate-spin w-8 h-8" />
      )}
      {success && (
        <div className="flex items-center justify-center bg-black">
          <span className="absolute mx-auto py-4 flex border w-fit bg-gradient-to-r blur-xl from-emerald-500 via-teal-500 to-green-500 bg-clip-text text-xl box-content font-extrabold text-transparent text-center select-none">
            {success}
          </span>
          <h1 className="relative top-0 w-fit h-auto py-4 justify-center flex bg-gradient-to-r items-center from-emerald-500 via-teal-500 to-green-500 bg-clip-text text-xl font-extrabold text-transparent text-center select-auto">
            {success}
          </h1>
        </div>
      )}
      {failure && (
        <div className="flex items-center justify-center bg-black">
          <span className="absolute mx-auto py-4 flex border w-fit bg-gradient-to-r blur-xl from-red-500 to-rose-500 bg-clip-text text-xl box-content font-extrabold text-transparent text-center select-none">
            {failure}
          </span>
          <h1 className="relative top-0 w-fit h-auto py-4 justify-center flex bg-gradient-to-r items-center from-red-500 to-rose-500 bg-clip-text text-xl font-extrabold text-transparent text-center select-auto">
            {failure}
          </h1>
        </div>
      )}
      <div className="flex gap-1">
        <p>
          {register ? "Already have an account?" : "Don't have an account?"}
        </p>
        <Link
          className="text-sky-500 font-bold"
          href={register ? "/login" : "/register"}
        >
          {register ? " Login " : " Register "}
        </Link>
      </div>
    </form>
  );
}
