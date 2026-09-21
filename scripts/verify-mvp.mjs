import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const app = read("src/App.jsx");
const experiment = read("src/experimentService.js");

const checks = [
  ["customer and payer case", read("README.md").includes("## Customer and payer")],
  ["named hypothesis", read("MVP_EXPERIMENT.md").includes("## Named hypothesis")],
  ["precommitted decision rule", read("MVP_EXPERIMENT.md").includes("## Precommitted decision rule")],
  ["honest evidence status", read("USER_TEST_RESULTS.md").includes("No structured task-completion outcomes are claimed")],
  ["venture contribution logic", read("VENTURE_ECONOMICS.md").includes("Contribution margin")],
  ["limitations disclosure", read("LIMITATIONS.md").includes("Not production-ready")],
  ["submission checklist", read("SUBMISSION_CHECKLIST.md").includes("## Submit these three items")],
  ["release verification boundary", read("README.md").includes("Automated checks do not substitute")],
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
