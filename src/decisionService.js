export function waitUpperBound(wait = "") {
  if (/no line|no wait/i.test(wait)) return 0;
  const values = wait.match(/\d+/g);
  return values ? Math.max(...values.map(Number)) : null;
}

export function meetsWaitLimit(event, plan) {
  if (!plan?.maxWait) return true;
  const wait = waitUpperBound(event.wait);
  return wait !== null && wait <= Number(plan.maxWait);
}

export function summarizeBallots(ballots, eventIds) {
  const counts = eventIds.map(id => ballots.filter(vote => vote === id).length);
  const highest = Math.max(0, ...counts);
  const leaders = eventIds.filter((id, index) => highest > 0 && counts[index] === highest);
  const complete = ballots.length > 0 && ballots.every(vote => eventIds.includes(vote));
  return { counts, complete, winner: complete && leaders.length === 1 ? leaders[0] : null, tied: complete && leaders.length > 1 };
}
