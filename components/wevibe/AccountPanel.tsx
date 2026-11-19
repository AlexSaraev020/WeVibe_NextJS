'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import Upload from '@/components/uploadImage/upload';
import { useAlert } from '@/contexts/alert/alertContext';
import { useUserNavData } from '@/contexts/user/userNavContext';
import { updateProfile } from '@/actions/profile/updateProfile';
import { updateAccount } from '@/actions/profile/updateAccount';
import { deleteAccount } from '@/actions/profile/deleteAccount';
import { logoutUser } from '@/actions/profile/logout';
import { BTN, BTN_DANGER, BTN_PRIMARY, IconClose, IconCog, IconUser } from './ui';
import type { ImageType } from '@/types/image/imageType';
import type { UserType } from '@/types/userTypes/user/userType';

/* same ranges Auth.tsx mirrors from actions/auth/validateFieldsLength */
const okUser = (v: string) => { const n = v.trim().length; return n >= 3 && n <= 50; };
const okMail = (v: string) => {
  const n = v.trim().length; const at = v.indexOf('@');
  return n >= 6 && n <= 254 && at > 0 && v.slice(at + 1).includes('.');
};
const okPass = (v: string) => v.length >= 8 && v.length <= 64;

export type AccountOpen = 'profile' | 'settings' | 'delete' | 'signout' | null;

/* the cog lives in the profile header, level with the name, and only says which card the panel below
   should paint — every request the four actions make stays in AccountPanel */
export function AccountCog({ setOpen }: { setOpen: (which: AccountOpen) => void }) {
  const [menu, setMenu] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const cog = useRef<HTMLButtonElement>(null);
  const menuBox = useRef<HTMLDivElement>(null);

  const pick = (which: 'profile' | 'settings' | 'delete' | 'signout') => { setOpen(which); setMenu(false); };

  /* role=menu is a promise about the keys: arrows move through the items, Home/End jump to the
     ends, Escape closes and hands focus back to the cog that opened it */
  const menuKeys = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = [...(menuBox.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [])];
    const at = items.indexOf(document.activeElement as HTMLButtonElement);
    const go = (n: number) => { e.preventDefault(); items[(n + items.length) % items.length]?.focus(); };
    if (e.key === 'ArrowDown') go(at + 1);
    else if (e.key === 'ArrowUp') go(at < 1 ? items.length - 1 : at - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(items.length - 1);
    else if (e.key === 'Escape') { setMenu(false); cog.current?.focus(); }
  };

  useEffect(() => {
    if (!menu) return;
    menuBox.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
    /* capture phase: the cog sits outside the list, so its own click still gets to toggle it */
    const onDown = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) setMenu(false); };
    document.addEventListener('pointerdown', onDown, true);
    return () => document.removeEventListener('pointerdown', onDown, true);
  }, [menu]);

  return (
    <div ref={wrap} className="relative">
      <button type="button" ref={cog} onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-haspopup="true" aria-controls="account-menu" aria-label="Account actions" className="wv-cog">
        <IconCog size="[--od-icon-size:1.4rem]" />
      </button>
      {menu ? (
        <div id="account-menu" ref={menuBox} role="menu" aria-label="Account actions" onKeyDown={menuKeys} className="wv-menu">
          <button type="button" role="menuitem" onClick={() => pick('profile')}>Edit profile</button>
          <button type="button" role="menuitem" onClick={() => pick('settings')}>Email and password</button>
          <button type="button" role="menuitem" onClick={() => pick('signout')}>Sign out</button>
          <button type="button" role="menuitem" className="wv-menu--danger" onClick={() => pick('delete')}>Delete account</button>
        </div>
      ) : null}
    </div>
  );
}

