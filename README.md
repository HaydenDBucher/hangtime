# Hangtime

A functional concept MVP for coordinating a night out. A crew can publish one lightweight plan, see where groups are gathering, browse events and venue offers, and privately match with another group.

## Venture submission kit

- [Rubric-mapped narrative](docs/RUBRIC_SUBMISSION.md)
- [One-page venture summary](docs/ONE_PAGE_SUMMARY.md)
- [Browser and print pitch deck](public/pitch-deck.html)
- [Product demo script](docs/DEMO_SCRIPT.md)
- [Falsifiable experiment plan](docs/EXPERIMENT_PLAN.md)
- [User research and revision record](docs/USER_RESEARCH.md)
- [Venture economics](docs/VENTURE_ECONOMICS.md)
- [Venue pilot LOI](docs/VENUE_PILOT_LOI.md)
- [Build, candor, and ownership](docs/BUILD_AND_OWNERSHIP.md)
- [Final submission checklist](docs/RUBRIC_CHECKLIST.md)

Live presentation: [haydendbucher.github.io/hangtime/pitch-deck.html](https://haydendbucher.github.io/hangtime/pitch-deck.html)

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

## MVP evidence packet

- [`RUBRIC_EVIDENCE.md`](RUBRIC_EVIDENCE.md): criterion-by-criterion evidence map and claim boundaries.
- [`CUSTOMER_PAYER_CASE.md`](CUSTOMER_PAYER_CASE.md): specific customer, costly job, alternatives, urgency, payer, and buying logic.
- [`MVP_EXPERIMENT.md`](MVP_EXPERIMENT.md): named hypothesis, behavioral measure, denominator, and precommitted decision rule.
- [`DECISION_RULE_RECEIPT.md`](DECISION_RULE_RECEIPT.md): frozen rule, qualification standard, and team acknowledgement.
- [`USER_TEST_RESULTS.md`](USER_TEST_RESULTS.md): consent-safe protocol and results/retest structure. It intentionally contains no invented outcomes.
- [`VENTURE_ECONOMICS.md`](VENTURE_ECONOMICS.md): payer, pricing, contribution logic, acquisition path, and cash implication.
- [`BUILD_LOG.md`](BUILD_LOG.md): build decisions, automated assistance, human verification, failures, and limitations.
- [`TEAM_OWNERSHIP.md`](TEAM_OWNERSHIP.md): responsibility and command-of-evidence receipt.
- [`LIMITATIONS.md`](LIMITATIONS.md): product, data, safety, account, and business boundaries.
- [`SIMULATED_USABILITY_REVIEW.md`](SIMULATED_USABILITY_REVIEW.md): clearly labeled heuristic walkthrough used to prepare the interface for real testing; it is not validation evidence.
- [`QA_CHECKLIST.md`](QA_CHECKLIST.md): automated release checks, implemented reliability behavior, and unclaimed manual QA.

The prototype records a minimal anonymous behavioral funnel in browser storage. Use **Test evidence** in the footer to inspect and export those events. Review all exports before sharing them.
