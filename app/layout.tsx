import type { Metadata, Viewport } from "next";
import "./globals.css";
import "../components/wevibe/WeVibe.css";
import { Inter } from "next/font/google";
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
  width: "device-width",
  initialScale: 1,
  maximumScale: 3,
  userScalable: true,
  viewportFit: "contain",
};

/* one family for the whole app — Mingzat (serif) is gone. Swap the import if you license a brand face. */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--wv-font",
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
      className={`${inter.className} overflow-y-scroll scrollbar-none bg-[var(--wv-void)] text-[var(--wv-ink)] antialiased`}
    >
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes" />
      </Head>
      <body suppressHydrationWarning={true} className="scrollbar-none">
        <AlertContextProvider>
          <UserNavDataContextProvider>
            <PostsNavContextProvider>
              {children}
              <Alert />
            </PostsNavContextProvider>
          </UserNavDataContextProvider>
        </AlertContextProvider>
      </body>
    </html>
  );
}
