# Hangtime

A functional concept MVP for coordinating a night out. A crew can publish one lightweight plan, see where groups are gathering, browse events and venue offers, and privately match with another group.

## Run locally

```powershell
npm run dev
```

Open [http://localhost:5173/hangtime/](http://localhost:5173/hangtime/).

If dependencies need to be restored, run `npm install` first.

## Core MVP flow

- Open directly into an Ohio State campus map with venue search, crowd filters, and zoom controls.
- Set the crew, area, type of night, and start time in one screen.
- Explore an activity heat map with crowd trend, wait, cover, peak-time, and confidence signals.
- Mark a venue as considering, heading there, or here now without exposing an individual's location.
- Run a one-tap crew destination vote and lock the winner as the plan.
- Compare best-overall, best-deal, and best-people recommendations.
- Unlock time-sensitive group offers when the crew commits.
- Sort compatible groups by plan, shared places, timing, or mutuals.
- See fictional member photos and open individual profiles before matching.
- Review verification, linked-account, and mutual-connection signals.
- Keep direct social handles and messaging private until both groups match.
- Unlock connected accounts and the shared group chat after mutual interest.
- Pause introductions completely while keeping the private crew plan active.
- Create an account, sign in, persist a session, edit a profile and crew, and sign out.
- Preview the likely ride range from Ohio Union, then open Uber or Lyft for the live fare.

## Accounts

The public prototype supports browser-local accounts so the complete interface can be tested immediately. Those accounts never leave the current browser and must not be used for real credentials.

For production authentication, add these values to `.env`:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

When both values exist, Hangtime automatically uses Supabase email/password authentication instead of the local prototype adapter. Configure email verification, allowed redirect URLs, row-level security, abuse protection, and age/compliance requirements in Supabase before onboarding real users.

## Campus events

The app works immediately with a clearly labeled Ohio State-area event preview. To load the current lineup within three miles of campus from Ticketmaster Discovery:

1. Copy `.env.example` to `.env`.
2. Add a Ticketmaster Discovery API key as `VITE_TICKETMASTER_API_KEY`.
3. Restart the development server.

This browser-side integration is appropriate for the concept MVP. Before production, route event requests through a small serverless proxy so credentials, caching, and quotas can be managed centrally.

## Rideshare estimates

The public MVP shows clearly labeled modeled ride ranges from Ohio Union and opens each provider separately for the current fare. It does not claim those preview amounts are live.

Uber's live price endpoint requires provider approval, and its terms restrict competitive price-comparison use. Production estimates should therefore use approved, server-side provider integrations and respect each provider's display and branding requirements. `VITE_UBER_CLIENT_ID` is optional and only improves the Uber ride-request deep link; it does not enable live pricing.

## Production check

```powershell
npm run build
npm run preview
```

GitHub Pages deploys automatically from `main` using the workflow in `.github/workflows`.