export function AccountPanel({ user, open, setOpen }: { user: UserType; open: AccountOpen; setOpen: (which: AccountOpen) => void }) {
  const router = useRouter();
  const { setMessage, setError } = useAlert();
  const { setUsername, setUserImage } = useUserNavData();

  const [username, setName] = useState(user.username ?? '');
  const [bio, setBio] = useState(user.bio ?? '');
  const [image, setImage] = useState<ImageType | undefined>(user.image);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [email, setEmail] = useState(user.email ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const watchdog = useRef<number | null>(null);

  /* the API answers a no-op PATCH with 400 "No changes detected", so Save stays off until something actually differs */
  const dirtyProfile = username.trim() !== user.username || bio !== (user.bio ?? '') || image?.url !== user.image?.url;
  const dirtySettings = email.trim() !== (user.email ?? '') || newPassword.length > 0;

  const clearWatchdog = () => {
    if (watchdog.current !== null) { window.clearTimeout(watchdog.current); watchdog.current = null; }
  };

  /* the actions toast the API's own message and only return it on an HTTP error,
     so a returned string means it failed and no reply means the request hung */
  const run = async (endpoint: string, action: () => Promise<unknown>) => {
    if (busy) return false;
    setBusy(true);
    setError(false);
    clearWatchdog();
    watchdog.current = window.setTimeout(() => {
      setErrors({ network: `No reply from ${endpoint}. Check the dev-server log — MONGODB_URI, and ImageKit for an image change.` });
      setBusy(false);
    }, 8000);
    const failure = await action();
    clearWatchdog();
    setBusy(false);
    if (typeof failure === 'string') setErrors({ [endpoint]: failure });
    return !failure;
  };

  const saveProfile = async () => {
    const next: Record<string, string> = {};
    if (!okUser(username)) next.username = 'Usernames are 3–50 characters. The API counts them that way, spaces included.';
    setErrors(next);
    if (Object.keys(next).length) return;
    const saved = await run('profile', () => updateProfile({
      username: username.trim(),
      bio,
      image: image ?? user.image,
      currentImage: user.image,
      searchedUser: user._id,
      router,
      setEdit: (on: boolean) => setOpen(on ? 'profile' : null),
      setMessage,
      setUserImage,
      setUsername,
      setError,
    }));
    if (saved) setOpen(null);
  };

  const saveSettings = async () => {
    const next: Record<string, string> = {};
    if (!okMail(email)) next.email = 'Emails are 6–254 characters and need a domain after the @, for example name@wevibe.social.';
    if (newPassword && !okPass(newPassword)) next.newPassword = 'A new password is 8–64 characters.';
    setErrors(next);
    if (Object.keys(next).length) return;
    /* updateAccount pushes to / itself: changing your email invalidates the session */
    const saved = await run('account', () => updateAccount({
      email: email.trim(),
      password: newPassword,
      searchedUser: user._id,
      router,
      setEdit: (on: boolean) => setOpen(on ? 'settings' : null),
      setMessage,
      setError,
    }));
    if (saved) { setOpen(null); setNewPassword(''); }
  };

  const signOut = () => run('logout', async () => {
    await logoutUser();
    router.refresh();
    router.push('/');
  }).then(() => setOpen(null));

  /* the cog up in the header hands the sign-out down as an open value: the request itself stays here */
  useEffect(() => {
    if (open === 'signout') void signOut();
  }, [open]);

  const destroy = async () => {
    if (!okPass(deletePassword)) { setErrors({ deletePassword: 'Confirm with your current password, 8–64 characters.' }); return; }
    const gone = await run('deleteAccount', () => deleteAccount({
      searchedUserId: user._id,
      password: deletePassword,
      setMessage,
      router,
    }));
    if (gone) setOpen(null);
  };

  const err = (k: string) => (errors[k] ? <p className="wv-error" role="alert">{errors[k]}</p> : null);

  return (
    <section id="account" aria-label="Account settings" className="od-stack gap-3">
      {open === 'signout' ? <p className="wv-hint m-0" role="status">Signing out…</p> : null}

      {open === 'profile' ? (
        <div className="wv-card p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="wv-title m-0 mr-auto text-[var(--wv-ink)]">Edit profile</h3>
            <button type="button" onClick={() => setOpen(null)} className={BTN}>Close</button>
          </div>
          <div className="od-stack mt-4 gap-4">
            <div className="wv-field">
              <label htmlFor="account-username" className="wv-label">Username</label>
              <div className="flex items-center gap-2 rounded-[10px] border border-[var(--wv-hair)] focus-within:border-[var(--wv-blue)]">
                <span className="grid h-11 w-11 place-items-center text-[var(--wv-low)]"><IconUser /></span>
                <input id="account-username" name="username" autoComplete="username" maxLength={50} value={username} onChange={(e) => setName(e.target.value)} aria-invalid={errors.username ? 'true' : undefined} aria-describedby="account-username-msg"
                  className="min-h-[44px] flex-1 border-0 bg-transparent pr-3 text-[var(--wv-text-base)] text-[var(--wv-ink)] placeholder:text-[var(--wv-low)] focus:outline-none" />
              </div>
              <div id="account-username-msg" aria-live="polite">{err('username') ?? <p className="wv-hint">3–50 characters. Other people find you by it.</p>}</div>
            </div>

            <div className="wv-field">
              <label htmlFor="account-bio" className="wv-label">Bio</label>
              <textarea id="account-bio" name="bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell people what you are about"
                className="wv-input" />
              <p className="wv-hint">No length limit on this one in the API.</p>
            </div>

            <div className="wv-field">
              <span className="wv-label" id="account-image-label">Profile image</span>
              <div className="max-w-[11rem]">
                <Upload profile image={image} setImage={setImage} setProgress={setProgress} setDisable={setUploading} setMessage={setMessage} setError={setError} />
              </div>
              <p className="wv-hint">
                {progress > 0 && progress < 100 ? `Uploading to ImageKit — ${progress}%` : 'Through ImageKit, up to 2 MB. Your old profile image is deleted once the new one lands.'}
              </p>
            </div>

            <button type="button" onClick={saveProfile} disabled={busy || uploading || !dirtyProfile} className={`${BTN_PRIMARY} self-start`}>
              {busy ? 'Saving…' : uploading ? 'Uploading…' : dirtyProfile ? 'Save profile' : 'Nothing changed yet'}
            </button>
          </div>
        </div>
      ) : null}

      {open === 'settings' ? (
        <div className="wv-card p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="wv-title m-0 mr-auto text-[var(--wv-ink)]">Email and password</h3>
            <button type="button" onClick={() => setOpen(null)} className={BTN}>Close</button>
          </div>
          <p className="wv-hint mt-2">Sign in with this email. Leave the password empty to change only the email — that signs you out, so you confirm the new address.</p>
          <div className="od-stack mt-4 gap-4">
            <div className="wv-field">
              <label htmlFor="account-email" className="wv-label">Email</label>
              <input id="account-email" name="email" type="email" autoComplete="email" maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" aria-invalid={errors.email ? 'true' : undefined} aria-describedby="account-email-msg"
                className="wv-input" />
              <div id="account-email-msg" aria-live="polite">{err('email')}</div>
            </div>
            <div className="wv-field">
              <label htmlFor="account-new-password" className="wv-label">New password (optional)</label>
              <input id="account-new-password" name="newPassword" type="password" autoComplete="new-password" maxLength={64} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="8–64 characters" aria-invalid={errors.newPassword ? 'true' : undefined} aria-describedby="account-new-password-msg"
                className="wv-input" />
              <div id="account-new-password-msg" aria-live="polite">{err('newPassword')}</div>
            </div>
            <button type="button" onClick={saveSettings} disabled={busy || !dirtySettings} className={`${BTN_PRIMARY} self-start`}>
              {busy ? 'Saving…' : dirtySettings ? 'Save settings' : 'Nothing changed yet'}
            </button>
          </div>
        </div>
      ) : null}

      {open === 'delete' ? (
        <div className="wv-error-box od-stack gap-3">
          <p className="m-0 max-w-[52ch] text-[var(--wv-text-base)] text-[var(--wv-ink)]">Delete <span className="text-[var(--wv-blue-text)]">{user.username}</span> and everything it wrote? Deletion is permanent: the account, its posts, its comments and its follows all go, and the password asked for here is your current one.</p>
          <div className="wv-field">
            <label htmlFor="account-delete-password" className="wv-label">Current password</label>
            <input id="account-delete-password" name="deletePassword" type="password" autoComplete="current-password" maxLength={64} value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} placeholder="8–64 characters" aria-invalid={errors.deletePassword ? 'true' : undefined} aria-describedby="account-delete-password-msg"
              className="wv-input" />
            <div id="account-delete-password-msg" aria-live="polite">{err('deletePassword')}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={destroy} disabled={busy} className={BTN_DANGER}>{busy ? 'Deleting…' : 'Yes, delete it'}</button>
            <button type="button" onClick={() => { setOpen(null); setDeletePassword(''); setErrors({}); }} className={BTN}>
              <IconClose /> Keep my account
            </button>
          </div>
          {err('deleteAccount') ?? err('network')}
        </div>
      ) : null}
    </section>
  );
}

export default AccountPanel;
