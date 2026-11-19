import { getUserProfile } from "@/actions/user/getUserProfile";
import Profile from "@/components/wevibe/Profile";
import { Shell } from "@/components/wevibe/ui";

export default async function Page({
  params,
}: {
  params: Promise<{ user: string }>;
}) {
  const userId = (await params).user;
  const user = await getUserProfile(userId);

  if (!user?._id) {
    return (
      <Shell current="profile">
        <div className="wv-main wv-card p-5 sm:p-6">
          <h1 className="wv-display m-0 text-[var(--wv-ink)]">No such account</h1>
          <p className="wv-hint mt-3 max-w-[52ch]">
            <code>/api/user/getUserProfile?user={userId}</code> returned no user. The account was
            deleted, or the link is out of date.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a href="/people" className="wv-btn">Meet people</a>
            <a href="/home" className="wv-btn wv-btn--quiet">Back to the feed</a>
          </div>
        </div>
      </Shell>
    );
  }

  return <Profile userId={userId} user={user} />;
}
