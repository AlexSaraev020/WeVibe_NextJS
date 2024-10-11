import type { Metadata } from "next";
import "./globals.css";
import { Mingzat } from "next/font/google";
import Nav from "@/components/nav/nav";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import Particles from "@/components/background/particles";

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
      className="scrollbar-thin overflow-y-scroll scrollbar-thumb-black scrollbar-track-black  bg-black text-white antialiased"
    >
      <body suppressHydrationWarning={true} className={`${mingzat.className} relative`}>
      <Particles
        className="absolute inset-0 z-0 min-h-screen"
        quantity={200}
        ease={80}
        color={"#38bdf8"}
        refresh
      />
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Nav />
        {children}
      </body>
    </html>
  );
}
