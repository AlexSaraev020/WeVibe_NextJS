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
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    {
      register
        ? await registerUser({
            userName,
            setShowAlert,
            email,
            password,
            setMessage,
            router,
          })
        : await loginUser({
            email,
            password,
            setMessage,
            setShowAlert,
            router,
          });
    }
  };
  useEffect(() => {
    setLoading(false);
  }, [message]);

  return (
    <>
      <form
        className={`${className} z-10 flex w-10/12 flex-col items-center justify-center gap-8 rounded-xl border-2 border-postBackground/60 bg-transparent py-5 shadow-glow shadow-postBackground/50 md:w-3/6 md:py-10 lg:w-4/12 xl:w-3/12`}
        onSubmit={handleSubmit}
      >
        <h2 className="font-sans text-2xl font-bold text-postBackground/90 md:text-4xl">
          {register ? "Register" : "Login"}
        </h2>
        <div className="flex w-full flex-col items-center justify-center gap-3">
          {register && (
            <div className="flex w-9/12 flex-col gap-2 md:gap-3">
              <FormInput
              ariaLabel="Enter your username"
                maxLength={50}
                minLength={3}
                onChange={(e) => setUserName(e.target.value)}
                type="text"
                name="Name"
                value={userName}
                id="name"
                placeholder="Enter your name"
                required
              />
            </div>
          )}
          <div className="flex w-9/12 flex-col gap-2 md:gap-3">
            <FormInput
            ariaLabel="Enter your email"
              maxLength={254}
              minLength={6}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              name="Email"
              id="email"
              placeholder="Enter your email"
              required
            />
            <FormInput
            ariaLabel="Enter your password"
              maxLength={64}
              minLength={8}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              name="Password"
              id="password"
              password
              placeholder="Enter your password"
              required
            />
          </div>
        </div>
        <ShinyButton
          onClick={() => setMessage(undefined)}
          className="w-32 font-semibold shadow-lg shadow-postBackground/20 hover:shadow-xl hover:shadow-postBackground/30"
          background="bg-gradient-to-tr from-black via-neutral-950 to-black py-2"
          type="submit"
          text={register ? "Register" : "Login"}
        />
        {loading && (
          <AiOutlineLoading className="h-8 w-8 animate-spin text-sky-500" />
        )}
        <div className="flex gap-1">
          <p className="md:text-md text-sm">
            {register ? "Already have an account?" : "Don't have an account?"}
          </p>
          <Link
            className="md:text-md text-sm font-bold text-postBackground/90"
            href={register ? "/login" : "/register"}
          >
            {register ? " Login " : " Register "}
          </Link>
        </div>
      </form>
      {showAlert && (
        <Alert
          error
          setShowAlert={setShowAlert}
          setMessage={setMessage}
          message={message}
        />
      )}
    </>
  );
}
