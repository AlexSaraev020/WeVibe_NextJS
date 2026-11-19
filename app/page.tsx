import Image from "next/image";
import { redirect } from "next/navigation";
import Logo from "@/public/icons/WeVibe.png";
import RootPageTerminal from "@/components/rootPageTerminal/rootPageTerminal";
import { CursorLight } from "@/components/wevibe/ui";
import { checkIsGuest } from "@/actions/guest/checkIsGuest";
import { getSignedInUserId } from "@/actions/user/isLoggedIn/getSignedInUserId";

export default async function Page() {
  /* middleware.ts used to send anyone holding an authToken cookie from / to /home,
     which stranded visitors whose token had expired or whose account was deleted.
     The decision lives here now, and it asks whether the session is real. */
  if (await getSignedInUserId()) redirect("/home");
  if ((await checkIsGuest()) === "true") redirect("/home");
  return (
    <main className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[560px] flex-col justify-center px-4 py-10 sm:px-6">
      <CursorLight />

      <div className="flex items-center gap-3">
        <Image src={Logo} alt="WeVibe logo" width={40} height={40} className="h-10 w-10 rounded-[10px]" />
        <p className="m-0 text-[var(--wv-text-xl)] font-semibold tracking-[-.015em] text-[var(--wv-ink)]">
          We<span className="text-[var(--wv-blue-text)]">Vibe</span>
        </p>
      </div>

      <h1 className="mt-6 mb-0 wv-display text-[var(--wv-ink)]">A feed of photos, one line each</h1>
      <p className="mt-3 mb-0 max-w-[52ch] text-[var(--wv-text-base)] leading-[1.6] text-[var(--wv-mid)]">
        Every post is one image and up to 350 characters. Sign in to post, comment and like, or keep
        reading as a guest.
      </p>

      <RootPageTerminal />
    </main>
  );
}
