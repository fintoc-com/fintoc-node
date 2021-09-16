import test from 'ava';

import { isISODate } from '../../lib/utils';

test('"isISODate" valid ISO format', (t) => {
  const validISODaTetimeString = '2021-08-13T13:40:40.811Z';
  t.assert(isISODate(validISODaTetimeString));
});

test('"isISODate" invalid ISO format', (t) => {
  const invalidISODaTetimeString = 'This is not a date';
  t.assert(!isISODate(invalidISODaTetimeString));
});
