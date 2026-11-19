'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ChangeEvent } from 'react';
import { BTN, BTN_PRIMARY, IconCheck, IconClose, IconEye, Shell } from './ui';
import { useAlert } from '@/contexts/alert/alertContext';
import { loginUser } from '@/actions/auth/login';
import { registerUser } from '@/actions/auth/register';
import { sendEmail } from '@/actions/auth/passwordReset/sendEmail';
import { verifyResetCode } from '@/actions/auth/passwordReset/verifyResetCode';
import { updatePassword } from '@/actions/auth/passwordReset/updatePassword';
import { chooseAnotherEmail } from '@/actions/auth/passwordReset/chooseAnotherEmail';

type Mode = 'signin' | 'register' | 'recover';
type Step = 'form' | 'code' | 'newpass';

/* one route per flow, so the URL always says which flow the user is in */
const MODES: { id: Mode; label: string; href: string }[] = [
  { id: 'signin', label: 'Sign in', href: '/auth/login' },
  { id: 'register', label: 'Create account', href: '/auth/register' },
  { id: 'recover', label: 'Reset with code', href: '/auth/resetpassword' },
];

/* mirrors actions/auth/validateFieldsLength, so the client refuses
   exactly what /api/auth/* would refuse and never invents its own rules */
const okUser = (v: string) => { const n = v.trim().length; return n >= 3 && n <= 50; };
const okMail = (v: string) => {
  const n = v.trim().length; const at = v.indexOf('@');
  return n >= 6 && n <= 254 && at > 0 && v.slice(at + 1).includes('.');
};
const okPass = (v: string) => v.length >= 8 && v.length <= 64;

