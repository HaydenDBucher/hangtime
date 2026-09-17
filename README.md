# Hangtime

A functional concept MVP for coordinating a night out. A crew can publish one lightweight plan, see where groups are gathering, browse events and venue offers, and privately match with another group.

## Run locally

```powershell
npm run dev
```

Open [http://localhost:5173/hangtime/](http://localhost:5173/hangtime/).

If dependencies need to be restored, run `npm install` first.

## Core MVP flow

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

## Live events

The app works immediately with a clearly labeled local event preview. To load the current Columbus lineup from Ticketmaster Discovery:

1. Copy `.env.example` to `.env`.
2. Add a Ticketmaster Discovery API key as `VITE_TICKETMASTER_API_KEY`.
3. Restart the development server.

This browser-side integration is appropriate for the concept MVP. Before production, route event requests through a small serverless proxy so credentials, caching, and quotas can be managed centrally.

## Production check

```powershell
npm run build
npm run preview
```

GitHub Pages deploys automatically from `main` using the workflow in `.github/workflows`.
