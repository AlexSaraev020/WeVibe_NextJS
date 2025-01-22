import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Mingzat } from "next/font/google";
import Nav from "@/components/nav/nav";
import { UserNavDataContextProvider } from "@/contexts/user/userNavContext";
import { AlertContextProvider } from "@/contexts/alert/alertContext";
import Alert from "@/components/popups/alert";
import { PostsNavContextProvider } from "@/contexts/posts/postsNavContext";
import Head from "next/head";
export const metadata: Metadata = {
  title: "WeVibe",
  description: "Meet new people to vibe with",
  icons: {
    icon: "/icons/WeVibe.png",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 3,
  userScalable: true,
  viewportFit: 'contain',
}

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
      <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes" />
      </Head>
      <body
        suppressHydrationWarning={true}
        className={`${mingzat.className} relative scrollbar-none`}
      >
        <AlertContextProvider>
          <UserNavDataContextProvider>
            <PostsNavContextProvider>
             <Nav/>
              {children}
              <Alert />
            </PostsNavContextProvider>
          </UserNavDataContextProvider>
        </AlertContextProvider>
        <div className="fixed top-0 z-[-2] min-h-screen w-screen animate-fadeIn bg-[radial-gradient(ellipse_60%_70%_at_50%_-20%,rgba(14,165,233,0.4),rgba(255,255,255,0))] transition-all duration-500" />
      </body>
    </html>
  );
}
