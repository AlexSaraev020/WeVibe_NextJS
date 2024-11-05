"use client";
import React, { useEffect, useState } from "react";
import FormInput from "./formElements/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/auth/register";
import { loginUser } from "@/actions/auth/login";
import { AiOutlineLoading } from "react-icons/ai";
import ShinyButton from "../buttons/shinyButton";
import Alert from "../popups/alert";

interface FormProps {
  register?: boolean;
  className?: string;
}
export default function Form({ register, className }: FormProps) {
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [failure, setFailure] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
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
            setFailure,
            router,
          })
        : await loginUser({ email, password, setFailure, router });
    }
  };
  useEffect(() => {
    setLoading(false);
  }, [failure]);

  useEffect(() => {
    if (failure) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return prev;
          }
          return prev + 100 / 30;
        });
      }, 100);
      const timeout = setTimeout(() => {
        setFailure(undefined);
        setProgress(0);
      }, 3000);
      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }
  }, [failure]);
  return (
    <form
      className={`${className} z-10 flex w-10/12 flex-col items-center justify-center gap-8 rounded-xl border border-sky-500 bg-transparent py-5 shadow-glow shadow-sky-500 md:w-3/6 md:py-10 lg:w-4/12 xl:w-3/12`}
      onSubmit={handleSubmit}
    >
      <h2 className="font-sans text-2xl font-bold text-sky-400 md:text-4xl">
        {register ? "Register" : "Login"}
      </h2>
      <div className="flex w-full flex-col items-center justify-center gap-3">
        {register && (
          <div className="flex w-9/12 flex-col gap-2 md:gap-3">
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
        <div className="flex w-9/12 flex-col gap-2 md:gap-3">
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
      <ShinyButton
        onClick={() => setFailure(undefined)}
        className="w-32 font-semibold"
        textStyle="py-2"
        type="submit"
        text={register ? "Register" : "Login"}
      />
      {loading && (
        <AiOutlineLoading className="h-8 w-8 animate-spin text-sky-500" />
      )}
      <div className="flex gap-1">
        <p className="text-sm md:text-md">
          {register ? "Already have an account?" : "Don't have an account?"}
        </p>
        <Link
          className="font-bold text-sky-500 text-sm md:text-md"
          href={register ? "/login" : "/register"}
        >
          {register ? " Login " : " Register "}
        </Link>
      </div>
      {failure && (
        <Alert
        error
          progress={progress}
          message={failure}
        />
      )}
    </form>
  );
}
