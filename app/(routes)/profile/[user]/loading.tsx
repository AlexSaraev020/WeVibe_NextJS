import { PostCardSkeleton, Shell } from "@/components/wevibe/ui";

/* the page waits on /api/user/getUserProfile on the server, so without this the screen you came
   from just sits there and the whole profile pops in at once. This holds the same shapes the real
   profile fills in: avatar, handle, bio, joined, stats, one button, the tab row, two cards. */
export default function Loading() {
  return (
    <Shell current="profile">
      <div className="wv-main wv-main--wide od-stack gap-6" aria-busy="true">
        <header className="wv-profile-head" aria-hidden="true">
          <span className="wv-skel h-20 w-20 rounded-full sm:h-24 sm:w-24" />
          <span className="od-fill od-stack gap-3">
            <span className="wv-skel block h-7 w-40" />
            <span className="wv-skel block h-4 w-2/3 max-w-[52ch]" />
            <span className="wv-skel block h-4 w-28" />
            <span className="wv-skel block h-5 w-52" />
            <span className="wv-skel block h-11 w-[104px]" />
          </span>
        </header>

        <div className="border-b border-[var(--wv-hair)] pb-3" aria-hidden="true">
          <span className="wv-skel block h-4 w-64" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-hidden="true">
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>

        <p className="sr-only m-0" role="status">Loading this profile…</p>
      </div>
    </Shell>
  );
}
