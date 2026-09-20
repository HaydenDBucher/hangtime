# User research and revision record

## Evidence actually available

Exploratory testers said they wanted to know where people were going and cared more about the overall night-out ecosystem than individual group matching. They wanted planning help, deals, location context, and information about the night. Security and discretion became more important once location was introduced.

**Confidence:** directional, not conclusive.<br>
**Participant count:** `[enter exact number]`<br>
**Research dates:** `[enter dates]`<br>
**Recruiting source:** `[enter how participants were recruited]`<br>
**Raw notes or recordings:** `[link or location]`

No exact count, demographics, task results, or verbatim quotes were supplied when this document was prepared. Do not call this validation until those fields are completed.

## Evidence-to-decision chain

| Observation | Interpretation | Product decision | Current proof |
|---|---|---|---|
| Testers wanted to know where people were going | Destination confidence comes before meeting strangers | Make a map and crowd ranking the first screen | Working MVP |
| Broader ecosystem mattered more than individual groups | Hangtime's primary job is decision support | Add events, deals, food, rides, cover, wait, and crowd direction | Working MVP, data mostly modeled |
| Plans mattered more than abstract “vibe” language | Concrete intent is more useful than personality copy | Emphasize destination, timing, and next move | Working MVP |
| Location created security questions | Raw individual location would undermine trust | Aggregate counts, approximate groups, and hide identity until mutual match | UI behavior implemented; not production security |
| College use is geographically concentrated | A broad map adds noise | Limit the map to the campus–downtown corridor and recenter on demand | Working MVP |

## Before and after

**Original thesis:** Students primarily need help discovering and matching with other groups for a night out.

**Revised thesis:** Students first need a trustworthy, fast picture of the night—where crowds are moving, what is happening, what it costs, and what their friends prefer. Group matching remains an optional layer after a destination becomes relevant.

This is a meaningful revision because it changes the home screen, product hierarchy, data requirements, safety model, payer value proposition, and core success metric.

## Required quote cards

Insert three exact quotes from notes or recordings. Do not clean up grammar beyond removing identifying details.

1. “`[verbatim quote about not knowing where people are going]`” — Participant `[ID]`, `[date]`
2. “`[verbatim quote about deals/events/rides or planning]`” — Participant `[ID]`, `[date]`
3. “`[verbatim quote about privacy/security]`” — Participant `[ID]`, `[date]`

Also include one adverse or skeptical quote:

4. “`[verbatim quote expressing doubt, disinterest, or a trust concern]`” — Participant `[ID]`, `[date]`

## Evidence quality risks

- Friends and classmates may be unusually supportive.
- Asking whether someone “likes” the idea measures politeness, not behavior.
- A polished prototype can inflate stated intent.
- Friday behavior may not generalize to weeknights, game days, or other campuses.
- Crowd and deal data only create value if they are recent and credible.
- Safety claims require operational controls, not just interface language.

## What to collect next

Use the neutral tasks in [INTERVIEW_GUIDE.md](INTERVIEW_GUIDE.md). Record completion time, unprompted clicks, chosen destination, confidence before/after, whether the plan was shared, and whether the participant returns on a later night. Log every session in `EVIDENCE_LOG.csv`, including failures and contradictions.