export function Auth({ mode = 'signin', codeAlreadySent = false }: { mode?: Mode; codeAlreadySent?: boolean }) {
  const router = useRouter();
  const { setMessage, setError } = useAlert();
  const [step, setStep] = useState<Step>(mode === 'recover' && codeAlreadySent ? 'code' : 'form');
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [sentTo, setSentTo] = useState('');
  const [values, setValues] = useState({ username: '', email: '', password: '', code: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState('');
  const watchdog = useRef<number | null>(null);

  const clearWatchdog = () => {
    if (watchdog.current !== null) { window.clearTimeout(watchdog.current); watchdog.current = null; }
  };
  useEffect(() => clearWatchdog, []);

  const set = (k: keyof typeof values) => (e: ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((prev) => { const next = { ...prev }; delete next[k]; return next; });
  };

  const fieldError = (k: string, value: string) => {
    if (k === 'username') return okUser(value) ? '' : 'Usernames are 3–50 characters. The API counts them that way, spaces included.';
    if (k === 'email') return okMail(value) ? '' : 'Emails are 6–254 characters and need a domain after the @, for example name@wevibe.social.';
    if (k === 'password') {
      if (!value.trim()) return 'A password is required. Use Reset with code instead if you do not remember it.';
      return okPass(value) ? '' : 'Passwords are 8–64 characters — that is the range /api/auth/register accepts.';
    }
    if (k === 'code') return /^[0-9]{6}$/.test(value.trim()) ? '' : 'The code is exactly 6 digits, from the email WeVibe just sent. Check for a leading zero, and look in spam.';
    return '';
  };

  const validate = (keys: string[]) => {
    const next: Record<string, string> = {};
    keys.forEach((k) => { const m = fieldError(k, values[k as keyof typeof values]); if (m) next[k] = m; });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  /* the actions call setMessage themselves (the layout renders it as a toast) and hand back
     the API's message only when it answered with an error; no answer at all means the
     request never completed — the watchdog says so out loud instead of failing silently */
  const run = async (endpoint: string, action: () => Promise<unknown>) => {
    if (busy) return;
    setBusy(true);
    setNotice('');
    setError(false);
    clearWatchdog();
    watchdog.current = window.setTimeout(() => {
      setNotice(`No reply from ${endpoint}. Check the dev-server log — MONGODB_URI, and SMTP for reset mail.`);
      setBusy(false);
    }, 8000);
    const failure = await action();
    clearWatchdog();
    setBusy(false);
    if (typeof failure === 'string' && failure.length) setNotice(failure);
  };

  const submit = () => {
    if (mode === 'recover') {
      if (step === 'form') {
        if (!validate(['email'])) return;
        setSentTo(values.email.trim());
        return void run('/api/auth/resetPassword/sendEmail', async () => {
          const failure = await sendEmail({
            email: values.email.trim(),
            setMessage,
            setError,
            setEmail: (next) => setValues((v) => ({ ...v, email: next ?? v.email })),
            setEmailSent: (sent) => setStep(sent ? 'code' : 'form'),
          });
          if (!failure) setStep('code');
          return failure;
        });
      }
      if (step === 'code') {
        if (!validate(['code'])) return;
        return void run('/api/auth/resetPassword/verifyResetCode', async () => {
          const failure = await verifyResetCode({
            code: values.code.trim(),
            setMessage,
            setError,
            setEmailSent: (sent) => setStep(sent ? 'code' : 'newpass'),
            setCodeVerified: (ok) => setStep(ok ? 'newpass' : 'code'),
          });
          if (!failure) setStep('newpass');
          return failure;
        });
      }
      if (!validate(['password'])) return;
      return void run('/api/auth/resetPassword/updatePassword', () =>
        updatePassword({ password: values.password, setMessage, setError, router }),
      );
    }

    if (mode === 'register') {
      if (!validate(['username', 'email', 'password'])) return;
      return void run('/api/auth/register', () =>
        registerUser({
          userName: values.username.trim(),
          email: values.email.trim(),
          password: values.password,
          setMessage,
          setError,
          router,
        }),
      );
    }

    if (!validate(['email', 'password'])) return;
    return void run('/api/auth/login', () =>
      loginUser({
        email: values.email.trim(),
        password: values.password,
        rememberMe,
        setMessage,
        setError,
        router,
      }),
    );
  };

  const masked = (sentTo || values.email).replace(/(^.).*(@.*)$/i, '$1•$2');
  const title = mode === 'signin' ? 'Sign in' : mode === 'register' ? 'Create an account' : step === 'newpass' ? 'Choose a new password' : 'Reset with a code';
  const invalid = (k: string) => (errors[k] ? 'true' : undefined);
  const errorLine = (k: string) => (errors[k] ? <p id={`${k}-msg`} className="wv-error" role="alert">{errors[k]}</p> : null);
  const hintLine = (k: string, text: string) => (errors[k] ? errorLine(k) : <p id={`${k}-msg`} className="wv-hint">{text}</p>);

  return (
    <Shell current="auth" nav={false}>
      <div className="wv-main w-full max-w-[440px] px-4 py-8 sm:px-6 sm:py-12">
        <a href="/" className="text-[var(--wv-text-xl)] font-semibold tracking-[-.015em] text-[var(--wv-ink)] no-underline hover:text-[var(--wv-blue-text)]">
          We<span className="text-[var(--wv-blue-text)]">Vibe</span>
        </a>

        <nav aria-label="Account flows" className="wv-auth-tabs mt-5 flex border-b border-[var(--wv-hair)]">
          {MODES.map((m) => (
            <a key={m.id} href={m.href} aria-current={mode === m.id ? 'page' : undefined} className="wv-tab">
              {m.label}
            </a>
          ))}
        </nav>

        <section aria-label="Account access" className="wv-card mt-5 p-4 sm:p-5">
          {mode === 'recover' && step === 'code' ? (
            <div className="od-stack gap-4">
              <div>
                <h1 className="wv-display m-0 text-[var(--wv-ink)]">Enter your code</h1>
                <p className="wv-hint mt-2">
                  A 6-digit code was sent to <span className="text-[var(--wv-blue-text)]">{masked}</span>. It expires 10 minutes after it arrives.
                </p>
              </div>
              <div className="wv-field">
                <label htmlFor="code" className="wv-label">6-digit code</label>
                <input
                  id="code" name="code" inputMode="numeric" autoComplete="one-time-code" maxLength={6}
                  value={values.code} onChange={set('code')} onBlur={() => validate(['code'])}
                  onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
                  aria-invalid={invalid('code')} aria-describedby="code-msg"
                  className="wv-input wv-code min-h-[56px] text-[var(--wv-text-xl)]"
                />
                {errorLine('code') ?? <p id="code-msg" className="wv-hint">Six digits, no spaces.</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={submit} disabled={busy} className={BTN_PRIMARY}>
                  {busy ? 'Checking…' : 'Verify code'}
                </button>
                <button
                  type="button" disabled={busy}
                  onClick={() => run('/api/auth/resetPassword/chooseAnotherEmail', () =>
                    chooseAnotherEmail({
                      setMessage,
                      setError,
                      setEmailSent: (sent) => setStep(sent ? 'code' : 'form'),
                      setResetCode: (digits) => setValues((v) => ({ ...v, code: digits.join('') })),
                    }),
                  )}
                  className={BTN}
                >
                  Use another email
                </button>
                <a href="/auth/login" className={`${BTN} ml-auto`}>
                  <IconClose /> Cancel
                </a>
              </div>
              {notice ? <p className="wv-error" role="alert">{notice}</p> : null}
            </div>
          ) : mode === 'recover' && step === 'newpass' ? (
            <div className="od-stack gap-4">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-[var(--wv-blue)] text-[var(--wv-blue-text)]"><IconCheck /></span>
              <div>
                <h1 className="wv-display m-0 text-[var(--wv-ink)]">Code verified</h1>
                <p className="wv-hint mt-2">Pick the new password for {masked}. It must differ from the old one.</p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate className="od-stack gap-4">
                <div className="wv-field">
                  <label htmlFor="password" className="wv-label">New password</label>
                  <div className="flex items-center gap-2 rounded-[10px] border border-[var(--wv-hair)] focus-within:border-[var(--wv-blue)]">
                    <input id="password" name="password" type={show ? 'text' : 'password'} autoComplete="new-password" maxLength={64} value={values.password} onChange={set('password')} onBlur={() => validate(['password'])} placeholder="8–64 characters"
                      aria-invalid={invalid('password')} aria-describedby="password-msg"
                      className="min-h-[44px] flex-1 border-0 bg-transparent px-3 text-[var(--wv-text-base)] text-[var(--wv-ink)] placeholder:text-[var(--wv-low)] focus:outline-none" />
                    <button type="button" onClick={() => setShow((v) => !v)} aria-pressed={show} aria-label={show ? 'Hide password' : 'Show password'} className="grid h-11 w-11 place-items-center border-l border-[var(--wv-hair)] text-[var(--wv-low)] hover:text-[var(--wv-blue-text)]">
                      <IconEye off={show} />
                    </button>
                  </div>
                  {hintLine('password', '8–64 characters.')}
                </div>
                <button type="submit" disabled={busy} className={`${BTN_PRIMARY} w-full`}>
                  {busy ? 'Saving…' : 'Save new password'}
                </button>
              </form>
              {notice ? <p className="wv-error" role="alert">{notice}</p> : null}
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate className="od-stack gap-5">
              <div>
                <h1 className="wv-display m-0 text-[var(--wv-ink)]">{title}</h1>
                <p className="wv-cap mt-2 m-0">
                  {mode === 'recover'
                    ? 'WeVibe mails a 6-digit code that stays valid for 10 minutes, then asks for a new password on this page.'
                    : mode === 'register'
                      ? 'Creating an account does not sign you in — sign in with this email afterwards.'
                      : 'Sign in with the email you registered with. Sessions are cookies: 14 days with Remember me, one hour without.'}
                </p>
              </div>

              {mode === 'register' ? (
                <div className="wv-field">
                  <label htmlFor="username" className="wv-label">Username</label>
                  <input id="username" name="username" autoComplete="username" maxLength={50} value={values.username} onChange={set('username')} onBlur={() => validate(['username'])} placeholder="Your name on WeVibe"
                    aria-invalid={invalid('username')} aria-describedby="username-msg" className="wv-input" />
                  {hintLine('username', '3–50 characters.')}
                </div>
              ) : null}

              <div className="wv-field">
                <label htmlFor="email" className="wv-label">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" maxLength={254} value={values.email} onChange={set('email')} onBlur={() => validate(['email'])} placeholder="you@example.com"
                  aria-invalid={invalid('email')} aria-describedby="email-msg" className="wv-input" />
                {hintLine('email', '6–254 characters.')}
              </div>

              {mode !== 'recover' ? (
                <div className="wv-field">
                  <label htmlFor="password" className="wv-label">Password</label>
                  <div className="flex items-center gap-2 rounded-[10px] border border-[var(--wv-hair)] focus-within:border-[var(--wv-blue)]">
                    <input id="password" name="password" type={show ? 'text' : 'password'} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} maxLength={64} value={values.password} onChange={set('password')} onBlur={() => validate(['password'])} placeholder="8–64 characters"
                      aria-invalid={invalid('password')} aria-describedby="password-msg"
                      className="min-h-[44px] flex-1 border-0 bg-transparent px-3 text-[var(--wv-text-base)] text-[var(--wv-ink)] placeholder:text-[var(--wv-low)] focus:outline-none" />
                    <button type="button" onClick={() => setShow((v) => !v)} aria-pressed={show} aria-label={show ? 'Hide password' : 'Show password'} className="grid h-11 w-11 place-items-center border-l border-[var(--wv-hair)] text-[var(--wv-low)] hover:text-[var(--wv-blue-text)]">
                      <IconEye off={show} />
                    </button>
                  </div>
                  {hintLine('password', '8–64 characters.')}
                </div>
              ) : null}

              {mode === 'signin' ? (
                <label className="flex min-h-[44px] cursor-pointer items-center gap-2.5">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="wv-checkbox accent-[var(--wv-blue)]" />
                  <span className="text-[var(--wv-text-sm)] text-[var(--wv-mid)]">Remember me — 14 days instead of 1 hour</span>
                </label>
              ) : null}

              <button type="submit" disabled={busy} className={`${BTN_PRIMARY} w-full`}>
                {busy ? 'Working…' : mode === 'signin' ? 'Sign in' : mode === 'register' ? 'Create account' : 'Send me a code'}
              </button>

              <p className="wv-cap m-0">
                {mode === 'signin' ? <>No account? <a href="/auth/register" className="text-[var(--wv-blue-text)] no-underline underline-offset-4">Create one</a> · <a href="/auth/resetpassword" className="text-[var(--wv-blue-text)] no-underline underline-offset-4">Forgot password</a></> : null}
                {mode === 'register' ? <>Already have an account? <a href="/auth/login" className="text-[var(--wv-blue-text)] no-underline underline-offset-4">Sign in</a></> : null}
                {mode === 'recover' ? <>Remember it? <a href="/auth/login" className="text-[var(--wv-blue-text)] no-underline underline-offset-4">Sign in instead</a></> : null}
              </p>

              {Object.keys(errors).length ? (
                <div className="wv-error-box">
                  <p className="wv-label m-0 mb-2 text-[var(--wv-danger-text)]">Fix these first</p>
                  <ul className="m-0 p-0 pl-4 text-[var(--wv-text-sm)] text-[var(--wv-mid)]">
                    {Object.entries(errors).map(([k, m]) => <li key={k}><a href={`#${k}`} className="text-[var(--wv-blue-text)] no-underline underline-offset-4">{k}</a> — {m}</li>)}
                  </ul>
                </div>
              ) : null}

              {notice ? <p className="wv-error" role="alert">{notice}</p> : null}
            </form>
          )}
        </section>
      </div>
    </Shell>
  );
}

export default Auth;
