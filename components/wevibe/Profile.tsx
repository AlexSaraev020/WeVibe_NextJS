'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Avatar, BTN, Count, FollowButton, PersonLink, PersonRowSkeleton, PostCard, PostCardSkeleton,
  Shell, VerifiedBadge, useMe,
} from './ui';
import AccountPanel, { AccountCog, type AccountOpen } from './AccountPanel';
import { getProfilePosts } from '@/actions/profile/getProfilePosts';
import { getAllFollowers } from '@/actions/profile/getAllFollowers';
import { getAllFollowing } from '@/actions/profile/getAllFollowing';
import type { PostType } from '@/types/post/postType';
import type { UserType } from '@/types/userTypes/user/userType';

/* same batch size as the feed deck */
const PAGE = 8;

const since = (iso: string) => {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  if (mins < 1440) return `${Math.round(mins / 60)}h`;
  return `${Math.round(mins / 1440)}d`;
};

const toPost = (p: PostType) => ({
  id: p._id,
  authorId: p.createdBy?._id,
  handle: p.createdBy?.username ?? 'unknown',
  name: p.createdBy?.username ?? 'Unknown',
  avatar: p.createdBy?.image?.url || undefined,
  verified: p.createdBy?.verified ?? false,
  when: since(p.createdAt),
  date: p.createdAt,
  body: [p.title, p.description].filter(Boolean).join('\n'),
  likes: Array.isArray(p.likes) ? p.likes.length : Number(p.likes ?? 0),
  comments: Array.isArray(p.comments) ? p.comments.length : Number(p.comments ?? 0),
  likedByMe: p.likedByMe ?? false,
  image: p.image?.url || undefined,
});

/* UTC so the server render and the client render agree on the same month name */
const joinedOn = (when: string | Date) =>
  new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(when));

type Tab = 'posts' | 'media' | 'followers' | 'following';

