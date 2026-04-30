import test from 'ava';

import { isISODate } from '../../lib/utils';

test('"isISODate" valid ISO format', (t) => {
  const validISODaTetimeString = '2021-08-13T13:40:40.811Z';
  t.assert(isISODate(validISODaTetimeString));
});

test('"isISODate" valid ISO date without time', (t) => {
  t.assert(isISODate('2021-08-13'));
});

test('"isISODate" valid ISO date with timezone offset', (t) => {
  t.assert(isISODate('2021-08-13T13:40:40.811+05:00'));
});

test('"isISODate" invalid ISO format', (t) => {
  const invalidISODaTetimeString = 'This is not a date';
  t.assert(!isISODate(invalidISODaTetimeString));
});

test('"isISODate" should not parse ambiguous strings as dates', (t) => {
  t.assert(!isISODate('PS 2'));
  t.assert(!isISODate('test 1'));
  t.assert(!isISODate('Mar 5'));
  t.assert(!isISODate('Jan 2024'));
});
