# Falsifiable hypotheses and honest test plan

## The riskiest assumptions

1. Students will use aggregate crowd and deal information to make an actual destination decision.
2. They will trust the information enough to return on another night.
3. Crowd, wait, and deal data can stay current without unsafe identity exposure.
4. Venues will pay for measurable demand and redemption rather than impressions alone.

## Pre-registered hypotheses

| ID | Hypothesis | Primary measure | Pass threshold | Failure / action |
|---|---|---|---|---|
| H1 | A map-first utility reduces decision friction | Percent of qualified crews that choose and share/lock a destination in ≤2 minutes, without hints | ≥40% | <25%: revisit the core job and information hierarchy; 25–39%: simplify flow and retest |
| H2 | The utility has recurring value | 14-day return among activated users on another eligible night | ≥25% | <15%: stop feature expansion and interview non-returners |
| H3 | The displayed status is credible | Percent of sampled venue statuses confirmed accurate within 20 minutes | ≥70% | <50%: do not market the feed as live; build a confirmation loop first |
| H4 | A venue will pay | Qualified managers signing a $149/month pilot or LOI | ≥3 of 10 | <2 of 10: reject or materially revise the payer/pricing hypothesis |

An “activated user” opens a venue, compares at least two options, and saves, shares, votes on, or marks a destination. Define this before data collection and do not loosen it after seeing results.

## Two-week campus pilot

### Sample

- Recruit 30–50 students in crews of 2–5, ages 18+.
- Include at least half of participants outside the founders' immediate friend group.
- Recruit across two different night types, such as a normal Friday and a game/event night.
- Recruit 10 venue decision-makers separately for payer interviews.

### Conditions

Use a simple randomized or alternating comparison:

- **Condition A:** the original groups-first path.
- **Condition B:** the revised map-first ecosystem path.

Give both conditions the same task: “Your group wants to go out near campus tonight. Use this to decide where you would go and send the plan to your group.” Do not explain features unless the participant becomes completely blocked.

### Capture

- Time to first destination decision.
- Number of screens/actions before the decision.
- Share/lock/heading-there completion.
- Confidence on a 1–5 scale before and after.
- Which data point caused the decision.
- Errors, confusion, abandonment, and privacy concerns.
- Seven- and 14-day return.
- Accuracy checks at a sample of participating venues.

### Honest operating method

For the pilot, venue staff can confirm deals, wait, and approximate crowd bands through a lightweight concierge channel. Label this as manually verified. Never imply automated live data where none exists. Compare status reports with an in-person spot check or venue confirmation timestamp.

## Venue willingness-to-pay test

Show managers a simple outcome report: views from nearby active groups, saves, “heading there” intent, and verified redemptions. Then ask for a concrete commitment:

> We are recruiting five pilot partners at $149 per month, including a verified listing, two promoted offers, and a redemption report. Would you sign a one-page pilot agreement and select a start date?

Record yes, no, requested changes, who controls the budget, current acquisition spending, and the next action. Praise, introductions, and “keep me posted” do not count as willingness to pay.

## Guardrails

- Use 18+ participants for the pilot.
- Never display precise individual location.
- Show aggregate crowd bands only above a minimum group threshold.
- Expire intent and location signals quickly.
- Let users hide, block, and report before any production launch.
- Do not sell individual movement or identity data.

## Decision meeting

At the end of two weeks, report every metric against its original threshold. Include null and negative results. Decide one of three paths: continue the current thesis, revise a failed assumption and rerun, or stop the campus launch. Do not move the thresholds after the experiment begins.