export function Profile({ userId, user }: { userId: string; user: UserType }) {
  const [tab, setTab] = useState<Tab>('posts');
  /* which card the cog up in the header asked for; the cog and the cards are one control split
     across two places, so the choice lives here and the requests stay in AccountPanel */
  const [account, setAccount] = useState<AccountOpen>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  /* starts true: the first paint (server render, before the fetch even begins) would otherwise
     read "no posts yet" for a second on an account that has plenty */
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  /* counts the batches asked for; it only exists so the effect below can re-arm the strip */
  const [tick, setTick] = useState(0);
  const me = useMe();
  const skip = useRef(0);
  /* the guard lives in a ref so load keeps one identity: when it changed on every loading flip
     the observer was rebuilt and re-fired for a strip already on screen (that loop was the flicker
     in the feed) */
  const loadingRef = useRef(false);
  /* hasMore also lives in a ref: load must read the current value inside its own walk, and a state
     read from the closure is the value the render had when load was built */
  const hasMoreRef = useRef(true);
  const sentinel = useRef<HTMLDivElement>(null);
  const [people, setPeople] = useState<UserType[]>([]);
  const [peopleLoading, setPeopleLoading] = useState(false);
  /* a ref rather than state: switching tabs resets the list and loads at once, and a
     setState call in the same click would still be the old value inside loadPeople */
  const peopleRef = useRef({ skip: 0, hasMore: true });

  const loadPeople = useCallback(async (which: 'followers' | 'following') => {
    if (peopleLoading || !peopleRef.current.hasMore) return;
    setPeopleLoading(true);
    const args = {
      userId,
      skip: peopleRef.current.skip,
      limit: PAGE,
      setLoading: setPeopleLoading,
      setSkip: (updater: (prev: number) => number) => { peopleRef.current.skip = updater(peopleRef.current.skip); },
      setHasMore: (value: boolean) => { peopleRef.current.hasMore = value; },
    };
    const fetched = which === 'followers' ? await getAllFollowers(args) : await getAllFollowing(args);
    if (Array.isArray(fetched)) setPeople((prev) => [...prev, ...fetched]);
    setPeopleLoading(false);
  }, [peopleLoading, userId]);

  const selectTab = (next: Tab) => {
    if (next === tab) return;
    setTab(next);
    if (next === 'followers' || next === 'following') {
      peopleRef.current = { skip: 0, hasMore: true };
      setPeople([]);
      loadPeople(next);
    }
  };

  const load = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    const fetched = await getProfilePosts({
      userId,
      skip: skip.current,
      limit: PAGE,
      setSkip: (updater) => { skip.current = updater(skip.current); },
      setHasMore: (value) => { hasMoreRef.current = value; setHasMore(value); },
      setLoading,
    });
    loadingRef.current = false;
    setLoading(false);
    /* the action hands back the API's error body when the call fails, not an array */
    if (!Array.isArray(fetched)) return;
    setPosts((prev) => [...prev, ...fetched]);
    /* re-arms the strip below: a batch can leave it inside the 800px trigger band (With-media can
       spend a whole batch on posts with no photo, and a 7-post account fits one screen), and an
       observer only ever reports a change */
    setTick((n) => n + 1);
  }, [userId]);

  useEffect(() => { load(); }, []);

  /* the next batch is asked for while the last one is still on screen, exactly as in the feed */
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => { if (entries.some((entry) => entry.isIntersecting)) load(); },
      { rootMargin: '800px 0px' },
    );
    io.observe(el);
    /* tab: the strip is unmounted while a Followers/Following list is open and has to be watched
       again when the posts tab comes back; tick: see load */
    return () => io.disconnect();
  }, [load, tab, tick]);

  const shown = posts.map(toPost).filter((p) => (tab === 'media' ? Boolean(p.image) : true));
  const isOwnProfile = me?._id === userId;
  const peopleTab = tab === 'followers' || tab === 'following';

  return (
    <Shell current="profile">
      <div className="wv-main wv-main--wide od-stack gap-6">
        <header className="wv-profile-head">
          <Avatar handle={user.username} name={user.username} size="xl" src={user.image?.url} />
          <div className="od-stack min-w-0">
            <div className="flex items-start gap-2">
              <h1 className="wv-handle m-0 mr-auto inline-flex min-w-0 flex-wrap items-center gap-2 text-[var(--wv-ink)]">
                {user.username}
                {user.verified ? <VerifiedBadge size="[--od-icon-size:1.35rem]" /> : null}
              </h1>
              {/* the box to the right of the name is the cog's, always the same size: the session needs
                  a beat to say whether this visitor is the owner, and the header must not shift when it
                  answers — so it pulses here, becomes the cog on your own profile, closes on anyone else's */}
              <span className="grid h-11 w-11 shrink-0 place-items-center">
                {me === undefined ? (
                  <span className="wv-skel block h-11 w-11 rounded-[10px]" aria-hidden="true" />
                ) : isOwnProfile ? (
                  <AccountCog setOpen={setAccount} />
                ) : null}
              </span>
            </div>
            <p className="m-0 max-w-[65ch] text-[var(--wv-text-base)] leading-[1.6] text-[var(--wv-mid)]">
              {user.bio || 'No bio yet.'}
            </p>
            <p className="wv-cap m-0">Joined {joinedOn(user.createdAt)}</p>
            <p className="wv-stats">
              <Count value={user.posts ?? 0} label="posts" size="md" />
              <Count value={user.followers ?? 0} label="followers" size="md" />
              <Count value={user.following ?? 0} label="following" size="md" />
            </p>
            <div className="flex flex-wrap gap-2">
              {/* only the session says whether this is your own profile, so until it answers the two
                  buttons are one pulse block the width of the pair: no Follow is ever painted on your
                  own page, and "Find accounts" does not arrive by itself a beat later */}
              {me === undefined ? (
                <span className="wv-skel h-11 w-[min(244px,100%)]" aria-hidden="true" />
              ) : (
                <>
                  {isOwnProfile ? null : <FollowButton userId={userId} />}
                  <a href="/search" className={BTN}>Find accounts</a>
                </>
              )}
            </div>
          </div>
        </header>

        {/* mounted only when a card is actually out: an empty one would still be a child of the stack
            and its 24px gap would push the tabs down for no reason */}
        {isOwnProfile && account ? <AccountPanel user={user} open={account} setOpen={setAccount} /> : null}

        <nav aria-label="Profile sections" className="border-b border-[var(--wv-hair)]">
          <div role="tablist" aria-label="Profile content" className="wv-profile-tabs flex">
            <button type="button" role="tab" id="tab-posts" aria-selected={tab === 'posts'} aria-controls="profile-stream" onClick={() => selectTab('posts')} className="wv-tab">
              Posts <Count value={user.posts ?? 0} size="sm" />
            </button>
            <button type="button" role="tab" id="tab-media" aria-selected={tab === 'media'} aria-controls="profile-stream" onClick={() => selectTab('media')} className="wv-tab">
              With media <Count value={posts.filter((p) => p.image?.url).length} size="sm" />
            </button>
            <button type="button" role="tab" id="tab-followers" aria-selected={tab === 'followers'} aria-controls="profile-stream" onClick={() => selectTab('followers')} className="wv-tab">
              Followers <Count value={user.followers ?? 0} size="sm" />
            </button>
            <button type="button" role="tab" id="tab-following" aria-selected={tab === 'following'} aria-controls="profile-stream" onClick={() => selectTab('following')} className="wv-tab">
              Following <Count value={user.following ?? 0} size="sm" />
            </button>
          </div>
        </nav>

        {peopleTab ? (
          <div id="profile-stream" role="tabpanel" aria-labelledby={`tab-${tab}`}>
            {people.length ? (
              <ul className="od-stack list-none m-0 p-0">
                {people.map((p) => (
                  <li key={p._id} className="wv-row">
                    <PersonLink id={p._id} name={p.username} src={p.image?.url} size="md" badge={p.verified ? <VerifiedBadge /> : null} />
                    <FollowButton userId={p._id} following={p.followedBy} />
                  </li>
                ))}
              </ul>
            ) : peopleLoading ? (
              <ul className="od-stack list-none m-0 p-0">
                <PersonRowSkeleton />
                <PersonRowSkeleton />
                <PersonRowSkeleton />
              </ul>
            ) : (
              <div className="wv-card p-5">
                <h2 className="wv-title m-0 text-[var(--wv-ink)]">{tab === 'followers' ? 'No followers yet' : 'Not following anyone yet'}</h2>
                <p className="wv-hint mt-2 m-0 max-w-[52ch]">
                  {tab === 'followers'
                    ? 'Nobody follows this account yet. Following someone is how that starts.'
                    : 'This account follows nobody yet. Meet people is a good place to start.'}
                </p>
                <a href="/people" className={`${BTN} mt-4`}>Meet people</a>
              </div>
            )}
            {peopleRef.current.hasMore && people.length ? (
              <button type="button" onClick={() => loadPeople(tab as 'followers' | 'following')} disabled={peopleLoading} className={`${BTN} mt-4 w-full`}>
                {peopleLoading ? 'Loading…' : `Load ${PAGE} more`}
              </button>
            ) : null}
          </div>
        ) : (
          <>
            <div id="profile-stream" role="tabpanel" aria-labelledby={`tab-${tab}`} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {shown.length ? (
                shown.map((p) => <PostCard key={p.id} post={p} />)
              ) : loading ? (
                <>
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                </>
              ) : (
                <div className="wv-card p-5 sm:col-span-2">
                  <h2 className="wv-title m-0 text-[var(--wv-ink)]">{tab === 'media' ? 'No photos yet' : 'No posts yet'}</h2>
                  <p className="wv-hint mt-2 m-0 max-w-[52ch]">
                    {/* the visitor line asks you to follow the account — on your own profile that is
                        nonsense, so the two say different things */}
                    {tab === 'media'
                      ? isOwnProfile ? 'You have no posts with an image yet.' : 'This account has no posts with an image yet.'
                      : isOwnProfile ? 'You have not posted yet. The composer sits at the top of the feed.' : 'No posts found for this account. Follow it to get them in your feed.'}
                  </p>
                </div>
              )}
            </div>

            {/* empty on purpose: this is the strip that asks for the next batch on its way in */}
            <div ref={sentinel} className="wv-feed-tail">
              {loading && shown.length ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                </div>
              ) : null}
            </div>
            {!hasMore && shown.length ? <p className="wv-cap m-0">{user.posts ?? shown.length} posts, that is the whole account.</p> : null}
          </>
        )}
      </div>
    </Shell>
  );
}

export default Profile;
