'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Avatar, BTN, BTN_QUIET, BTN_PRIMARY, Count, FollowButton, PersonLink, PersonRowSkeleton,
  PostCard, PostCardSkeleton, Shell, VerifiedBadge, useMe,
} from './ui';
import type { Post } from './ui';
import { usePostsNav } from '@/contexts/posts/postsNavContext';
import { getPosts } from '@/actions/posts/getPosts';
import { createPost } from '@/actions/posts/createPost';
import Upload from '@/components/uploadImage/upload';
import { getUsersByQuery } from '@/actions/user/searchUser';
import type { ImageType } from '@/types/image/imageType';
import type { PostType } from '@/types/post/postType';
import type { UserType } from '@/types/userTypes/user/userType';

/* actions/auth/validateFieldsLength is what /api/posts/create actually enforces */
const MAX_TITLE = 50;
const MAX_DESCRIPTION = 300;
const LIMIT = MAX_TITLE + MAX_DESCRIPTION;
const PAGE = 8;
const SUGGESTIONS = 5;

const since = (iso: string) => {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  if (mins < 1440) return `${Math.round(mins / 60)}h`;
  return `${Math.round(mins / 1440)}d`;
};

const commentCount = (c: PostType['comments']) => (Array.isArray(c) ? c.length : Number(c ?? 0));

const toPost = (p: PostType): Post => ({
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
  comments: commentCount(p.comments),
  likedByMe: p.likedByMe ?? false,
  image: p.image?.url || undefined,
});

/* the API stores title and description separately; the first line typed is the title,
   the rest is the description, so the round trip is what the author actually typed */
const splitPost = (text: string) => {
  const nl = text.indexOf('\n');
  if (nl > 0) return { title: text.slice(0, nl).trim(), description: text.slice(nl + 1).trim() };
  return { title: text.trim(), description: '' };
};

