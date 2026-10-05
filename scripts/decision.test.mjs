import { test } from 'node:test';
import assert from 'node:assert/strict';
import { meetsWaitLimit, summarizeBallots, waitUpperBound } from '../src/decisionService.js';
import { crowdPopulation, crowdLevel } from '../src/crowdService.js';

test('crowd bands preserve zero and distinguish unknown populations', () => {
  assert.equal(crowdPopulation({ attending: 0 }), 0);
  for (const attending of [undefined, null, '', -1, 'unknown', Infinity]) {
    assert.equal(crowdPopulation({ attending }), null);
    assert.equal(crowdLevel({ attending }), null);
  }
  for (const [count, level] of [[0, 'smaller'], [74, 'smaller'], [75, 'social'], [119, 'social'], [120, 'busy']]) {
    assert.equal(crowdLevel({ attending: count }).id, level);
  }
});

test('wait limits use the upper end, and do not pass unknown waits', () => {
  assert.equal(waitUpperBound('10–15 min'), 15);
  assert.equal(meetsWaitLimit({ wait: '10–15 min' }, { maxWait: 10 }), false);
  assert.equal(meetsWaitLimit({ wait: '10–15 min' }, { maxWait: 15 }), true);
  assert.equal(meetsWaitLimit({ wait: 'No line' }, { maxWait: 10 }), true);
  assert.equal(meetsWaitLimit({ wait: 'Unknown' }, { maxWait: 10 }), false);
  assert.equal(meetsWaitLimit({}, {}), true);
});

test('every member must vote and ties cannot silently select the first venue', () => {
  assert.equal(summarizeBallots(['a', 'a', null], ['a', 'b']).winner, null);
  assert.equal(summarizeBallots(['a', 'b'], ['a', 'b']).tied, true);
  assert.equal(summarizeBallots(['a', 'b'], ['a', 'b']).winner, null);
  assert.equal(summarizeBallots(['a', 'a', 'b'], ['a', 'b']).winner, 'a');
  assert.equal(summarizeBallots(['a', 'removed'], ['a', 'b']).winner, null);
  assert.equal(summarizeBallots([], []).winner, null);
});
