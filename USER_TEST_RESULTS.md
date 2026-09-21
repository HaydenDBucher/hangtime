# Hangtime User-Test Evidence

## Evidence status

No structured task-completion outcomes are claimed in this repository yet. One exploratory user interaction is recorded below because it materially influenced the product direction. Do not estimate, backfill, or convert that single directional interaction into a completion rate or broader market claim.

Earlier heuristic walkthroughs were used only for design preparation and are not counted as participant evidence.

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

## Optional structured follow-up protocol

The rubric does not prescribe a participant count. If a structured follow-up is conducted, recruit multiple independent OSU-area groups considering a night out and preserve every qualified start in the denominator. Give each group this neutral task:

> Your group wants to go out near campus tonight but has not agreed on where to start. Use Hangtime to choose and lock one first destination. Tell the moderator when you believe you are finished.

The moderator should not explain the interface. Help only if the group is fully blocked, and record that intervention.

## Consent script

> This is a course prototype containing fictional or modeled crowd, profile, match, and offer data. We are testing the planning flow, not you. We will record anonymous actions, completion time, and observations. Do not enter real credentials or personal information. You may stop at any time. Do you agree to participate?

## Session log

| Group | Date/context | Invited | Started | Locked destination | Time | Moderator help | Key observed behavior |
|---|---|---:|---:|---:|---:|---:|---|
| Structured follow-up | Not run | - | - | - | - | - | No structured completion claim is made |

## Aggregate results

- Groups invited: Not measured
- Groups that started: Not measured
- Groups that locked a destination: Not measured
- Completion rate: Not calculated
- Median time to lock: Not measured
- Groups requiring help: Not measured
- Decision-rule outcome: Not evaluated

## Behavioral funnel

| Event | Unique qualified groups | Conversion from previous step |
|---|---:|---:|
| `plan_started` | Not measured | - |
| `plan_configured` | Not measured | Not calculated |
| `crew_vote_opened` | Not measured | Not calculated |
| `destination_locked` | Not measured | Not calculated |

## Meaningful surprise

Two reported observations contradicted the original product assumptions: matching was less compelling than seeing the broader night, and the resulting information-rich screen became too crowded to follow. Because the interactions were informal, frequency was not measured.

## Consequential revision

- Evidence that triggered the changes: reported matching-first concern and later clarity/crowding feedback.
- Changes selected: pivot to map-and-planning-first, then simplify the first screen with progressive disclosure.
- Why these changes matter: users must understand the night and complete a destination decision before optional social discovery can create value.
- Commits containing the changes: `0faf2ec` documents the map-first pivot; `eb7cec7` implements the clarity revision.

## Verification retest

No verification retest is claimed. If one is conducted, repeat the same task with fresh participants or a justified comparable sample.

| Measure | Before | After | Interpretation |
|---|---:|---:|---|
| Completion rate | Not measured | Not measured | Not verified |
| Median decision time | Not measured | Not measured | Not verified |
| Help rate | Not measured | Not measured | Not verified |

## Evidence attachments

Store de-identified event exports and observation notes in a private course-evidence location. Do not commit participant names, emails, exact locations, credentials, photos, or raw recordings to this public deployment repository.