export function HomeFeed() {
  const { posts, setPosts } = usePostsNav();
  const [draft, setDraft] = useState('');
  /* the composer is opened from the rail; it is not a permanent card at the top of the feed */
  const [composing, setComposing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'posted'>('idle');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<string | undefined>('');
  /* starts true: the first paint would otherwise read "Nothing published yet" for a moment on a
     feed that has plenty to show */
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [failed, setFailed] = useState(false);
  const [image, setImage] = useState<ImageType | undefined>(undefined);
  const [progress, setProgress] = useState(0);
  const [people, setPeople] = useState<UserType[]>([]);
  const [peopleLoading, setPeopleLoading] = useState(true);
  const me = useMe();
  const seen = useRef(new Set<string>());
  const recent = useRef<string[]>([]);
  const emptyStreak = useRef(0);
  const loadingRef = useRef(false);
  const sentinel = useRef<HTMLDivElement>(null);

  const left = LIMIT - draft.length;

  /* The guard lives in a ref so this callback keeps one identity. When it changed on every
     loading flip the observer was rebuilt, fired again for the strip that was already on
     screen, and asked for a batch the page had — that request loop was the flicker. */
  const load = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    const fetched = await getPosts({
      limit: PAGE,
      seen: [...seen.current],
      setHasMore,
      /* the server ran out of unseen posts and started a new shuffled deck */
      setNewDeck: (fresh) => { if (fresh) seen.current = new Set(); },
      setLoading,
    });
    /* getPosts hands back an array on success and the API's error body when the call fails */
    if (Array.isArray(fetched)) {
      const fresh = fetched.filter((p) => !recent.current.includes(p._id));
      if (fresh.length) {
        emptyStreak.current = 0;
        for (const p of fetched) seen.current.add(p._id);
        recent.current = [...recent.current, ...fresh.map((p) => p._id)].slice(-16);
        setPosts((prev) => [...prev, ...fresh]);
      } else {
        /* two empty attempts in a row means the site genuinely has nothing more to show */
        emptyStreak.current += 1;
        if (emptyStreak.current > 2) setHasMore(false);
      }
      setFailed(false);
    } else {
      setFailed(true);
      setHasMore(false);
      setNotice(fetched?.message ?? 'The feed request failed. Check MONGODB_URI.');
    }
    loadingRef.current = false;
    setLoading(false);
  }, [hasMore, setPosts]);

  useEffect(() => {
    /* the post list lives in a context that outlives this component, so a re-mount (back from
       /people, Fast Refresh) starts with what is already on screen and does not repeat it */
    for (const p of posts) seen.current.add(p._id);
    recent.current = posts.slice(-16).map((p) => p._id);
    load();
  }, []);

  /* the people route answers an empty query with everyone, most-followed first — that is the
     companion column, no second endpoint and nothing invented */
  useEffect(() => {
    let alive = true;
    getUsersByQuery('')
      .then((response) => { if (alive && Array.isArray(response?.users)) setPeople(response.users); })
      .finally(() => { if (alive) setPeopleLoading(false); });
    return () => { alive = false; };
  }, []);

  /* the next batch is requested while the last one is still on screen */
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => { if (entries.some((entry) => entry.isIntersecting)) load(); },
      { rootMargin: '800px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [load]);

  const publish = async () => {
    const text = draft.trim();
    if (!text) { setError('Say something first — an empty post never reaches anyone.'); return; }
    if (!image) { setError('Pick an image first: /api/posts/create answers 400 “Please upload an image”.'); return; }
    const { title, description } = splitPost(text);
    if (title.length < 2) { setError('The first line becomes the title. Give it at least 2 characters.'); return; }
    if (title.length > MAX_TITLE) { setError(`That title is ${title.length} characters. Keep the first line under ${MAX_TITLE} and continue on the next one.`); return; }
    if (description.length > MAX_DESCRIPTION) { setError(`That body is ${description.length} characters. The API stores at most ${MAX_DESCRIPTION}.`); return; }
    setError('');
    setNotice('');
    setStatus('sending');
    const failure = await createPost({
      title,
      description,
      image,
      setPosts,
      setMessage: setNotice,
      setError: () => {},
      setShowCreatePost: () => {},
      setDisabled: () => {},
    });
    if (!failure) { setDraft(''); setImage(undefined); setProgress(0); setComposing(false); }
    setStatus('idle');
  };

  const suggestions = people.filter((u) => u._id !== me?._id).slice(0, SUGGESTIONS);

  return (
    <Shell current="feed" onCompose={() => setComposing(true)}>
      <div className="wv-cols">
        {/* ── the feed ────────────────────────────────────────────────────────── */}
        <div className="od-stack min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h1 className="wv-display m-0 text-[var(--wv-ink)]">Feed</h1>
            {/* no rail on phones, so the composer needs a way in from the page itself */}
            {composing ? null : (
              <button type="button" onClick={() => setComposing(true)} className={`${BTN} wv-compose-cta`}>New post</button>
            )}
          </div>

          {composing ? (
          <section aria-labelledby="composer-label" className="wv-card wv-post">
            <div className="wv-post-body">
              <h2 id="composer-label" className="wv-title m-0 text-[var(--wv-ink)]">New post</h2>
              <label htmlFor="composer" className="wv-hint mt-2">
                Title on the first line, up to {MAX_TITLE}. The rest is the body, up to {MAX_DESCRIPTION}.
              </label>
              <textarea
                id="composer"
                rows={3}
                value={draft}
                maxLength={LIMIT + 40}
                onChange={(e) => { setDraft(e.target.value); if (error) setError(''); }}
                onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') publish(); }}
                placeholder="What is the vibe right now?"
                className="wv-input mt-1"
                aria-describedby="composer-count composer-error"
              />
            </div>

            <div className="wv-post-pad mt-4">
              <Upload
                image={image}
                setImage={setImage}
                setProgress={setProgress}
                setMessage={(m) => setNotice(m ?? '')}
                setError={(on) => setError(on ? 'That file was refused — images stop in size at 2 MB.' : '')}
              />
              <p className="wv-hint mt-2">
                {image ? 'Photo ready. A post without one is refused.' : 'A photo is required — every post on WeVibe carries one.'}
              </p>
            </div>

            <div className="wv-post-actions">
              <span id="composer-count" className={`wv-num wv-num--sm ${left < 40 ? 'text-[var(--wv-blue-text)]' : ''}`}>{left}</span>
              <span className="wv-cap ml-1.5">characters left</span>
              {error ? <span id="composer-error" className="wv-error ml-3 max-w-[38ch]" role="alert">{error}</span> : null}
              <button type="button" onClick={() => setComposing(false)} className={`${BTN} ml-auto`}>Close</button>
              <button type="button" onClick={publish} disabled={status === 'sending'} className={`${BTN_PRIMARY} ml-2`}>
                {status === 'sending' ? 'Posting…' : 'Post'}
              </button>
            </div>
            {notice ? <p className="wv-cap wv-post-pad mb-0 pb-5 pt-4 text-[var(--wv-blue-text)]" role="status">{notice}</p> : null}
          </section>
          ) : null}

          {posts.length ? (
            <div className="od-stack gap-3">
              {/* the deck can hand the same post again after a restart, so the key is the slot
                  in the list rather than the post id — a duplicate stays a separate card */}
              {posts.map((p, i) => <PostCard key={`${p._id}-${i}`} post={toPost(p)} />)}
            </div>
          ) : loading ? (
            <div className="od-stack gap-3"><PostCardSkeleton /><PostCardSkeleton /></div>
          ) : failed ? (
            <div className="wv-card p-5">
              <h2 className="wv-title m-0 text-[var(--wv-ink)]">No posts loaded</h2>
              <p className="wv-hint mt-2 max-w-[52ch]">
                <code>/api/posts/get</code> answered nothing. Their API reads from MongoDB, so this needs <code>MONGODB_URI</code>.
              </p>
              <button type="button" onClick={load} className={`${BTN} mt-4`}>Try again</button>
            </div>
          ) : (
            <div className="wv-card p-5">
              <h2 className="wv-title m-0 text-[var(--wv-ink)]">Nothing published yet</h2>
              <p className="wv-hint mt-2 max-w-[52ch]">Write the first line above and it lands here.</p>
            </div>
          )}

          {/* empty on purpose: this is the strip that asks for the next batch on its way in */}
          <div ref={sentinel} className="wv-feed-tail">
            {loading && posts.length ? <div className="od-stack gap-3"><PostCardSkeleton /><PostCardSkeleton /></div> : null}
          </div>
          {!hasMore && posts.length ? <p className="wv-cap m-0">That is the whole feed for now.</p> : null}
        </div>

        {/* ── companion column: desktop only, and only real accounts in it ───── */}
        <aside className="wv-aside" aria-label="Your account and who to follow">
          {me === undefined ? (
            <div className="wv-card wv-aside-card" aria-hidden="true">
              <span className="wv-skel block h-11 w-11 rounded-full" />
              <span className="wv-skel mt-3 block h-4 w-32" />
              <span className="wv-skel mt-2 block h-4 w-24" />
            </div>
          ) : me ? (
            <div className="wv-card wv-aside-card od-stack">
              <div className="flex items-center gap-3">
                <Avatar handle={me.username ?? 'me'} name={me.username ?? 'Your profile'} size="md" src={me.image?.url} />
                <div className="min-w-0">
                  <a href={`/profile/${me._id}`} className="od-truncate text-[var(--wv-text-base)] font-semibold text-[var(--wv-ink)] no-underline hover:text-[var(--wv-blue-text)]">
                    {me.username}
                  </a>
                  <p className="wv-cap m-0">@{me.username}{me.verified ? ' · verified' : ''}</p>
                </div>
                {me.verified ? <VerifiedBadge /> : null}
              </div>
              <a href={`/profile/${me._id}`} className={`${BTN_QUIET} self-start`}>Open your profile</a>
            </div>
          ) : (
            <div className="wv-card wv-aside-card od-stack">
              <h2 className="wv-title m-0 text-[var(--wv-ink)]">Reading as a visitor</h2>
              <p className="wv-hint m-0">Likes, comments and posting need an account. The feed itself stays open.</p>
              <a href="/auth/login" className={`${BTN_PRIMARY} w-full`}>Sign in</a>
              <a href="/auth/register" className={`${BTN_QUIET} self-start`}>Create an account</a>
            </div>
          )}

          {peopleLoading ? (
            <ul className="od-stack list-none m-0 p-0" aria-hidden="true">
              <PersonRowSkeleton compact />
              <PersonRowSkeleton compact />
              <PersonRowSkeleton compact />
            </ul>
          ) : suggestions.length ? (
            <section className="wv-card wv-aside-card od-stack" aria-labelledby="who-to-follow">
              <h2 id="who-to-follow" className="wv-title m-0 text-[var(--wv-ink)]">Who to follow</h2>
              <ul className="od-stack list-none m-0 p-0">
                {suggestions.map((u) => (
                  <li key={u._id} className="wv-row wv-row--compact">
                    <PersonLink
                      id={u._id}
                      name={u.username}
                      src={u.image?.url}
                      badge={u.verified ? <VerifiedBadge size="[--od-icon-size:1rem]" /> : null}
                      extra={<span className="wv-cap block"><Count value={u.followers ?? 0} label="followers" size="sm" /></span>}
                    />
                    <FollowButton userId={u._id} following={u.followedBy} />
                  </li>
                ))}
              </ul>
              <a href="/people" className={`${BTN_QUIET} self-start`}>See all accounts</a>
            </section>
          ) : (
            <div className="wv-card wv-aside-card">
              <h2 className="wv-title m-0 text-[var(--wv-ink)]">Nobody to suggest yet</h2>
              <p className="wv-hint mt-2 m-0">When accounts join WeVibe they appear here, most-followed first.</p>
            </div>
          )}

          <p className="wv-cap m-0">The feed arrives in batches of {PAGE} and keeps loading as you scroll.</p>
        </aside>
      </div>
    </Shell>
  );
}

export default HomeFeed;
