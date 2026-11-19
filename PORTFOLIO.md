---
name: WeVibe
subtitle: A landscape-photo feed where the sessions and the threads hold
description: A social platform for landscape photography built end to end — feed, likes, two-level threaded replies, profiles, JWT sessions and image uploads kept out of the records.
category: Web platform
stack:
  - Next.js
  - TypeScript
  - MongoDB
  - Mongoose
  - Tailwind CSS
  - JWT (jose)
  - bcrypt
  - ImageKit
  - Nodemailer
  - Vercel
status: live
year: 2024 — present
role: Solo — data model, auth, interface, deployment
cover: docs/portfolio/wevibe-home.jpg
gallery:
  - docs/portfolio/wevibe-feed.jpg
  - docs/portfolio/wevibe-discover.jpg
  - docs/portfolio/wevibe-profile.jpg
  - docs/portfolio/wevibe-login.jpg
live: https://we-vibe.vercel.app
tags:
  - social
  - auth
  - images
  - comments
updated: 2026-11-19
---

## Overview
A feed of landscape photography with the parts a feed needs to be more than a list: accounts that
survive a reload, comments that nest under other comments, likes that persist, and uploads that stay
out of the database row.

## Problem
The versions I kept finding stopped at the feed. The interesting work — a reply that belongs to a
comment rather than to a post, a session that lasts, an image stored somewhere other than the
document that references it — was the part nobody showed done properly.

## Solution
Posts, comments and replies are separate Mongoose collections with parent references, so one thread
renders from a single query instead of a chain of them. Sessions are JWTs signed with `jose`;
passwords are hashed with bcrypt; the verification mail goes through Nodemailer. Images upload to
ImageKit and the document keeps only the URL. Reads go through server components, mutations through
server actions, and every mutation route re-reads the session from the cookie rather than trusting
what the client sent.

## Key features
- Infinite feed in batches of eight, with a shuffled deck that does not repeat what is on screen
- Likes, and comments with one level of replies under them
- Profiles with posts, a with-media tab, followers and following lists
- Meet people: every account ordered by followers, each one followable in place
- Search by username, profile editing, email and password change, account deletion behind a
  password confirmation
- Verified badges granted by the site, never chosen by the account
- Loading states that show the shape of what is arriving instead of a button that changes its mind

## Architecture
Next.js app router on Vercel, MongoDB (Atlas) with Mongoose documents for users, posts, comments and
replies. Public catalogue pages use time-based revalidation so repeat visits do not touch the
database. The interface is one stylesheet of design tokens plus Tailwind utilities, with a bottom
tab bar under 640px and a left rail above it. Sessions are cookies: fourteen days with Remember me,
one hour without.

## Challenges
The first thread model needed one query per comment and fell over on long threads; replies moved
into their own collection. Feed paging flickered because the scroll observer was rebuilt on every
loading flip and re-fired for a strip already on screen — the guard now lives in a ref, and the
observer is rebuilt only when the tab changes. Controls that depend on who is signed in pulse while
the session is being read, so a Follow button never paints on your own profile and flips a beat
later.

## Results
Live on Vercel with a working feed, likes, threaded replies, editable profiles and account deletion.
Built and maintained by one person across the data model, the auth, the upload pipeline and the
interface.

## Future
Two levels of reply is a deliberate limit; deeper nesting is not planned until there is a reason for
it.
