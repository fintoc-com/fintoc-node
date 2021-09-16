import test from 'ava';

import { singularize } from '../../lib/utils';

test('"singularize" plural string', (t) => {
  const string = 'movements';
  const singular = singularize(string);
  t.assert(singular === 'movement');
});

test('"singularize" singular string', (t) => {
  const string = 'movement';
  const singular = singularize(string);
  t.assert(singular === 'movement');
});

test('"singularize" complex plural does not work', (t) => {
  const string = 'formulae';
  const singular = singularize(string);
  t.assert(singular !== 'formula');
});
