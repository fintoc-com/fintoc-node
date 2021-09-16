import test from 'ava';

import { snakeToPascal } from '../../lib/utils';

test('"snakeToPascal" simple string', (t) => {
  const snake = 'this_is_a_test';
  const pascal = snakeToPascal(snake);
  t.assert(pascal === 'ThisIsATest');
});

test('"snakeToPascal" complex string', (t) => {
  const snake = 'thIs_is_a_TEST';
  const pascal = snakeToPascal(snake);
  t.assert(pascal === 'ThisIsATest');
});

test('"snakeToPascal" cased string', (t) => {
  const snake = 'ThisIsATest';
  const pascal = snakeToPascal(snake);
  t.assert(pascal === 'Thisisatest');
});
