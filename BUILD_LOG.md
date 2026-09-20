# Hangtime Build and AI-Use Log

## Purpose

This log separates product decisions, automated assistance, and human verification. Add a dated entry for every material change.

| Date | Product question | Human decision | Agent/tool contribution | Human verification | Failure or limitation |
|---|---|---|---|---|---|
| 2026-09-08 | Could a crew coordinate a night in one interface? | Build a functional concept rather than a static landing page. | Initial React/Vite implementation. | Repository owner reviewed and deployed the flow. | No behavioral test evidence recorded. |
| 2026-09-15 | Should discovery or matching lead? | Reframe around tonight discovery and plan-first matching. | UI and component revisions. | Repository owner reviewed deployed behavior. | Modeled data could appear more real than intended. |
| 2026-09-17 | Can the map focus on the campus decision moment? | Put the live geographic map first and constrain it to campus. | Map, accounts, dashboard, and boundary implementation. | Repository owner reviewed commits and Pages deployment. | Live data still depends on optional services. |
| 2026-09-20 | What is required by the course MVP rubric? | Focus the product on destination lock behavior and expose a payer test. | Added anonymous funnel instrumentation, three-step path, disclosures, evidence export, safety controls, accessibility improvements, and rubric documents. | Human team must review the deployed build and run real sessions. | Local Node runtime was unavailable during this revision; CI/build verification remains required. |
| 2026-09-20 | Where might a first-time user leave the core test path? | Treat destination lock as the required milestone before social discovery. | Performed a clearly labeled simulated walkthrough; added progress state, explicit-vote enforcement, post-lock matching, and clearer completion language. | Human team must validate these predictions with real users. | Simulation is not user evidence and cannot support a completion-rate claim. |
| 2026-09-20 | How can the submission become easier to audit and more reliable without inventing evidence? | Preserve claim boundaries while strengthening every automated and documentary control. | Added persistent plan state, storage-failure isolation, CI rubric checks, a centralized evidence index, explicit customer/payer case, frozen decision-rule receipt, QA receipt, and economics sensitivity ledger. | GitHub Actions must run the check and production build; manual QA fields remain unsigned until completed by a person. | Automated verification cannot substitute for observed user behavior or human/device QA. |

## Verification checklist for each release

- Review the diff and explain every material product choice.
- Confirm no participant data or secrets are committed.
- Run `npm ci` and `npm run build` in GitHub Actions or a Node-enabled environment.
- Test the complete plan-start to destination-lock path with keyboard and pointer input.
- Test mobile width, empty search, API fallback, sign-in errors, and modal dismissal.
- Confirm modeled and fictional data remain clearly labeled.
- Record failures honestly and link the correcting commit.

## Known authorship record

The commit history before this rubric revision lists one GitHub author identity. If this is a team submission, each member should append their decisions, verification work, test moderation, analysis, and economics ownership here. Commit count alone is not a reliable measure of contribution.
