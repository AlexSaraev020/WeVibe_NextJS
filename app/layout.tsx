import type { Metadata } from "next";
import "./globals.css";
import { Mingzat } from 'next/font/google'
import Nav from "@/components/nav/nav";


export const metadata: Metadata = {
  title: "WeVibe",
  description: "Meet new people to vibe with",
};

const mingzat = Mingzat({
  subsets: ['latin'],
  weight: "400"
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mingzat.className} bg-black text-white antialiased flex flex-col md:flex-row`}
      >
        <Nav />
        {children}
      </body>
    </html>
  );
}
