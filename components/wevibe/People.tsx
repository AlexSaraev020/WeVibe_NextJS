'use client';

import { useEffect, useState } from 'react';
import {
  BTN, BTN_QUIET, Count, FollowButton, PersonLink, PersonRowSkeleton, Shell, VerifiedBadge, useMe,
} from './ui';
import { getUsersByQuery } from '@/actions/user/searchUser';
import { verifyUser } from '@/actions/profile/following/verifyUser';
import type { UserType } from '@/types/userTypes/user/userType';

/* an empty query is what the people route answers with everyone, most-followed first,
   so the order on screen is the order the route produced — nothing is re-sorted here */
export function People() {
  const me = useMe();
  const [people, setPeople] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [busyId, setBusyId] = useState('');

  useEffect(() => {
    let alive = true;
    getUsersByQuery('').then((response) => {
      if (!alive) return;
      if (Array.isArray(response?.users)) { setPeople(response.users); setFailed(false); } else { setFailed(true); }
      setLoading(false);
    });
    return () => { alive = false; };
  }, []);

  const others = people.filter((p) => p._id !== me?._id);

  const setVerified = (id: string, value: boolean) =>
    setPeople((prev) => prev.map((p) => (p._id === id ? { ...p, verified: value } : p)));

  const toggleVerified = async (u: UserType) => {
    if (busyId) return;
    setBusyId(u._id);
    const next = !u.verified;
    const result = await verifyUser({ query: u._id, verified: next });
    if (result && typeof result.verified === 'boolean') setVerified(u._id, result.verified);
    setBusyId('');
  };

  const row = (u: UserType) => (
    <li key={u._id} className="wv-row">
      <PersonLink
        id={u._id}
        name={u.username}
        src={u.image?.url}
        size="lg"
        badge={u.verified ? <VerifiedBadge /> : null}
        extra={<>
          <span className="od-clamp-2 mt-1 block max-w-[60ch] text-[var(--wv-text-sm)] text-[var(--wv-mid)]">{u.bio || 'No bio yet.'}</span>
          <span className="wv-cap mt-1 block">
            <Count value={u.followers ?? 0} label="followers" size="sm" />
            {/* the people route does not always carry a post count: show it only when it is there */}
            {typeof u.posts === 'number' ? <span className="ml-3"><Count value={u.posts} label="posts" size="sm" /></span> : null}
          </span>
        </>}
      />
      {/* only an admin gets the badge to hand out; everyone else sees it read-only */}
      {me?.isAdmin ? (
        <button type="button" onClick={() => toggleVerified(u)} disabled={busyId === u._id} className={BTN_QUIET}>
          {busyId === u._id ? 'Saving…' : u.verified ? 'Remove verification' : 'Verify'}
        </button>
      ) : null}
      <FollowButton userId={u._id} following={u.followedBy} />
    </li>
  );

  return (
    <Shell current="people">
      <div className="wv-main wv-main--wide od-stack gap-5">
        <div>
          <h1 className="wv-display m-0 text-[var(--wv-ink)]">Meet new people</h1>
          <p className="wv-cap mt-2 m-0 max-w-[58ch]">
            Accounts worth getting to know, most-followed first. The badge beside a name was granted by WeVibe, not chosen by that account.
          </p>
        </div>

        {loading ? (
          <ul className="od-stack list-none m-0 p-0">
            <PersonRowSkeleton />
            <PersonRowSkeleton />
            <PersonRowSkeleton />
            <PersonRowSkeleton />
          </ul>
        ) : others.length ? (
          <ul className="od-stack list-none m-0 p-0">
            {others.map((u) => row(u))}
          </ul>
        ) : (
          <div className="wv-card p-5">
            <h2 className="wv-title m-0 text-[var(--wv-ink)]">{failed ? 'Accounts did not load' : 'Nobody has joined yet'}</h2>
            <p className="wv-hint mt-2 m-0 max-w-[52ch]">
              {failed
                ? '/api/user/searchUser did not answer. Refresh once and try again.'
                : 'You are the only account here. Invite someone, or sign in with another account to see both.'}
            </p>
            <a href="/auth/register" className={`${BTN} mt-4`}>Create an account</a>
          </div>
        )}
      </div>
    </Shell>
  );
}

export default People;
