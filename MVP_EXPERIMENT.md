# Hangtime MVP Experiment

## Named hypothesis

OSU student groups planning a night out lose time and momentum because crowd, price, venue, and group-preference information is split across group chats, social media, maps, and venue pages. If Hangtime combines those signals into a three-step planning flow, a group can confidently lock one destination in under five minutes.

## Most consequential uncertainty

The key uncertainty is not whether students like the interface. It is whether a group will use shared decision information to make and commit to a real destination faster.

## Target user, moment, and payer

- User: an OSU-area student who is coordinating a group of three or more people.
- Moment: the group intends to go out tonight but has not agreed on a first destination.
- Current alternatives: group chat, Instagram, Google Maps, venue websites, and calling or messaging venues.
- Proposed payer: campus-area venues and promoters that benefit from measurable group commitments.

## Core behavioral task

Without coaching, a qualified group must:

1. Configure the type, area, and start time of the night.
2. Inspect the destination signals.
3. Open the crew vote.
4. Lock one destination.

The task begins at `plan_started` and succeeds at `destination_locked`.

## Measures

- Primary measure: qualified groups that lock a destination / qualified groups that start a plan.
- Required denominator: every consented group that starts the task, including abandonments.
- Time measure: elapsed time between `plan_started` and `destination_locked`.
- Friction measure: groups needing moderator help / groups starting.
- Supporting behaviors: `destination_added`, `crew_vote_opened`, `deal_saved`, `introduction_requested`, and `venue_interest_submitted`.

## Precommitted decision rule

- Continue: at least 50% of qualified groups lock a destination within five minutes without moderator help.
- Change: 25-49% lock a destination, or at least 30% require help at the same step.
- Stop or reframe: fewer than 25% lock a destination.

This rule must not be changed after results are observed. Record exceptions separately.

## Payer test

Show the venue-interest screen to at least five venue owners, managers, or promoters. Record which offer they choose:

- $75/month plus $1 per redeemed offer
- $150/month flat
- $2 per redeemed group offer
- Interested, but pricing needs work

Do not describe interest as willingness to pay unless the respondent selects a price after seeing the full offer.

## Instrumentation

The prototype stores anonymous events locally in the browser. The footer's **Test evidence** control displays the count and exports JSON. It does not collect names, email addresses, precise locations, credentials, or message content.

## Ethics and consent

- Tell participants the product contains fictional or modeled information.
- Obtain consent before observation or recording.
- Do not ask participants to enter real passwords, handles, or precise locations.
- Report aggregate behavior and paraphrased comments unless explicit quotation consent is obtained.
- Participation is voluntary and can stop at any time.

