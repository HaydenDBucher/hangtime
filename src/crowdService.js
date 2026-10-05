export const CROWD_LEVELS = [
  { id: 'smaller', label: 'Smaller crowd', range: 'Under 75 people', detail: 'Looking for a quieter start?' },
  { id: 'social', label: 'Social crowd', range: '75–119 people', detail: 'Looking for people to mingle with?' },
  { id: 'busy', label: 'Big crowd', range: '120+ people', detail: 'Looking for a busy night?' },
];

export function crowdPopulation(event) {
  const value = event?.attending;
  if (value === null || value === undefined || value === '') return null;
  const count = Number(value);
  return Number.isFinite(count) && count >= 0 ? Math.round(count) : null;
}

export function crowdLevel(event) {
  const count = crowdPopulation(event);
  if (count === null) return null;
  return CROWD_LEVELS[count < 75 ? 0 : count < 120 ? 1 : 2];
}
