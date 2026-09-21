# Hangtime Build, User-Feedback, and AI-Use Log

## Purpose

This document records why Hangtime changed, what was implemented, which input came from a real user, what was inferred by the project owner, what automated tools contributed, and what remains unproven. It is the repository's chronological build record and should be read with `USER_TEST_RESULTS.md`, `MVP_EXPERIMENT.md`, and `LIMITATIONS.md`.

Live product: <https://haydendbucher.github.io/hangtime/><br>
Repository: <https://github.com/HaydenDBucher/hangtime>

## Evidence labels used in this log

- **Observed user input:** feedback reported from an actual user interaction.
- **Product interpretation:** the project owner's conclusion from that input.
- **Implemented:** visible or executable in the repository and deployed product.
- **Modeled:** product data created to demonstrate or test the experience; not live behavior.
- **Unvalidated:** a claim that still requires an external behavioral or payer test.

## The consequential user input

### Source and boundary

- Evidence type: one exploratory user interaction reported by the project owner.
- Feedback added to the record: September 20, 2026.
- Original interaction date, participant characteristics, recording, and structured task results: not recorded in the information supplied to the repository.
- Evidence strength: useful directional evidence, but not a completed usability study or proof of demand.

### Feedback supplied by the project owner

> “The matching itself felt off, but the ability to follow trends, see where people are, like a one spot hub for going out and seeing where people are.”

This wording is preserved as supplied by the project owner. It is not represented as a verified transcript or as the opinion of multiple participants.

### Product interpretation

The feedback challenged the original matching-first value proposition. Matching strangers was not the strongest reason for this user to open Hangtime. The more natural utility was seeing the overall movement of a night in one place: where crowds were forming, what destinations were becoming active, what was happening there, what offers were available, and what it would cost to get there.

The team therefore changed the primary job from **“find another group”** to **“understand tonight and help my existing group choose where to go.”** Matching remains an optional layer after a group has selected a destination and time.

## Feedback-to-build traceability

| User input or resulting question | Product decision | Implemented response | Intended user value | Evidence status |
|---|---|---|---|---|
| “The matching itself felt off” | Stop leading with stranger matching | Destination planning leads; matching becomes available after a plan is locked | Keeps the product focused on an immediate, lower-friction job | Implemented; effect not yet behaviorally measured |
| User valued following trends | Show movement and momentum rather than static listings | Crowd direction, trend indicators, peak time, demand-weighted focus, and ranked destinations | Helps a group see where the night is building | Implemented with modeled data |
| User wanted to see where people are | Make geography the main interface | Real Leaflet/OpenStreetMap view with aggregate crowd clusters and venue markers | Makes destination activity spatial and quickly understandable | Implemented; crowd signals modeled |
| User described a “one spot hub” | Combine fragmented planning inputs | Events, deals, food, waits, cover, crowd counts, confidence, and plan controls share one dashboard | Reduces switching among chats, social feeds, maps, venue pages, and ride apps | Implemented; decision-time benefit unvalidated |
| A campus night is geographically concentrated | Avoid an unfocused citywide map | Campus radius, map masking, High Street-to-downtown corridor, and south-weighted framing | Keeps every visible option plausibly relevant to an OSU night | Implemented |
| Popularity alone is insufficient | Add practical tradeoffs beside crowd counts | Destination ranking shows count, trend, wait, cover, peak time, deal, and contextual recommendation | Allows a group to compare where people are with whether going there is worthwhile | Implemented with modeled status |
| Deals can change the destination decision | Surface value at the moment of choice | Deal lens, venue offers, save action, and promoted partner concept | Helps students spend less and gives venues a measurable conversion path | Implemented concept; offers and economics unvalidated |
| Transportation changes the real cost of a night | Include travel before commitment | Modeled Uber/Lyft ranges from Ohio Union and provider deep links | Lets a group consider total cost and distance in the same decision | Implemented estimates; not live prices |
| Location utility can create privacy risk | Show trends without exposing individuals | Aggregate clusters, approximate group locations, reversible status, mutual disclosure, report/block controls | Preserves usefulness while reducing tracking and identity exposure | Interface implemented; production safety operations incomplete |

## Complete build chronology

