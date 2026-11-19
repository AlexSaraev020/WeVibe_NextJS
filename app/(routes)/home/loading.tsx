import { PersonRowSkeleton, PostCardSkeleton, Shell } from "@/components/wevibe/ui";

/* the same shapes HomeFeed fills in: a title line, the deck, and the companion column that only
   desktop draws. Without this the browser waits on a blank page while the route resolves. */
export default function Loading() {
  return (
    <Shell current="feed">
      <div className="wv-cols" aria-busy="true">
        <div className="od-stack min-w-0">
          <span className="wv-skel block h-8 w-24" aria-hidden="true" />
          <div className="od-stack gap-3" aria-hidden="true">
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        </div>

        <aside className="wv-aside" aria-hidden="true">
          <div className="wv-card wv-aside-card">
            <span className="wv-skel block h-11 w-11 rounded-full" />
            <span className="wv-skel mt-3 block h-4 w-32" />
            <span className="wv-skel mt-2 block h-4 w-24" />
          </div>
          <ul className="od-stack list-none m-0 p-0">
            <PersonRowSkeleton compact />
            <PersonRowSkeleton compact />
            <PersonRowSkeleton compact />
          </ul>
        </aside>

        <p className="sr-only m-0" role="status">Loading the feed…</p>
      </div>
    </Shell>
  );
}
