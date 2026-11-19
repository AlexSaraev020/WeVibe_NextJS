'use client';

import './WeVibe.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { followUser } from '@/actions/profile/following/follow';
import { unfollowUser } from '@/actions/profile/following/unfollow';
import { allowFollowing } from '@/actions/profile/following/allowFollowing';
import type { AllowTypes } from '@/types/userTypes/user/userType';
import type { ReactNode } from 'react';
import { handleLike } from '@/actions/posts/handleLike/handleLike';
import { addComment } from '@/actions/posts/comments/addComment';
import { getComments } from '@/actions/posts/comments/getComments';
import { getReplies } from '@/actions/posts/comments/replies/getReplies';
import { getUser } from '@/actions/user/searchUser';
import { useAlert } from '@/contexts/alert/alertContext';
import type { CommentType } from '@/types/post/comments/commentsType';
import type { RepliesType } from '@/types/post/comments/replies/repliesType';

/* a post as the cards consume it. Every field here maps to /api/posts/get; the card reads
   nothing else, so a card cannot show something the API never sent. */
export type Post = {
  id: string;
  authorId?: string;
  handle: string;
  name: string;
  avatar?: string;
  verified?: boolean;
  /** relative label already worked out by the screen that fetched the post: '4m', '3h', '2d' */
  when: string;
  /** the raw ISO date, kept for <time dateTime> so the exact moment is one hover away */
  date: string;
  body: string;
  likes: number;
  comments: number;
  likedByMe?: boolean;
  image?: string;
};

export type Person = {
  id: string;
  handle: string;
  name: string;
  bio: string;
  /** /api/user/searchUser does not always return follower counts, so this is optional */
  followers?: number;
};

/* hrefs are the routes this app actually has. PROFILE resolves to the signed-in user's
   Mongo id (see WeVibeNav); until that resolves it goes to the auth screen. */
export const ROUTES = [
  { id: 'feed', label: 'Feed', icon: 'home', href: '/home' },
  { id: 'people', label: 'Meet people', icon: 'people', href: '/people' },
  { id: 'search', label: 'Search', icon: 'search', href: '/search' },
  { id: 'profile', label: 'Profile', icon: 'user', href: '/auth/login' },
  { id: 'auth', label: 'Sign in', icon: 'login', href: '/auth/login' },
] as const;

export type ScreenId = (typeof ROUTES)[number]['id'];

/* one button language for the whole app, defined once in WeVibe.css so the screens outside
   this folder (alert, rootPageTerminal, upload) get the same surfaces */
export const BTN = 'wv-btn';
export const BTN_PRIMARY = 'wv-btn wv-btn--primary';
export const BTN_QUIET = 'wv-btn wv-btn--quiet';
export const BTN_DANGER = 'wv-btn wv-btn--danger';

/* ── icon family: outlined, 1.75 stroke, 24 grid, sized by --od-icon-size ─────── */

