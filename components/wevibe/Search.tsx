'use client';

import { useEffect, useState } from 'react';
import {
  Avatar, BTN, BTN_QUIET, Count, FollowButton, IconClose, IconSearch, PersonRowSkeleton, Shell, VerifiedBadge,
} from './ui';
import { getUsersByQuery } from '@/actions/user/searchUser';
import type { UserType } from '@/types/userTypes/user/userType';

export function Search() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const trimmed = query.trim();

  /* the search route answers only non-empty queries, so an empty box asks nothing of it */
  useEffect(() => {
    if (!trimmed) { setUsers([]); return; }
    let alive = true;
    setLoading(true);
    const timer = window.setTimeout(async () => {
      const response = await getUsersByQuery(trimmed);
      if (!alive) return;
      if (Array.isArray(response?.users)) {
        setUsers(response.users);
        setFailed(false);
      } else {
        setUsers([]);
        setFailed(true);
      }
      setLoading(false);
    }, 300);
    return () => { alive = false; window.clearTimeout(timer); };
  }, [trimmed]);

  return (
    <Shell current="search">
      <div className="wv-main od-stack gap-5">
        <h1 className="wv-display m-0 text-[var(--wv-ink)]">Search</h1>

        <div className="wv-field">
          <label htmlFor="q" className="wv-label">Account name</label>
          <div className="od-row [--od-gap:8px]">
            <span className="text-[var(--wv-low)]"><IconSearch size="[--od-icon-size:1.25rem]" /></span>
            <input
              id="q"
              type="search"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Names and bios"
              aria-describedby="result-count"
              className="wv-input od-fill"
            />
            {query ? (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className={`${BTN_QUIET} min-w-[44px]`}>
                <IconClose size="[--od-icon-size:1.2rem]" />
              </button>
            ) : null}
          </div>
          <p id="result-count" className="wv-hint" aria-live="polite">
            {loading
              ? 'Searching…'
              : trimmed
                ? <><Count value={users.length} size="sm" /> {users.length === 1 ? 'account' : 'accounts'} for “{trimmed}”</>
                : 'Type at least one letter. Accounts only — there is no post search in the API.'}
          </p>
        </div>

        {users.length ? (
          <ul className="od-stack list-none m-0 p-0">
            {users.map((u) => (
              <li key={u._id} className="wv-row">
                <Avatar handle={u.username} name={u.username} size="md" src={u.image?.url} />
                <div className="od-fill min-w-0">
                  <p className="m-0 inline-flex flex-wrap items-center gap-2 text-[var(--wv-text-base)] font-semibold">
                    <a href={`/profile/${u._id}`} className="od-truncate no-underline text-[var(--wv-ink)] hover:text-[var(--wv-blue-text)]">
                      {u.username}
                    </a>
                    {u.verified ? <VerifiedBadge /> : null}
                  </p>
                  <p className="od-clamp-2 mt-1 mb-0 max-w-[60ch] text-[var(--wv-text-sm)] text-[var(--wv-mid)]">{u.bio || 'No bio yet.'}</p>
                  <p className="wv-cap m-0"><Count value={u.followers ?? 0} label="followers" size="sm" /></p>
                </div>
                <FollowButton userId={u._id} following={u.followedBy} followers={u.followers} />
              </li>
            ))}
          </ul>
        ) : loading ? (
          <ul className="od-stack list-none m-0 p-0">
            <PersonRowSkeleton />
            <PersonRowSkeleton />
            <PersonRowSkeleton />
          </ul>
        ) : failed ? (
          <div className="wv-card p-5">
            <h2 className="wv-title m-0 text-[var(--wv-ink)]">Search did not answer</h2>
            <p className="wv-hint mt-2 m-0 max-w-[55ch]">
              <code>/api/user/searchUser</code> expects a non-empty <code>q</code> and needs MongoDB reachable. Try one more letter.
            </p>
          </div>
        ) : trimmed ? (
          <div className="wv-card p-5">
            <h2 className="wv-title m-0 text-[var(--wv-ink)]">No account matches “{trimmed}”</h2>
            <p className="wv-hint mt-2 m-0 max-w-[55ch]">
              WeVibe matches usernames and bios. Try the first few letters instead of a full name.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => setQuery('')} className={BTN}>Clear search</button>
              <a href="/people" className={BTN_QUIET}>Browse everyone instead</a>
            </div>
          </div>
        ) : (
          <div className="wv-card p-5">
            <h2 className="wv-title m-0 text-[var(--wv-ink)]">Nothing searched yet</h2>
            <p className="wv-hint mt-2 m-0 max-w-[55ch]">
              Type a name above, or open <a href="/people" className="text-[var(--wv-blue-text)] no-underline underline-offset-4">People</a> to scan the whole list.
            </p>
          </div>
        )}
      </div>
    </Shell>
  );
}

export default Search;
