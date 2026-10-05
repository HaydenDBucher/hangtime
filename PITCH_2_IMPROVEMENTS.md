# Hangtime: response to Pitch 2 feedback

Pitch 2 scored 85.81%. The priority is solution and differentiation (2.70/4), supported by stronger customer evidence (2.76/4) and milestones (2.90/4). Keep the finance case, but connect it to behavior we can observe.

## Code baseline

Reviewed the latest default-branch GitHub commit available on October 5, 2026: [172dc21, Expand campus nightlife deals, September 29](https://github.com/HaydenDBucher/hangtime/commit/172dc21258dadc470688403258cdacd47892e543). Fast-forwarded the clean local checkout to that commit before editing. These new changes are local, not published.

That version already provided a map and deals view, explained recommendations, a destination-lock flow, and fictional group matching. These are existing capabilities, not additions made in response to this feedback.

## What we changed now

| Before in the reviewed code | Implemented improvement | Customer benefit |
| --- | --- | --- |
| Long waits received only a small ranking penalty. | A crew can choose a maximum wait; the shortlist excludes ranges above that limit and unknown waits. | A popular place cannot override the crew's stated tolerance for waiting. |
| The crew was fixed at four, with seeded votes of 2, 1, 1. | Choose 3–8 people and pass one device around for one editable ballot per person. | The decision reflects the choices entered by the group. |
| A tied vote selected the first venue automatically. | All members must vote and ties must be resolved before locking. | The app does not manufacture agreement. |
| Direct voting could use the first three events rather than the recommendation ranking. | Direct voting uses the filtered, ranked shortlist; editing a plan clears its previous lock and ballot shortlist. | The decision stays consistent with the crew's latest preferences. |
| Ranked cards claimed distinct “best deal” and “easiest backup” roles without separate optimizations. | Neutral rank labels and an accurate explanation of the ranking inputs. | Users can understand what a recommendation actually means. |
| Deal cards claimed three members had committed. | Cards show preview offers and whether they were saved on this device. | A saved offer is not confused with a verified booking or redemption. |

## Revised product and differentiation

Hangtime helps an OSU-area group turn “where should we go?” into one agreed first stop. Its central workflow is **set the crew's constraints → compare an explained shortlist → vote → lock a destination**. Venue offers and optional introductions support that decision.

The differentiating product choice is to organize around a group decision for tonight: shared constraints, relevant destination information, and an explicit commitment in the same flow. The alternative identified in our experiment is coordinating those steps across chats, social feeds, maps, and venue pages. This is a positioning hypothesis; we have not established that competitors cannot offer similar features.

The current filters and interface are reproducible. A potential longer-term advantage would require dense campus adoption, reliable venue relationships, and permissioned evidence linking recommendations to confirmed arrivals and repeat use. None of those is claimed as an established moat today.

## Pitch language

“Four friends want to go out. Agreeing on the first stop is the hard part. Hangtime helps an Ohio State crew compare places, vote, and commit to one plan. Following the feedback, we made the decision more specific: crews can set a maximum wait, see why places are recommended, and record each person's vote before locking a winner. Our differentiation is a complete group-decision workflow for tonight. The prototype demonstrates that flow; our next test is whether it helps groups make an unassisted decision within five minutes and brings venues measurable visits.”

Demo: set a four-person crew and a 10-minute wait limit; inspect the shortlist and its reasons; cast all four ballots; demonstrate a tie and resolve it; lock the destination. State that venue waits, crowds, and offers are modeled. Show the saved-offer state without describing it as a redemption.

## Proposed six-week milestones, starting at pilot kickoff

These are targets, not completed results or a funded runway claim. Keep the existing experiment's precommitted thresholds unchanged.

| Timing | Deliverable and evidence | Decision |
| --- | --- | --- |
| Weeks 1–2 | Observe 20 consented OSU-area groups of 3+ people. Include every started task, abandonments, elapsed time, and moderator help. | Continue if at least 10 of 20 lock a destination within five minutes without help. Apply the existing change/stop rules otherwise. |
| Weeks 3–4 | Invite the same groups back; report how many of the original 20 voluntarily use Hangtime on another occasion. Proposed target: at least 6 of 20. | Treat repeat use as a separate hypothesis; revisit utility if the target fails. Do not change the first experiment's rules. |
| Weeks 3–6 | Interview five venue budget owners using the existing pricing options. Seek two written pilot agreements specifying price, offer, and a staff-confirmed redemption process. | Separate interest, signed commitments, and money received. If fewer than two agree, revise the payer offer before expanding. |
| Before performance billing | Implement venue-confirmed, deduplicated redemptions and audit them against staff records. | Do not bill for, or claim, verified visits based on offer saves or destination locks. |

For the next ask slide, tie the requested funding to crew coordination, pilot recruitment, and verified venue outcomes. Calculate runway from the actual ask and monthly cash burn; neither a new ask nor a burn figure was supplied for this revision.

## Remaining product work and evidence boundaries

- Ballots are entered on a shared device in an open voting session. They are not authenticated or synchronized across phones and reset when the voting dialog closes.
- Wait filtering uses modeled data and the upper end of each range; it does not guarantee the queue on arrival.
- Start time, age eligibility, budgets, and deal deadlines are not enforced by the recommendation engine. Add structured venue terms and eligibility checks before presenting recommendations as personally eligible offers.
- Deals, crowds, matches, and social signals remain demonstration data. Live event listings do not validate those signals.
- A later pilot should compare decision time against the group's usual workflow, with order counterbalanced, before claiming Hangtime is faster.
- No customer outcomes, real redemptions, revenue, or venue commitments were invented for this update.

## Validation

Run `npm run check` and `npm run build`. Decision tests cover wait-range boundaries, unknown waits, incomplete ballots, ties, unique winners, and removed candidates. Browser visual and multi-person usability testing remain to be completed.
