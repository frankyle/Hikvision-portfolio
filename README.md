# Field Training Desk

A record site for Frank's Hikvision installer/technician trainings — built the same way as
his other tools (React + Tailwind + Framer Motion + Supabase), so it can go straight onto
Vercel next to MGI-STRATEGY.

## What's in it

1. **Training Programs** — the five recurring courses (CCTV & Audio, Access Control &
   Video Intercom, Gate Motor/Energizer/AX Pro, Networking, Fire Alarm). Log a session
   (company, week, date, technicians trained), attach the 3 photos + 1 clip (≤60s,
   enforced client-side), and download a branded PPTX report for that session in one click.
2. **Device Video Library** — short tutorials (≤5 min) per device, for technicians to
   watch on-site.
3. **Field Projects** — completed installations technicians did (CCTV, gate motor,
   electric fence & access control, fire alarm), 4 site photos + 1 walkthrough clip each.

## Running it locally

```bash
yarn install
cp .env.example .env   # then fill in your Supabase project URL + anon key
yarn dev
```

Without a `.env` file the site still runs — uploads and new entries are kept in memory for
the current browser tab only (useful for a quick look, not for real KPI reporting).

## Connecting Supabase (for real, persistent uploads)

1. Create a free project at supabase.com.
2. In the SQL editor, run `supabase-schema.sql` from this folder.
3. In Storage, create three **public** buckets: `training-media`, `device-videos`,
   `project-media`.
4. Copy your project URL and anon key into `.env` (see `.env.example`).
5. Restart `yarn dev` — uploads now persist for everyone who opens the site, and the
   session/video/project lists load from your database on page load.

## Deploying

This is a standard Vite app — push it to a GitHub repo and import it into Vercel like
MGI-STRATEGY. Add the two `VITE_SUPABASE_*` variables in Vercel's Environment Variables
settings before the first deploy.

## Notes on the report button

The "Download report (PPTX)" button on each session builds the deck in the browser
(`pptxgenjs`) from that session's photos — no server needed. It needs at least one photo
attached to a session before it will generate. The video clip isn't embedded in the slide
(PPTX doesn't handle that well from a URL); the deck links to it instead.
