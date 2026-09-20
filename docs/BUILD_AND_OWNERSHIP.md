# Build process, candor, and ownership

## Product evolution

Hangtime began as a social matching concept centered on finding other groups. Exploratory tester feedback changed the priority: students first wanted to know where people were going and understand the larger night. The team responded with the following sequence:

1. Shifted the first screen from groups to a destination map.
2. Added aggregate crowd direction and privacy-preserving location presentation.
3. Added accounts, individual profiles, and mutual-only identity disclosure.
4. Focused geography on Ohio State and the campus-to-downtown High Street corridor.
5. Added deals, events, food, cover, wait, peak time, and ride estimates.
6. Added demand-weighted map focus and district clusters.
7. Added a ranked destination panel with count and deal context.
8. Increased modeled content so the complete decision flow could be tested.

This is the core evidence-led revision: matching remains available, but it no longer defines the product's primary job.

## Current architecture

| Layer | Current implementation | Status |
|---|---|---|
| Client | React + Vite | Working |
| Map | Leaflet + OpenStreetMap | Working; tiles require network |
| Night data | Local modeled venues, crowds, waits, deals, and food | Working demonstration data |
| Events | Ticketmaster adapter with modeled fallback | Optional live feed when configured |
| Rides | Modeled estimates + Uber/Lyft deep links | Working estimates; not live quotes |
| Accounts | Browser-local adapter; optional Supabase | Prototype only unless Supabase is configured |
| Deployment | GitHub Actions to GitHub Pages | Working |
| Testing | Production build and manual interaction checks | Automated unit/E2E suite not yet implemented |

## What is built

- A deployed, responsive map-first product.
- Crowd clusters and demand-oriented map focus.
- Ranked destinations with crowd, wait, cover, deal, peak, and confidence context.
- Filters for crowds, deals, events, food, and rides.
- Crew intent, destination voting, and plan locking.
- Group discovery, member profiles, verification cues, and mutual matching states.
- Account creation and sign-in through a swappable auth adapter.
- Privacy language and approximate rather than precise public identity/location display.

## What is not built or proven

- Production live crowd telemetry and fraud resistance.
- Venue-confirmed deal and wait-time operations.
- Real-time Uber/Lyft price APIs.
- Production moderation, reporting, blocking, incident response, and age controls.
- A venue portal, billing, redemption verification, or analytics dashboard.
- Proven retention, acquisition cost, willingness to pay, or unit economics.
- Accessibility audit, penetration test, automated regression suite, or legal review.

## Team ownership record

Complete this table before submission. Each person should be able to explain and defend the work listed under their name.

| Team member | Role | Decisions owned | Artifacts built | Evidence collected | Next responsibility |
|---|---|---|---|---|---|
| `[Name]` | Product / founder | `[customer, scope, prioritization]` | `[screens/docs]` | `[interviews/tests]` | `[pilot responsibility]` |
| `[Name]` | Engineering | `[architecture/data choices]` | `[features/services]` | `[build/test proof]` | `[production responsibility]` |
| `[Name]` | Research / partnerships | `[study and pricing design]` | `[research/economic artifacts]` | `[participants/venues]` | `[recruiting/sales]` |

If this is a solo project, delete the extra rows and state that directly. Do not assign nominal roles to people who cannot explain the work.

## AI assistance disclosure

Suggested disclosure—edit it to match the actual process:

> AI tools assisted with implementation, interface iteration, documentation structure, and build verification. The founder supplied the venture direction and user feedback, selected product changes, reviewed the output, and owns the claims and decisions. No user evidence, revenue, traction, or test result was generated or represented as real by AI.

## Reproducibility

From the repository root:

```bash
npm install
npm run dev
npm run build
```

The source history and GitHub Pages workflow show the implemented changes. Environment variables for optional services are documented in the main README. Never publish secret keys in the repository.

## Next build gates

Engineering work should follow evidence, in this order:

1. Instrument the decision funnel and return behavior.
2. Add timestamped venue/status confirmation.
3. Implement reporting, blocking, moderation, and location expiration.
4. Configure production authentication and row-level access rules.
5. Build a minimal partner portal and redemption record.
6. Add automated tests and accessibility/security reviews.

Do not build broad city expansion or complex matching until the campus decision utility passes its core tests.
