# Hangtime — rubric submission narrative

**One sentence:** Hangtime helps college crews decide where to go tonight by combining crowd direction, deals, events, food, rides, and private group coordination in one campus-focused view.

**Live product:** <https://haydendbucher.github.io/hangtime/><br>
**Presentation:** <https://haydendbucher.github.io/hangtime/pitch-deck.html><br>
**Repository:** <https://github.com/HaydenDBucher/hangtime>

## 1. Customer, pain, and payer — 15%

### Customer

The beachhead user is an 18–24-year-old college student making a same-night decision with friends near campus. The initial geography is Ohio State's campus-to-downtown Columbus nightlife corridor. The user is usually not planning an entire evening days ahead; they are answering a time-sensitive question: **where should we go next, and is it worth going?**

### Pain and current workaround

Night-out information is fragmented and decays quickly. A group checks group chats for availability, social feeds for activity, event pages for programming, venue pages for deals, maps for distance, and ride apps for price. Even after doing that work, nobody can confidently tell whether a destination is empty, overcrowded, expensive, or right for the group. The cost is wasted time, indecision, surge fares, missed deals, and a worse night.

### Payer

Students use the decision utility free. The economic buyer is a venue owner, general manager, or marketing manager who needs measurable student traffic rather than another undifferentiated social post. Event promoters and late-night food partners are secondary payers. Hangtime's payer proposition is promoted placement at the moment of intent, verified offer redemptions, and eventually aggregate demand analytics—never the sale of individual location or identity data.

### Why the two-sided model fits

Students receive useful information without a subscription. Venues pay only when Hangtime helps them reach nearby groups who are actively deciding. More useful supply makes the student tool better; more student intent makes venue promotion more valuable.

## 2. Hypothesis and honest test — 20%

### Core hypothesis

If college crews can see where aggregate crowds are moving, what is happening, what it costs, and what deals are available in one place, they will make a group decision faster and return on later nights out.

### Falsifiable tests

1. **Decision utility — frozen primary rule:** At least 50% of qualified groups lock a destination within five minutes without moderator help.
2. **Friction:** If 25–49% complete, or at least 30% require help at the same step, change the experience and retest. Below 25% is a stop-or-reframe result.
3. **Information trust:** At least 70% of pilot crowd, wait, and deal statuses remain accurate within a 20-minute window.
4. **Willingness to pay:** Show the complete offer to at least five qualified venue decision-makers. Price selection measures interest; willingness to pay requires at least two written commitments or deposits.

The two-week pilot, recruitment rules, comparison condition, metrics, and failure thresholds are specified in [EXPERIMENT_PLAN.md](EXPERIMENT_PLAN.md). These are **planned tests, not completed traction**. That distinction prevents friendly feedback from being presented as proof.

## 3. Working product and user path — 20%

The deployed MVP allows a visitor to:

1. Open directly into a campus nightlife dashboard without a login wall.
2. Read aggregate crowd clusters on a real map and scan a ranked list of destinations.
3. Filter for crowds, deals, events, food, or ride cost.
4. Open a destination to see crowd count, direction, wait, cover, peak time, deal, and estimated ride cost.
5. Mark a crew as heading there, compare options, vote, and lock a plan.
6. Browse optional crew matches and individual profiles while identities and direct handles remain private until mutual interest.
7. Create an account and retain a profile in the browser prototype; a Supabase adapter is ready for configured deployment.

The fastest judged-demo route is documented in [DEMO_SCRIPT.md](DEMO_SCRIPT.md). The current experience contains 18 modeled destinations, 14 modeled deals, four district clusters, ride estimates, and optional live Ticketmaster events.

### What is real vs. modeled

The interface, interaction path, map, filters, planning flow, voting, matching, profiles, privacy states, ride deep links, and deployment are working. Crowd counts, wait times, deals, and most event content are modeled demonstration data. Ride prices are estimates, not live quotes. Authentication defaults to local browser storage unless Supabase is configured. This is an honest product prototype, not yet a production safety or telemetry system.

## 4. Venture economics — 15%

The initial business model is free for students and paid by local venues:

- Partner listing and tools: **$75/month** base-price hypothesis.
- Verified redemption fee: **$1/redemption**.
- Alternatives under test: **$150/month flat** or **$2/redemption**.

In the base scenario, 20 campus partners pay $75/month and produce 400 total monthly redemptions at $1 each. Modeled revenue is $1,900/month. After $450 in variable and near-variable costs, modeled contribution is $1,450/month, or about 76% before labor and acquisition.

These figures are transparent assumptions—not historical performance. The downside scenario contributes only $330/month and exposes the central economic risk: a low-density campus cannot support labor even if it remains contribution-positive. Full assumptions, sensitivity, and validation priorities are in [VENTURE_ECONOMICS.md](VENTURE_ECONOMICS.md).

## 5. User evidence and revision — 15%

Early testers changed the product direction. The original concept emphasized matching one group with another. Test conversations instead surfaced a more immediate need: people wanted to understand **where everyone was going** and what the broader night looked like before committing.

That evidence led to concrete revisions:

| Before | Evidence heard | Revision |
|---|---|---|
| Individual group matching was the center of the product | Testers wanted visibility into where people were | Real map and privacy-preserving aggregate crowd clusters became the primary screen |
| “Vibe” and profile copy carried too much weight | Users cared more about what people planned to do | Destinations, timing, crowd direction, events, and plans now lead |
| The product was a social-matching experience | Users needed broader night-out utility | Deals, food, ride estimates, waits, cover, and rankings were added |
| Location visibility lacked safeguards | Location creates identity and safety concerns | Approximate group locations, hidden identities, mutual unlocks, and privacy explanations were added |
| A wide city view diluted usefulness | College nights are geographically concentrated | The experience was constrained to the campus–High Street–downtown corridor and recenters around demand |

The exact participant count, dates, and verbatim quotes were not supplied when this kit was created. They are deliberately left as required fields in [USER_RESEARCH.md](USER_RESEARCH.md) rather than invented.

## 6. Build process, candor, and team ownership — 15%

Hangtime was built iteratively as a React/Vite application using Leaflet and OpenStreetMap, optional Ticketmaster event ingestion, modeled ride estimates with Uber/Lyft deep links, a local-account adapter with optional Supabase, and GitHub Actions deployment. The product evolved from a groups-first social concept into a map-first decision utility in response to testing.

Current gaps are explicit: no production-grade live crowd telemetry, no verified deal feed, no live rideshare pricing integration, no complete moderation/reporting backend, no venue dashboard, no measured retention, and no signed payer commitments. Automated unit and end-to-end coverage are also still needed. These are the next validation and engineering priorities, not hidden shortcomings.

The ownership record and AI-assistance disclosure are in [BUILD_AND_OWNERSHIP.md](BUILD_AND_OWNERSHIP.md). Team names and role allocations must be completed before submission.

## Closing case

Hangtime's wedge is not “another social app.” It is a decision layer for a chaotic, recurring moment. The team has already made one meaningful evidence-led change: moving from profiles and matches toward the entire night-out ecosystem. The working MVP now makes that hypothesis testable. The next milestone is not more interface polish; it is a real two-week campus pilot that measures decisions, returns, data accuracy, and venue willingness to pay.