function Glyph({ children, size }: { children: ReactNode; size?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`od-icon ${size ?? '[--od-icon-size:1.15rem]'}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export const IconHeart = ({ filled, size }: { filled?: boolean; size?: string }) => (
  <Glyph size={size}>
    <path d="M12 20.2C7.4 17 4.6 14 4.6 11a3.9 3.9 0 0 1 7.4-1.8 3.9 3.9 0 0 1 7.4 1.8c0 3-2.8 6-7.4 9.2Z" fill={filled ? 'currentColor' : 'none'} />
  </Glyph>
);
export const IconComment = ({ size }: { size?: string }) => (
  <Glyph size={size}>
    <path d="M4 6.5h16v10H12l-5 3.5v-3.5H4v-10Z" />
  </Glyph>
);
export const IconShare = ({ size }: { size?: string }) => (
  <Glyph size={size}>
    <path d="M12 16.5V4.5M8 8l4-3.5L16 8M5 14v5.5h14V14" />
  </Glyph>
);
export const IconSearch = ({ size }: { size?: string }) => (
  <Glyph size={size}>
    <circle cx="11" cy="11" r="6" />
    <path d="m15.5 15.5 4 4" />
  </Glyph>
);
export const IconCheck = ({ size }: { size?: string }) => (
  <Glyph size={size}>
    <path d="m4.5 12.5 5 5 10-11" />
  </Glyph>
);
export const IconClose = ({ size }: { size?: string }) => (
  <Glyph size={size}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Glyph>
);
export const IconEye = ({ off, size }: { off?: boolean; size?: string }) => (
  <Glyph size={size}>
    <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.6" />
    {off ? <path d="M4 20 20 4" /> : null}
  </Glyph>
);
export const IconUser = ({ size }: { size?: string }) => (
  <Glyph size={size}>
    <circle cx="12" cy="9" r="3.5" />
    <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
  </Glyph>
);
export const IconHome = ({ size }: { size?: string }) => (
  <Glyph size={size}>
    <path d="M3.5 11 12 4l8.5 7M6 9.5V20h12V9.5" />
  </Glyph>
);
export const IconLogin = ({ size }: { size?: string }) => (
  <Glyph size={size}>
    <path d="M14 4h5.5v16H14M10 8l4 4-4 4M4 12h10" />
  </Glyph>
);
export const IconLogout = ({ size }: { size?: string }) => (
  <Glyph size={size}>
    <path d="M10 4H4.5v16H10M14 8l4 4-4 4M6 12h12" />
  </Glyph>
);
export const IconPlus = ({ size }: { size?: string }) => (
  <Glyph size={size}>
    <path d="M12 5.5v13M5.5 12h13" />
  </Glyph>
);
/* six straight-flank teeth, not the rounded Lucide gear: at 20px the rounded one blends its own
   teeth into a blob, these leave ~2px of clear gap between them at that size */
export const IconCog = ({ size }: { size?: string }) => (
  <Glyph size={size}>
    <path d="M21.85 10.26L21.85 13.74L18.76 13.81L16.95 16.95L18.43 19.66L15.42 21.4L13.81 18.76L10.19 18.76L8.58 21.4L5.57 19.66L7.05 16.95L5.24 13.81L2.15 13.74L2.15 10.26L5.24 10.19L7.05 7.05L5.57 4.34L8.58 2.6L10.19 5.24L13.81 5.24L15.42 2.6L18.43 4.34L16.95 7.05L18.76 10.19Z" />
    <circle cx="12" cy="12" r="3.5" />
  </Glyph>
);
export const IconUsers = ({ size }: { size?: string }) => (
  <Glyph size={size}>
    <circle cx="9" cy="9" r="3.2" />
    <path d="M3 20c1.3-3.2 3.4-4.6 6-4.6s4.7 1.4 6 4.6" />
    <circle cx="17.2" cy="10.2" r="2.5" />
    <path d="M15.8 15.4c2.2.3 3.9 1.7 4.9 4.6" />
  </Glyph>
);
export const IconVerified = ({ size }: { size?: string }) => (
  <Glyph size={size}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M8.2 12.2l2.6 2.6 5-5.4" />
  </Glyph>
);

const NAV_ICON = {
  home: IconHome, search: IconSearch, user: IconUser, login: IconLogin, people: IconUsers,
} as const;

/* ── who am I: /api/user/get answers 200 only with a session cookie ──────────── */

export type Me = { _id: string; username?: string; image?: { url?: string }; verified?: boolean; isAdmin?: boolean };

/* undefined means the session is still being read; null means it is genuinely not signed in.
   Screens pulse on undefined so a Sign in control never flips into an avatar a beat later. */
export function useMe() {
  const [me, setMe] = useState<Me | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    getUser()
      .then((data) => { if (alive) setMe(data?.user ?? null); })
      .catch(() => { if (alive) setMe(null); });
    return () => { alive = false; };
  }, []);
  return me;
}

/* ── ambient light: one fixed layer, two custom properties, no React state ───── */

export function CursorLight() {
  const layer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = layer.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    let queued = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      queued = 0;
      el.style.setProperty('--wv-spot-x', `${x}px`);
      el.style.setProperty('--wv-spot-y', `${y}px`);
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (queued) return;
      queued = requestAnimationFrame(paint);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (queued) cancelAnimationFrame(queued);
    };
  }, []);
  return <div ref={layer} className="wv-light" aria-hidden="true" />;
}

/* ── navigation: one item, drawn in the rail and in the phone tab bar ────────── */

export function NavItem({
  id, href, icon, label, current, className,
}: {
  id: string; href: string; icon: keyof typeof NAV_ICON; label: string; current: ScreenId; className?: string;
}) {
  const Icon = NAV_ICON[icon];
  return (
    <a
      href={href}
      aria-current={current === id ? 'page' : undefined}
      className={`wv-nav-item ${className ?? ''}`}
    >
      <Icon size="[--od-icon-size:1.3rem]" />
      <span className="wv-nav-label">{label}</span>
    </a>
  );
}

export function WeVibeNav({ current, onCompose }: { current: ScreenId; onCompose?: () => void }) {
  const me = useMe();
  const bar = useRef<HTMLElement>(null);
  const hrefFor = (r: { id: string; href: string }) => (r.id === 'profile' && me ? `/profile/${me._id}` : r.href);
  /* a visitor has no profile to open, so that one slot is the way in — it replaces the extra
     Sign in control the rail used to carry */
  const items = ROUTES.filter((r) => r.id !== 'auth').map((r) =>
    r.id === 'profile' && me === null ? { ...r, label: 'Log in', icon: 'login' as const } : r,
  );

  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    /* dataset only: no React re-render, and the rail is fixed so nothing beside it moves */
    const onScroll = () => {
      el.dataset.condensed = window.scrollY > 40 ? 'true' : 'false';
      el.dataset.scrolled = window.scrollY > 4 ? 'true' : 'false';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav ref={bar} aria-label="WeVibe sections" className="wv-nav">
        <a href="/" className="wv-nav-brand">We<span>Vibe</span></a>

        {/* the composer lives on the feed, not in the rail: this only opens it there */}
        {onCompose ? (
          <button type="button" onClick={onCompose} className={`${BTN_PRIMARY} wv-nav-compose`}>
            <IconPlus size="[--od-icon-size:1.25rem]" />
            <span className="wv-nav-label">New post</span>
          </button>
        ) : null}

        <ul className="wv-nav-links">
          {items.map((r) => (
            <li key={r.id}>
              <NavItem id={r.id} href={hrefFor(r)} icon={r.icon} label={r.label} current={current} />
            </li>
          ))}
        </ul>

        <div className="wv-nav-end">
          {/* the slot waits for the session instead of painting Sign in and swapping to an avatar */}
          {me === undefined ? <span className="wv-skel h-9 w-9 rounded-full" aria-hidden="true" /> : me ? (
            <a href={`/profile/${me._id}`} aria-current={current === 'profile' ? 'page' : undefined} className="wv-nav-item">
              {me.image?.url ? (
                <Image src={me.image.url} alt={me.username ?? 'Your profile'} width={36} height={36} className="h-9 w-9 rounded-full border border-[var(--wv-hair)] object-cover" />
              ) : (
                <Avatar handle={me.username ?? 'me'} name={me.username ?? 'Your profile'} size="sm" />
              )}
              <span className="wv-nav-label max-w-[14ch]">{me.username}</span>
            </a>
          ) : null}
        </div>
      </nav>

      <nav aria-label="WeVibe sections" className="wv-tabs">
        <ul className="m-0 grid list-none p-0" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
          {/* four destinations, fixed; Profile already routes to the sign-in screen when there is no session */}
          {items.map((r) => (
            <li key={r.id}>
              <NavItem id={r.id} href={hrefFor(r)} icon={r.icon} label={r.label} current={current} className="wv-nav-item--tab" />
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

export function Shell({ current, nav = true, onCompose, children }: { current: ScreenId; nav?: boolean; onCompose?: () => void; children: ReactNode }) {
  return (
    <div className="wv-canvas">
      <CursorLight />
      {nav ? <WeVibeNav current={current} onCompose={onCompose} /> : null}
      {/* the rail is fixed to the left edge; the page scrolls beside it, independently */}
      <div className={`wv-page${nav ? '' : ' wv-page--bare'}`}>{children}</div>
    </div>
  );
}

/* ── numbers ─────────────────────────────────────────────────────────────────── */

export function Count({ value, label, size = 'md' }: { value: number; label?: string; size?: 'sm' | 'md' | 'xl' }) {
  return (
    <span className="od-nowrap">
      <span className={`wv-num wv-num--${size}`}>{value.toLocaleString('en-US')}</span>
      {label ? <span className="wv-cap ml-1.5">{label}</span> : null}
    </span>
  );
}

/* ── avatar: the account's own photo, a monogram when it has none ────────────── */

export function Avatar({ handle, name, size = 'md', src }: { handle: string; name: string; size?: 'sm' | 'md' | 'lg' | 'xl'; src?: string }) {
  const box = { sm: 'h-9 w-9 text-[.8125rem]', md: 'h-11 w-11 text-[.9375rem]', lg: 'h-16 w-16 text-[1.125rem]', xl: 'h-20 w-20 text-[1.375rem] sm:h-24 sm:w-24 sm:text-[1.5rem]' }[size];
  const initials = handle.replace(/[^a-z0-9]/gi, '').slice(0, 2).toUpperCase();
  if (src) {
    return (
      <Image
        src={src}
        alt={`${name} avatar`}
        width={96}
        height={96}
        className={`shrink-0 rounded-full border border-[var(--wv-hair)] object-cover ${box}`}
      />
    );
  }
  return (
    <span
      role="img"
      aria-label={`${name} avatar`}
      className={`grid shrink-0 place-items-center rounded-full border border-[var(--wv-hair)] bg-[var(--wv-void-3)] font-semibold text-[var(--wv-blue-text)] ${box}`}
    >
      {initials}
    </span>
  );
}

/* the badge states a fact the site decided, so it reads as WeVibe's grant wherever it appears */
export function VerifiedBadge({ size = '[--od-icon-size:1.15rem]' }: { size?: string }) {
  return (
    <span className="inline-flex shrink-0 items-center text-[var(--wv-blue-text)]" title="Verified by WeVibe">
      <IconVerified size={size} />
      <span className="sr-only">Verified by WeVibe</span>
    </span>
  );
}

/* the photo and the name go to the same profile, so they are one control rather than a link sitting
   beside a picture that does nothing. No id — a comment whose account is gone — and it stays text. */
export function PersonLink({ id, name, src, size = 'sm', badge, extra }: {
  id?: string; name: string; src?: string; size?: 'sm' | 'md' | 'lg' | 'xl'; badge?: ReactNode; extra?: ReactNode;
}) {
  const box = (
    <>
      <Avatar handle={name} name={name} size={size} src={src} />
      <span className="od-fill min-w-0">
        <span className="wv-person-line">
          <span className="wv-person-name od-truncate">{name}</span>
          {badge}
        </span>
        {extra}
      </span>
    </>
  );
  return id
    ? <a href={`/profile/${id}`} aria-label={`Open ${name}'s profile`} className="wv-person-link">{box}</a>
    : <span className="wv-person-link">{box}</span>;
}

/* ── follow: skeleton until the API answers, then the true state ─────────────── */

export function FollowButton({ userId, following, followers }: { userId: string; following?: boolean; followers?: number }) {
  const router = useRouter();
  /* a refusal belongs in the app-wide notification, not in a line of text beside the button */
  const { setMessage, setError } = useAlert();
  const shout = (text: string) => { setError(true); setMessage(text); };
  /* 'unknown' until somebody answers it: a control that paints Follow and then flips to
     Following a moment later reads as a broken button, so it pulses instead */
  const [state, setState] = useState<'unknown' | 'idle' | 'pending' | 'on' | 'closed'>(
    following === undefined ? 'unknown' : following ? 'on' : 'idle',
  );

  useEffect(() => {
    if (following !== undefined) return;
    let alive = true;
    allowFollowing({
      userId,
      setAllow: (allow) => {
        if (alive) setState(allow.unfollow ? 'on' : allow.follow ? 'idle' : 'closed');
      },
    }).then((res) => {
      if (!alive) return;
      const allow = (res as { data?: { allow?: AllowTypes } } | undefined)?.data?.allow;
      setState((prev) => (prev === 'unknown' ? (allow ? (allow.unfollow ? 'on' : allow.follow ? 'idle' : 'closed') : 'closed') : prev));
    });
    return () => { alive = false; };
  }, [following, userId]);

  const toggle = async () => {
    if (state === 'unknown' || state === 'pending') return;
    /* the route says the viewer cannot follow anyone without a session: say it out loud
       instead of leaving a disabled button that looks broken */
    if (state === 'closed') { shout('Sign in to follow this account.'); return; }
    const was = state;
    setState('pending');
    const res = (was === 'on'
      ? await unfollowUser({ query: userId, router })
      : await followUser({ query: userId, router })) as { status?: number; message?: string; data?: { message?: string } } | undefined;
    if (res?.status && res.status < 300) {
      setState(was === 'on' ? 'idle' : 'on');
    } else {
      setState(was);
      /* followUser hands back the response body only, so the sign-in case has to be read from the
         text the route answered with */
      const text = res?.message ?? res?.data?.message ?? 'Follow needs a signed-in account.';
      shout(/not logged in/i.test(text) ? 'Sign in to follow this account.' : text);
    }
  };
  return (
    <span className="od-row flex-wrap [--od-gap:8px]">
      {state === 'unknown' ? (
        <span className="wv-skel h-11 w-[104px] rounded-[10px]" aria-hidden="true" />
      ) : (
        <button
          type="button"
          onClick={toggle}
          aria-pressed={state === 'on'}
          aria-label={state === 'on' ? 'Unfollow this account' : 'Follow this account'}
          className={state === 'on' ? BTN : BTN_PRIMARY}
          disabled={state === 'pending'}
        >
          {state === 'on' ? 'Following' : state === 'pending' ? 'Saving…' : 'Follow'}
        </button>
      )}
      {typeof followers === 'number' ? <Count value={followers} label="followers" size="sm" /> : null}
    </span>
  );
}

/* ── skeletons that hold the height of what they replace ─────────────────────── */

export function PostCardSkeleton() {
  return (
    <div className="wv-card wv-post" aria-hidden="true">
      <div className="wv-post-author">
        <span className="wv-skel h-11 w-11 rounded-full" />
        <span className="wv-skel h-4 w-40" />
      </div>
      <div className="wv-post-body">
        <span className="wv-skel block h-5 w-3/4" />
        <span className="wv-skel mt-3 block h-4 w-1/2" />
      </div>
      <span className="wv-skel mt-[18px] block aspect-[16/10] w-full rounded-none" />
      <div className="wv-post-actions">
        <span className="wv-skel h-4 w-14" />
        <span className="wv-skel h-4 w-14" />
        <span className="wv-skel ml-auto h-4 w-12" />
      </div>
    </div>
  );
}

export function PersonRowSkeleton({ compact }: { compact?: boolean }) {
  return (
    <li className="wv-skel-row" aria-hidden="true">
      <span className="wv-skel h-11 w-11 rounded-full" />
      <span className="od-fill od-stack">
        <span className="wv-skel block h-4 w-32" />
        <span className="wv-skel block h-4 w-2/3" />
      </span>
      {compact ? null : <span className="wv-skel h-11 w-[104px] rounded-[10px]" />}
    </li>
  );
}

const CommentSkeleton = () => (
  <li className="wv-skel-comment" aria-hidden="true">
    <span className="wv-skel h-9 w-9 shrink-0 rounded-full" />
    <span className="od-fill">
      <span className="wv-skel block h-3 w-24" />
      <span className="wv-skel mt-2 block h-4 w-2/3" />
    </span>
  </li>
);

/* ── replies: /api/posts/comments/get reports a count, never the replies ─────── */

function CommentReplies({ postId, commentId, count }: { postId: string; commentId: string; count: number }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<RepliesType[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const skip = useRef(0);

  const load = async () => {
    if (loading) return;
    setLoading(true);
    const fetched = await getReplies({
      postId,
      commentId,
      skip: skip.current,
      limit: 5,
      setSkip: (updater) => { skip.current = updater(skip.current); },
      setHasMore,
      setLoading,
    });
    if (Array.isArray(fetched)) setItems((prev) => [...prev, ...fetched]);
    setLoading(false);
  };

  return (
    <div className="wv-replies">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => { const next = !open; setOpen(next); if (next && !items.length) load(); }}
        className="wv-cap cursor-pointer border-0 bg-transparent p-0 hover:text-[var(--wv-blue-text)]"
      >
        {open ? 'Hide replies' : `${count} ${count === 1 ? 'reply' : 'replies'}`}
      </button>
      {open ? (
        <ul className="m-0 mt-1 p-0 list-none">
          {items.map((r) => (
            <li key={r._id} className="wv-comment">
              <PersonLink id={r.user?._id} name={r.user?.username ?? 'WeVibe member'} src={r.user?.image?.url} />
              <p>{r.content}</p>
            </li>
          ))}
          {loading && !items.length ? <CommentSkeleton /> : null}
          {hasMore && items.length ? (
            <li>
              <button type="button" onClick={load} disabled={loading} className="wv-cap mt-2 cursor-pointer border-0 bg-transparent p-0 hover:text-[var(--wv-blue-text)]">
                {loading ? 'Loading…' : 'Load more replies'}
              </button>
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}

/* ── post card ────────────────────────────────────────────────────────────────── */

const humanDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export function PostCard({ post }: { post: Post }) {
  const [like, setLike] = useState<boolean | undefined>(post.likedByMe);
  const [likes, setLikes] = useState(post.likes);
  const [replies, setReplies] = useState<CommentType[]>([]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [flash, setFlash] = useState<string | undefined>('');
  const flashTimer = useRef<number>(0);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsHasMore, setCommentsHasMore] = useState(true);
  const commentsSkip = useRef(0);
  const commentsFromServer = useRef(0);
  useEffect(() => () => window.clearTimeout(flashTimer.current), []);

  const loadComments = async () => {
    if (commentsLoading) return;
    setCommentsLoading(true);
    const fetched = await getComments({
      postId: post.id,
      skip: commentsSkip.current,
      limit: 10,
      setSkip: (updater) => { commentsSkip.current = updater(commentsSkip.current); },
      setHasMore: setCommentsHasMore,
      setLoading: setCommentsLoading,
    });
    if (Array.isArray(fetched)) {
      commentsFromServer.current += fetched.length;
      setReplies((prev) => [...prev, ...fetched]);
    }
    setCommentsLoaded(true);
    setCommentsLoading(false);
  };

  const say = (m: string) => {
    setFlash(m);
    window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setFlash(''), 2400);
  };

  /* their handleLike flips the counter before the request lands, so a refused love
     (a guest hitting /api/posts/handleLike gets 401) has to be undone here */
  const toggleLike = async () => {
    const was = like;
    const failure = await handleLike({ postId: post.id, like: was, setLike, setLikes });
    if (failure) {
      setLike(was);
      /* handleLike already moved the counter in that direction, so the undo moves it back */
      setLikes((n) => (was ? n + 1 : n - 1));
      say(failure.message ?? 'Sign in to like a post.');
    }
  };

  const sendReply = () => {
    const text = draft.trim();
    if (!text) return;
    addComment({
      postId: post.id,
      comment: text,
      setComment: setDraft,
      setComments: setReplies,
      setMessage: setFlash,
      setError: () => {},
    });
  };

  const share = async () => {
    const url = window.location.href;
    try { await navigator.clipboard?.writeText(url); say('Link copied.'); }
    catch { say('Copy blocked — select the address bar instead.'); }
  };

  /* their API stores title and description separately; the screens join them with one newline */
  const [titleLine, ...restLines] = post.body.split('\n');
  const description = restLines.join('\n');

  return (
    <article className="wv-card wv-post">
      <header className="wv-post-author">
        <PersonLink
          id={post.authorId ?? post.handle}
          name={post.name}
          src={post.avatar}
          size="md"
          badge={post.verified ? <VerifiedBadge /> : null}
          extra={<span className="wv-cap block">@{post.handle}</span>}
        />
      </header>

      <div className="wv-post-body">
        <h2 className="wv-post-title">{titleLine}</h2>
        {description ? <p className="wv-post-text">{description}</p> : null}
      </div>

      {post.image ? (
        <Image
          src={post.image}
          alt={titleLine || `Photo by ${post.name}`}
          width={960}
          height={600}
          className="wv-post-image"
        />
      ) : null}

      <div className="wv-post-actions">
        <button type="button" onClick={toggleLike} aria-pressed={!!like} aria-label={like ? 'Remove your like' : 'Like this post'} className="wv-post-action">
          <IconHeart filled={!!like} />
          <Count value={likes} label="likes" size="sm" />
        </button>

        <button
          type="button"
          onClick={() => { const next = !open; setOpen(next); if (next && !commentsLoaded) loadComments(); }}
          aria-expanded={open}
          aria-controls={`thread-${post.id}`}
          aria-label={open ? 'Hide comments' : 'Show comments'}
          className="wv-post-action"
        >
          <IconComment />
          <Count value={post.comments + (replies.length - commentsFromServer.current)} label="comments" size="sm" />
        </button>

        <button type="button" onClick={share} aria-label="Copy a link to this post" className="wv-post-action">
          <IconShare />
          <span className="wv-post-action-label">Share</span>
        </button>

        <time className="wv-post-when" dateTime={post.date} title={humanDate(post.date)}>
          {post.when === 'now' ? 'just now' : `${post.when} ago`}
        </time>
      </div>

      {flash ? <p className="wv-cap wv-post-pad mb-0 pb-4 text-[var(--wv-blue-text)]" role="status">{flash}</p> : null}

      {open ? (
        <section id={`thread-${post.id}`} className="wv-thread" aria-label={`Comments on ${titleLine}`}>
          {replies.length ? (
            <ul className="m-0 p-0 list-none">
              {replies.map((r) => (
                <li key={r._id} className="wv-comment">
                  <PersonLink id={r.user?._id} name={r.user?.username ?? 'WeVibe member'} src={r.user?.image?.url} />
                  <p>{r.comment}</p>
                  {r.replies ? <CommentReplies postId={post.id} commentId={r._id} count={r.replies} /> : null}
                </li>
              ))}
            </ul>
          ) : commentsLoading ? (
            <ul className="m-0 p-0 list-none"><CommentSkeleton /><CommentSkeleton /></ul>
          ) : (
            <p className="wv-cap mt-4 mb-4">No comments yet — you are first.</p>
          )}

          {commentsHasMore && replies.length ? (
            <button type="button" onClick={loadComments} disabled={commentsLoading} className="wv-cap mb-2 cursor-pointer border-0 bg-transparent p-0 hover:text-[var(--wv-blue-text)] disabled:opacity-60">
              {commentsLoading ? 'Loading…' : 'Load more comments'}
            </button>
          ) : null}

          <label htmlFor={`reply-${post.id}`} className="wv-label block mt-2">Add a comment</label>
          <div className="od-row mt-2 [--od-gap:8px]">
            <input
              id={`reply-${post.id}`}
              className="wv-input od-fill"
              maxLength={2000}
              placeholder="Say something about this post"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendReply(); }}
            />
            <button type="button" onClick={sendReply} disabled={!draft.trim()} className={`${BTN_PRIMARY} od-fixed`}>
              Comment
            </button>
          </div>
        </section>
      ) : null}
    </article>
  );
}
