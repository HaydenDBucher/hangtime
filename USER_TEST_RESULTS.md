# Hangtime User-Test Evidence

## Evidence status

No structured task-completion outcomes are claimed in this repository yet. One exploratory user interaction is recorded below because it materially influenced the product direction. Do not estimate, backfill, or convert that single directional interaction into a completion rate or broader market claim.

The separate `SIMULATED_USABILITY_REVIEW.md` contains hypothetical walkthroughs used for design preparation. Its scenarios and predictions must not be copied into the tables below as participant evidence.

## Exploratory input that informed the current build

- Participants represented: one user.
- Interaction date and participant characteristics: not supplied.
- Date added to the repository: 2026-09-20.
- Method: informal exploratory interaction reported by the project owner; not the structured task below.
- Wording supplied by the project owner: “The matching itself felt off, but the ability to follow trends, see where people are, like a one spot hub for going out and seeing where people are.”

### Interpretation and revision

The input suggested that matching strangers was not the strongest opening value for this user. The useful job was following nightlife movement and gathering fragmented information in one place. The product therefore moved from matching-first to map-and-planning-first. The resulting build added or emphasized:

- a real geographic map with aggregate crowd clusters;
- campus and nightlife corridor zones;
- demand direction and ranked destinations;
- deals, events, food, waits, cover, and ride estimates;
- an explicit group plan, vote, and destination lock;
- optional matching only after a destination is locked.

This is evidence of a user-informed revision, not evidence that the revision succeeded. Success must be measured with the unchanged task and decision rule below.

## Second exploratory input about clarity

- Participants represented: one additional reported user interaction.
- Interaction date and participant characteristics: not supplied.
- Date added to the repository: 2026-09-20.
- Method: informal feedback reported by the project owner; not the structured task below.
- Feedback supplied by the project owner: the screen and instructions looked crowded and were hard to follow.

### Interpretation and revision

The feedback identified information hierarchy, not missing functionality, as the problem. The first screen presented a large headline, three instruction cards, a disclosure banner, five data lenses, search and view controls, the map, and a full plan summary before the user had taken an action.

The revision reduced simultaneous choices and introduced progressive disclosure:

- replaced three instruction cards with one current-next-step row;
- shortened the headline and supporting sentence;
- showed three primary data lenses plus a single **More** control before setup;
- hid the full plan summary and recommendation cards until the plan is configured;
- hid matching navigation and content until a destination is locked;
- collapsed the modeled-data explanation behind a short visible label;
- showed four common night types first, with additional choices on request;
- simplified modal headings and final action language.

This is a consequential clarity revision based on reported feedback. Its success is not yet verified; the structured task must measure whether users complete the path with less help and confusion.

## Test protocol

Recruit 5-8 independent groups of 3-5 OSU-area students who are considering a night out. Use at least two dates or planning contexts. Give each group this neutral task:

> Your group wants to go out near campus tonight but has not agreed on where to start. Use Hangtime to choose and lock one first destination. Tell the moderator when you believe you are finished.

The moderator should not explain the interface. Help only if the group is fully blocked, and record that intervention.

## Consent script

> This is a course prototype containing fictional or modeled crowd, profile, match, and offer data. We are testing the planning flow, not you. We will record anonymous actions, completion time, and observations. Do not enter real credentials or personal information. You may stop at any time. Do you agree to participate?

## Session log

| Group | Date/context | Invited | Started | Locked destination | Time | Moderator help | Key observed behavior |
|---|---|---:|---:|---:|---:|---:|---|
| G01 | TBD |  |  |  |  |  |  |
| G02 | TBD |  |  |  |  |  |  |
| G03 | TBD |  |  |  |  |  |  |
| G04 | TBD |  |  |  |  |  |  |
| G05 | TBD |  |  |  |  |  |  |

## Aggregate results

- Groups invited: TBD
- Groups that started: TBD
- Groups that locked a destination: TBD
- Completion rate: TBD / TBD = TBD%
- Median time to lock: TBD
- Groups requiring help: TBD / TBD = TBD%
- Decision-rule outcome: Continue / Change / Stop (select after calculating)

## Behavioral funnel

| Event | Unique qualified groups | Conversion from previous step |
|---|---:|---:|
| `plan_started` | TBD | - |
| `plan_configured` | TBD | TBD% |
| `crew_vote_opened` | TBD | TBD% |
| `destination_locked` | TBD | TBD% |

## Meaningful surprise

Record a behavior that contradicted the team's expectation. Include how often it occurred and why it affects the hypothesis. TBD after testing.

## Consequential revision

- Evidence that triggered the change: TBD
- Change selected: TBD
- Why this change matters to the core hypothesis: TBD
- Commit or release containing the change: TBD

## Verification retest

Repeat the same task with at least three fresh groups or a justified comparable sample.

| Measure | Before | After | Interpretation |
|---|---:|---:|---|
| Completion rate | TBD | TBD | TBD |
| Median decision time | TBD | TBD | TBD |
| Help rate | TBD | TBD | TBD |

## Evidence attachments

Store de-identified event exports and observation notes in a private course-evidence location. Do not commit participant names, emails, exact locations, credentials, photos, or raw recordings to this public deployment repository.
