import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const app = read("src/App.jsx");
const experiment = read("src/experimentService.js");

const checks = [
  ["rubric evidence index", read("RUBRIC_EVIDENCE.md").includes("## Claim legend")],
  ["customer and payer case", read("CUSTOMER_PAYER_CASE.md").includes("## Proposed payer")],
  ["named hypothesis", read("MVP_EXPERIMENT.md").includes("## Named hypothesis")],
  ["precommitted decision rule", read("MVP_EXPERIMENT.md").includes("## Precommitted decision rule")],
  ["decision-rule freeze receipt", read("DECISION_RULE_RECEIPT.md").includes("Results reviewed at time of freeze: none claimed")],
  ["honest evidence status", read("USER_TEST_RESULTS.md").includes("No structured task-completion outcomes are claimed")],
  ["venture contribution logic", read("VENTURE_ECONOMICS.md").includes("Contribution margin")],
  ["limitations disclosure", read("LIMITATIONS.md").includes("Not production-ready")],
  ["documented ownership", read("TEAM_OWNERSHIP.md").includes("Hayden Bucher")],
  ["submission checklist", read("SUBMISSION_CHECKLIST.md").includes("## Submit these three items")],
  ["QA claim boundary", read("QA_CHECKLIST.md").includes("Manual checks not claimed")],
  ["simulated review label", read("SIMULATED_USABILITY_REVIEW.md").includes("not user research")],
  ["plan-start measurement", app.includes('trackExperimentEvent("plan_started")')],
  ["destination-lock measurement", app.includes('trackExperimentEvent("destination_locked"')],
  ["explicit vote requirement", app.includes("disabled={yourVote === null || !events.length}")],
  ["modeled-data disclosure", app.includes("fictional or modeled")],
  ["persistent core plan", app.includes("PLAN_STATE_KEY")],
  ["measurement failure isolation", experiment.includes("Measurement must never prevent")],
];

const failed = checks.filter(([, passed]) => !passed);
for (const [name, passed] of checks) console.log(`${passed ? "PASS" : "FAIL"} ${name}`);
if (failed.length) {
  console.error(`\n${failed.length} MVP verification check(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} MVP verification checks passed.`);