| Date | Commit | Product question | Human/product decision | Implementation | Verification and limitation |
|---|---|---|---|---|---|
| 2026-09-08 | `623fc79` | Can a crew coordinate a night in one interface? | Build a functional concept instead of a static landing page | Launched the React/Vite Hangtime pitch MVP | Deployed concept; no behavioral evidence |
| 2026-09-08 | `8a0381a` | What visual direction makes the product approachable? | Explore a lighter social presentation | Refreshed the visual theme | Aesthetic choice, not user validation |
| 2026-09-15 | `91013e0` | Should matching or tonight discovery lead? | Begin moving toward the night itself | Redesigned the experience around tonight discovery | Directional revision; core task not yet instrumented |
| 2026-09-15 | `18b2b30` | How can social discovery contain enough context? | Add real-looking profiles but keep plans primary | Added member photos, profiles, and plan-first matching | Profiles and people are fictional concept data |
| 2026-09-17 | `fd17070` | Can the product become a broader night-out utility? | Combine planning, destination, event, deal, and transport context | Added the night-out decision-layer structure | Several data sources remain modeled |
| 2026-09-17 | `eefbd2b` | What should a visitor see first? | Put the map first and allow account creation | Reordered the main experience; added account flows | Local accounts are not production authentication |
| 2026-09-17 | `3db63ff` | Does the product feel distinctive and legible? | Refine typography, palette, hierarchy, and spacing | Reworked the visual system | Requires formal accessibility testing |
| 2026-09-17 | `5156379` | Can crowd direction be represented geographically? | Use a real map with privacy-preserving activity | Added Leaflet/OpenStreetMap, crowd clusters, and venue markers | Map is real; crowd activity is modeled |
| 2026-09-17 | `a0b4877` | Who is the initial customer and geography? | Focus on college nights around Ohio State | Added campus language, OSU-centered content, and rideshare context | Geographic wedge selected; market size unvalidated |
| 2026-09-17 | `3866887` | Is the map consuming too much attention? | Make it a compact decision dashboard | Reduced map footprint; added Crowds, Deals, Events, Food, and Rides lenses | Implemented and manually reviewed |
| 2026-09-17 | `e9114ce` | Should users see destinations outside the relevant area? | Lock interaction to a campus radius | Constrained map bounds and filtered results | Radius is a product assumption |
| 2026-09-17 | `fd5d827` | Can irrelevant map detail still distract? | Hide visual geography outside the intended zone | Added campus masking and tighter boundary behavior | Implemented |
| 2026-09-17 | `83f903a` | Where should the map focus as the night changes? | Center around aggregate demand rather than a fixed point | Added crowd-weighted focal behavior | Demand input remains modeled |
| 2026-09-20 | `c55b873` | Is the nightlife corridor too campus-north heavy? | Represent High Street through Short North toward downtown, favoring the south side | Expanded venue/deal/group data and adjusted corridor framing | Content density is demonstrative, not traction |
| 2026-09-20 | `0b5c454` | Can users interpret the map without opening every marker? | Put a ranked explanation beside it | Added venue rankings with crowd count and deal summary | Implemented; ranking inputs modeled |
| 2026-09-20 | `59b0b64` | Does the product make its core decision testable? | Require a plan, comparison, vote, and destination lock before matching | Added the three-step flow, explicit vote, post-lock matching, modeled-data banner, report/block actions, and anonymous event instrumentation | Working path implemented; external completion results not claimed |
| 2026-09-20 | `633f3e9` | Can the evidence and release process be audited? | Freeze decision rules and fail the build if core evidence controls disappear | Added evidence index, payer case, rule receipt, limitations, QA documentation, persistent state, and automated checks in CI | Automated checks do not replace real users or device QA |
| 2026-09-20 | `68ee87a` | How should the course submission be packaged? | Consolidate the rubric case into one Word document | Added `Hangtime_Rubric_Submission.docx` and removed a redundant multi-file presentation package | Document uses only supplied evidence and labeled assumptions |

## Current working product

The deployed MVP currently supports:

1. An OSU-focused map-first entry without a login wall.
2. Aggregate district and crowd visualization on a real map.
3. Destination rankings with counts, trends, wait, cover, peak time, and deal context.
4. Lenses for crowds, deals, events, food, and ride cost.
5. A three-step plan flow: configure, compare, vote, and lock.
6. Reversible “considering,” “heading there,” and “here now” intent.
7. Optional group profiles and matching after destination commitment.
8. Prototype accounts through local browser storage, with an optional Supabase adapter.
9. Anonymous browser-local experiment events and JSON export.
10. A venue-interest flow that presents explicit pricing choices.

## What the user feedback did not prove

One exploratory interaction does not establish frequency, market size, retention, completion rate, data trust, or willingness to pay. It does not show that the revised map-first product outperforms the original experience. The feedback justified a product hypothesis and a build direction; the frozen experiment must now test the result.

## Second user-informed clarity revision

The project owner later reported another user's feedback that the screen and instructions looked crowded and were hard to follow. The product interpretation was that too many elements were asking for attention before the user understood the next action. The resulting revision replaced the three-card instruction block with one next-step row, shortened the hero copy, limited the initial data lenses, delayed plan summaries and recommendations until configuration, delayed matching until destination lock, collapsed the full prototype disclosure, and reduced the initial night-type choices. This revision is implemented but not yet behaviorally verified.

The primary rule remains:

- **Continue:** at least 50% of qualified groups lock a destination within five minutes without moderator help.
- **Change:** 25–49% complete, or at least 30% need help at the same step.
- **Stop or reframe:** fewer than 25% complete.

## Data and safety boundaries

- Crowd counts, movement, waits, cover, deals, network overlap, profiles, and matches are fictional or modeled unless explicitly labeled live.
- Ticketmaster events can be live when configured, but do not validate crowd or social signals.
- Uber and Lyft values are estimates; provider links open the current external quote.
- Public activity should remain aggregate. Production location data requires consent, minimization, expiry, abuse controls, and an audited response process.
- Browser-local authentication is suitable for the concept only. Testers should not use real or reused credentials.

## AI and tool contribution

AI-assisted development helped implement interface iterations, code changes, documentation structure, and automated verification. The project owner supplied the product direction and user feedback, chose the feature priorities, reviewed outputs, and owns the final claims. AI-generated walkthroughs are labeled simulated and are not counted as user evidence. No participant, quote, result, revenue, or payer commitment was fabricated.

## Verification checklist for every release

- Review the diff and explain every material product choice.
- Confirm no participant data, secrets, or precise user locations are committed.
- Run `npm run check` and confirm every rubric/flow check passes.
- Run `npm run build` and verify the GitHub Pages workflow succeeds.
- Test plan start through destination lock with keyboard and pointer input.
- Test mobile width, empty search, API fallback, sign-in errors, and modal dismissal.
- Confirm modeled and fictional data remain clearly labeled.
- Record failures, contrary user feedback, and the correcting commit.

## Human command of the work

Product direction, interpretation of reported user interactions, prioritization, review, and final submission claims remain human-controlled. Presenters should be able to explain the product, evidence, economics, limitations, and AI contribution without relying on nominal role assignments.
