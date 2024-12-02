import type { Metadata } from "next";
import "./globals.css";
import { Mingzat } from "next/font/google";
import Nav from "@/components/nav/nav";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { UserNavDataContextProvider } from "@/contexts/user/userNavContext";
import { AlertContextProvider } from "@/contexts/alert/alertContext";
import Alert from "@/components/popups/alert";
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
      suppressHydrationWarning={true}
      className="overflow-y-scroll bg-black text-white antialiased scrollbar-none"
    >
      <body
        suppressHydrationWarning={true}
        className={`${mingzat.className} relative scrollbar-none`}
      >
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <AlertContextProvider>
        <UserNavDataContextProvider>
          <Nav />
          {children}
          <Alert/>
        </UserNavDataContextProvider>
        </AlertContextProvider>
        <div className="fixed top-0 z-[-2] min-h-screen w-screen animate-fadeIn bg-[radial-gradient(ellipse_60%_70%_at_50%_-20%,rgba(14,165,233,0.4),rgba(255,255,255,0))] transition-all duration-500" />
      </body>
    </html>
  );
}
