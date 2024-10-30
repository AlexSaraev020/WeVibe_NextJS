import type { Metadata } from "next";
import "./globals.css";
import { Mingzat } from "next/font/google";
import Nav from "@/components/nav/nav";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

export const metadata: Metadata = {
  title: "WeVibe",
  description: "Meet new people to vibe with",
};

const mingzat = Mingzat({
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="overflow-y-scroll bg-black text-white antialiased scrollbar-thin scrollbar-track-black scrollbar-thumb-black"
    >
      <body
        suppressHydrationWarning={true}
        className={`${mingzat.className} relative`}
      >
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Nav />
        {children}
        <div className="absolute transition-all duration-500 animate-fadeIn top-0 z-[-2] min-h-screen w-screen bg-[radial-gradient(ellipse_60%_60%_at_50%_-20%,rgba(14,165,233,0.3),rgba(255,255,255,0))]"/>
      </body>
    </html>
  );
}
