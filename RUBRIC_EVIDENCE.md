# Hangtime Rubric Evidence Index

This page maps each grading criterion to a live artifact, repository evidence, claim type, and remaining boundary. It is intended to make the submission fast to audit.

## Claim legend

- **Implemented:** visible or executable in the deployed artifact.
- **Documented:** specified in the repository and inspectable by the evaluator.
- **Assumption:** plausible but not yet supported by external behavior.
- **Observed evidence:** reserved for behavior recorded from real participants.

## 1. Customer, pain, and payer

- Implemented: first screen identifies OSU crews, the tonight-planning moment, and the destination-lock job.
- Documented: `CUSTOMER_PAYER_CASE.md` explains the user, costly pain, alternatives, urgency, payer, and buying logic.
- Implemented: **For venues** presents an explicit offer and four pricing responses.
- Boundary: customer frequency, cost, and payer willingness remain assumptions until externally observed.

## 2. Hypothesis and honest test

- Documented: `MVP_EXPERIMENT.md` contains the consequential uncertainty, behavioral numerator, denominator, time measure, and decision implications.
- Documented: `DECISION_RULE_RECEIPT.md` freezes the rule before external testing.
- Implemented: the app records `plan_started`, `plan_configured`, `crew_vote_opened`, and `destination_locked` with anonymous session IDs and timestamps.
- Implemented: **Test evidence** exports browser-local JSON.
- Boundary: no external participant results are claimed.

## 3. Working product and user path

- Implemented: live GitHub Pages artifact.
- Implemented: guided three-step plan, comparison, vote, and destination-lock flow.
- Implemented: explicit vote requirement, post-lock matching, modeled-data disclosure, reversible crew status, report/block controls, empty states, focus visibility, dialog focus containment, and persistent plan state.
- Automated: `npm run check` verifies critical rubric and flow elements; GitHub Actions runs it before every build.
- Documented: `QA_CHECKLIST.md` separates automated checks from manual checks still requiring a person/device.

## 4. Venture economics

- Documented: `VENTURE_ECONOMICS.md` identifies the payer, pricing rhythm, usage revenue, variable costs, contribution margin, acquisition path, cash implication, and sensitivity cases.
- Implemented: the venue screen records which commercial offer is selected.
- Boundary: pricing, conversion, cost, and acquisition figures are labeled assumptions until payer behavior exists.

## 5. User evidence and revision

- Observed directional evidence: one exploratory user interaction reported that matching “felt off” while trend visibility, seeing where people are, and a one-stop night-out hub were useful.
- Implemented revision: the product moved from matching-first to map-and-planning-first, adding aggregate crowd geography, campus zones, rankings, deals, events, food, ride estimates, and post-lock matching.
- Documented: `USER_TEST_RESULTS.md` preserves the denominator, session log, funnel, surprise, revision, and fresh-user retest structure.
- Documented: `SIMULATED_USABILITY_REVIEW.md` records heuristic improvements while explicitly excluding them from observed evidence.
- Boundary: the exploratory interaction did not use the frozen task and has no completion measure. Level 4 still requires structured observed behavior and a verified retest; no repository change can truthfully replace that requirement.

## 6. Build process, candor, and team ownership

- Documented: `BUILD_LOG.md` separates product decisions, agent/tool contribution, human verification, and failures.
- Documented: `LIMITATIONS.md` states technical, safety, data, account, business, and evidence boundaries.
- Documented: `TEAM_OWNERSHIP.md` provides role ownership and a command-of-evidence receipt.
- Automated: CI verifies the documentation and core instrumentation before deployment.
- Boundary: real member names, initials, and sign-off dates must be supplied by the team members themselves.

## Submission bundle

1. Live URL: `https://haydendbucher.github.io/hangtime/`
2. Repository: `https://github.com/HaydenDBucher/hangtime`
3. Hypothesis and rule: `MVP_EXPERIMENT.md`, `DECISION_RULE_RECEIPT.md`
4. User evidence: `USER_TEST_RESULTS.md` plus de-identified exports when available
5. Economics: `VENTURE_ECONOMICS.md`
6. Build and ownership: `BUILD_LOG.md`, `TEAM_OWNERSHIP.md`, `LIMITATIONS.md`

