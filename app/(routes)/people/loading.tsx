import { PersonRowSkeleton, Shell } from "@/components/wevibe/ui";

/* the same shapes People fills in: a title line, a caption, and the four rows it already pulses
   while its own fetch runs. This covers the wait before the route answers at all. */
export default function Loading() {
  return (
    <Shell current="people">
      <div className="wv-main wv-main--wide od-stack gap-5" aria-busy="true">
        <div aria-hidden="true">
          <span className="wv-skel block h-8 w-44" />
          <span className="wv-skel mt-3 block h-4 w-2/3 max-w-[52ch]" />
        </div>
        <ul className="od-stack list-none m-0 p-0">
          <PersonRowSkeleton />
          <PersonRowSkeleton />
          <PersonRowSkeleton />
          <PersonRowSkeleton />
        </ul>
        <p className="sr-only m-0" role="status">Loading accounts…</p>
      </div>
    </Shell>
  );
}
