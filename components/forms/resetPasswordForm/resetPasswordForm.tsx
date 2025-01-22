"use client";
import React, { useEffect, useState } from "react";
import ShinyButton from "@/components/buttons/shinyButton";
import FormInput from "../formElements/input";
import { sendEmail } from "@/actions/auth/passwordReset/sendEmail";
import { verifyResetCode } from "@/actions/auth/passwordReset/verifyResetCode";
import { useAlert } from "@/contexts/alert/alertContext";
import { updatePassword } from "@/actions/auth/passwordReset/updatePassword";
import { useRouter } from "next/navigation";
import { chooseAnotherEmail } from "@/actions/auth/passwordReset/chooseAnotherEmail";
import { IoMdArrowRoundBack } from "react-icons/io";

interface ResetPasswordFormProps {
  encryptedCode: string | undefined;
  encryptedMail: string | undefined;
}

export default function ResetPasswordForm({
  encryptedCode,
  encryptedMail,
}: ResetPasswordFormProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [codeVerified, setCodeVerified] = useState<boolean>(false);
  const [password, setPassword] = useState<string | null>(null);
  const { setMessage, setError } = useAlert();
  const router = useRouter();
  const [disable, setDisable] = useState<boolean>(false);
  const [resetCode, setResetCode] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  useEffect(() => {
    if (encryptedCode && encryptedMail) {
      setEmailSent(true);
    }
  }, []);

  const handleCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    if(typeof window !== "undefined"){
      const value = e.target.value;

    if (/^\d$/.test(value)) {
      const newCode = [...resetCode];
      newCode[index] = value;
      setResetCode(newCode);
      if (index < resetCode.length - 1) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        nextInput?.focus();
      }
    } else {
      const newCode = [...resetCode];
      newCode[index] = "";
      setResetCode(newCode);
    }
    }
  };
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && resetCode[index] === "" && typeof window !== "undefined") {
      if (index > 0) {
        const prevInput = document.getElementById(`code-input-${index - 1}`);
        prevInput?.focus();

        const newCode = [...resetCode];
        newCode[index - 1] = "";
        setResetCode(newCode);
      }
    }
  };
  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisable(true);
    await sendEmail({ email, setMessage, setEmailSent, setError, setEmail });
    setTimeout(() => {
      setDisable(false);
    }, 3000);
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updatePassword({ setMessage, setError, password, router });
  };

  const handleCodeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = getCodeAsString();
    await verifyResetCode({
      code,
      setMessage,
      setError,
      setEmailSent,
      setCodeVerified,
    });
  };

  const getCodeAsString = () => resetCode.join("");

  const handleChooseAnotherMail = async () => {
    await chooseAnotherEmail({
      setMessage,
      setError,
      setEmailSent,
      setResetCode,
    });
  };

  return (
    <>
      <button
        type="button"
        aria-label="BackButton"
        id="backButton"
        className="absolute right-5 top-5 z-20 rounded-full border-2 border-postBackground/50 p-0 text-postBackground/90 md:p-1"
      >
        <IoMdArrowRoundBack className="h-8 w-8" onClick={() => router.back()} />
      </button>
      {!emailSent && !codeVerified && (
        <form
          onSubmit={handleEmailSubmit}
          className="z-10 mx-auto flex w-11/12 max-w-md flex-col items-center justify-center rounded-lg border-2 border-postBackground/60 bg-transparent p-5 shadow-glow shadow-postBackground/50 md:p-8"
        >
          <div className="w-full text-center">
            <h2 className="mb-4 font-sans text-2xl font-bold text-postBackground/90 md:text-3xl">
              Reset Your Password
            </h2>
            <p className="mt-2 text-sm text-gray-400/80 hover:text-postBackground/70 md:text-base">
              Enter your email, and we&apos;ll send you a link to reset your
              password.
            </p>
          </div>

          <div className="mt-4 w-full">
            <FormInput
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              required
              autoComplete="email"
              aria-label="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email || ""}
              minLength={6}
              maxLength={254}
              ariaLabel="Enter your email"
            />
          </div>

          <ShinyButton
            ariaLabel="SubmitResetPasswordForm"
            id="submitResetPasswordForm"
            disabled={disable}
            className="mt-5 w-full text-sm font-semibold shadow-lg shadow-postBackground/20 hover:shadow-xl hover:shadow-postBackground/30 md:text-base"
            background="bg-gradient-to-tr from-black via-neutral-950 to-black py-2"
            type="submit"
            text="Reset Password"
          />
        </form>
      )}
      {emailSent && !codeVerified && (
        <form
          onSubmit={handleCodeSubmit}
          className="z-10 mx-auto flex w-11/12 max-w-md flex-col items-center justify-center rounded-lg border-2 border-postBackground/60 bg-transparent p-5 shadow-glow shadow-postBackground/50 md:p-8"
        >
          <div className="w-full text-center">
            <h2 className="mb-4 font-sans text-2xl font-bold text-postBackground/90 md:text-3xl">
              Enter Your Code
            </h2>
            <p className="mt-2 text-sm text-gray-400/80 hover:text-postBackground/70 md:text-base">
              We&apos;ve sent you a code to your email (
              <span className="text-white">check also your spam</span>). Enter
              it below to reset your password. It expires in 10 minutes after
              you receive it.
            </p>
          </div>

          <div className="mt-6 flex w-full justify-center gap-2">
            {resetCode.map((digit, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                className="h-9 w-9 rounded-md border border-gray-300 bg-transparent text-center text-2xl text-white transition-all duration-500 focus:border-postBackground/70 focus:outline-none focus:ring-2 focus:ring-postBackground/50 md:h-12 md:w-12"
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
            <ShinyButton
              ariaLabel="SubmitCodeVerification"
              id="submitCodeVerification"
              className="mt-5 w-full text-sm font-semibold shadow-lg shadow-postBackground/20 hover:shadow-xl hover:shadow-postBackground/30 md:text-base"
              background="bg-gradient-to-tr from-black via-neutral-950 to-black py-2"
              type="submit"
              text="Verify Code"
            />
            <ShinyButton
              ariaLabel="ChooseAnotherMail"
              id="chooseAnotherMail"
              onClick={handleChooseAnotherMail}
              className="mt-5 w-full text-sm font-semibold shadow-lg shadow-white/20 hover:shadow-xl hover:shadow-white/30 md:text-base"
              type="button"
              bottomLineCollor="bg-gradient-to-r from-sky-500/0 via-white/70 to-sky-500/0"
              topLineColor="bg-gradient-to-r from-sky-500/0 via-white/70 to-sky-500/0"
              background="bg-gradient-to-tr from-black py-2 via-neutral-950 to-black"
              text="Choose another email"
            />
          </div>
        </form>
      )}
      {codeVerified && (
        <form
          onSubmit={handlePasswordChange}
          className="z-10 mx-auto flex w-11/12 max-w-md flex-col items-center justify-center rounded-lg border-2 border-postBackground/60 bg-transparent p-5 shadow-glow shadow-postBackground/50 md:p-8"
        >
          <div className="w-full text-center">
            <h2 className="mb-4 font-sans text-2xl font-bold text-postBackground/90 md:text-3xl">
              Enter your new password
            </h2>
            <p className="mt-2 text-sm text-gray-400/80 hover:text-postBackground/70 md:text-base">
              Your code has been verified. Enter your new password below.
            </p>
          </div>

          <FormInput
            className="mt-2 w-full rounded-md border border-gray-300 bg-transparent p-2 text-start text-white focus:border-postBackground/70 focus:outline-none focus:ring-2 focus:ring-postBackground/50"
            type="password"
            name="password"
            password
            id="password"
            placeholder="Enter your password"
            required
            autoComplete="none"
            aria-label="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            value={password || ""}
            minLength={8}
            maxLength={64}
            ariaLabel="Enter your email"
          />

          <ShinyButton
            ariaLabel="SubmitPasswordChange"
            id="submitPasswordChange"
            className="mt-5 w-full text-sm font-semibold shadow-lg shadow-postBackground/20 hover:shadow-xl hover:shadow-postBackground/30 md:text-base"
            background="bg-gradient-to-tr from-black via-neutral-950 to-black py-2"
            type="submit"
            text="Reset Password"
          />
        </form>
      )}
    </>
  );
}
