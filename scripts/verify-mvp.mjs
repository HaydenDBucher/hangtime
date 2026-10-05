import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const app = read("src/App.jsx");
const styles = read("src/styles.css");
const experiment = read("src/experimentService.js");
const eventService = read("src/eventService.js");
const { fallbackEvents } = await import(new URL("../src/eventService.js", import.meta.url));

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
  ["explicit vote requirement", app.includes("disabled={!result.winner}")],
  ["modeled-data disclosure", app.includes("fictional or modeled")],
  ["persistent core plan", app.includes("PLAN_STATE_KEY")],
  ["measurement failure isolation", experiment.includes("Measurement must never prevent")],
  ["modal layer clears map overlays", styles.includes(".modal-layer { position: fixed; inset: 0; z-index: 2000") && styles.includes(".real-map-panel .map-controls { z-index: 900")],
  ["guided walkthrough path", app.includes("60-SECOND PRODUCT WALKTHROUGH") && app.includes("walkthroughStep + 1")],
  ["interactive demo chat", app.includes("function ChatModal") && app.includes('trackExperimentEvent("demo_message_sent"')],
  ["single profile modal handoff", app.includes("setProfile(null); setPersonProfile({ person, group });")],
  ["fictional matching shown in walkthrough", app.includes("Browse groups") && app.includes("FICTIONAL DEMO ACCOUNTS") && app.includes("These are fictional demo accounts")],
  ["matching demo is always visible", app.includes("Preview student groups") && app.includes("matching_demo_opened")],
  ["groups and individual accounts are browsable", app.includes("function GroupBrowserModal") && app.includes("onOpenPerson(person, group)") && app.includes("View people + plan")],
  ["selected venue deal is featured", app.includes("getOfferTrust(selected).toUpperCase()") && styles.includes(".venue-intel .intel-deal")],
  ["recommendations explain why", app.includes("function RecommendationsModal") && app.includes("WHY WE SUGGESTED IT") && app.includes("getSuggestionReasons")],
  ["deal terms are explicit", app.includes("function getDealTerms") && app.includes("getDealTerms(selected)")],
  ["recommendation enters crew vote", app.includes("recommendation_added_to_vote") && app.includes("setVoteEvents")],
  ["walkthrough always reaches mutual match", app.includes("group.id === 1 || completingWalkthrough")],
  ["student campus focus", app.includes("OSU-FIRST MVP") && app.includes("@osu.edu")],
  ["budget is part of the core plan", app.includes("Budget per person") && app.includes("Under $35/person")],
  ["modeled per-person cost is visible", app.includes("function estimateNightCost") && app.includes("EST. NIGHT")],
  ["ride smart context is linked", app.includes("https://ttm.osu.edu/ride-smart")],
  ["everyone-home crew check", app.includes("function StudentNightPlan") && app.includes("Everyone home?" )],
  ["offer trust labels", app.includes("function getOfferTrust") && app.includes("Modeled student offer")],
  ["every modeled location has a deal", fallbackEvents.length > 0 && fallbackEvents.every((event) => Boolean(event.deal))],
  ["live listings receive a modeled deal", eventService.includes('deal: modeledOffer') && eventService.includes('dealSource: "modeled"')],
  ["sponsored placements are disclosed", app.includes("SPONSORED DEMO · PREMIUM PLACEMENT") && app.includes("crowd position is not boosted")],
  ["sponsored visibility is measurable", app.includes('trackExperimentEvent("sponsored_placement_opened"') && app.includes('trackExperimentEvent("sponsored_offer_saved"')],
  ["map appears before crowd comparison", app.indexOf('className={`city-board') < app.indexOf('<BarCrowds events=')],
];

const failed = checks.filter(([, passed]) => !passed);
for (const [name, passed] of checks) console.log(`${passed ? "PASS" : "FAIL"} ${name}`);
if (failed.length) {
  console.error(`\n${failed.length} MVP verification check(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} MVP verification checks passed.`);
