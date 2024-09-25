import type { Metadata } from "next";
import "./globals.css";
import { Mingzat } from "next/font/google";
import Nav from "@/components/nav/nav";

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
      <body className={`${mingzat.className}`}>
        <Nav />
        {children}
      </body>
    </html>
  );
}
