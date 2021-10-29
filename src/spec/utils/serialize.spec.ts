import test from 'ava';

import { serialize } from '../../lib/utils';

import { ExampleClass } from './shared/exampleClass';

test('"serialize" string serialization', (t) => {
  const string = 'This is a string';
  t.assert(serialize(string) === string);
});

test('"serialize" boolean serialization', (t) => {
  const boolean = true;
  t.assert(serialize(boolean) === boolean);
});

test('"serialize" number serialization', (t) => {
  const number = 3;
  t.assert(serialize(number) === number);
});

test('"serialize" nullValue serialization', (t) => {
  const nullValue = null;
  t.assert(serialize(nullValue) === null);
});

test('"serialize" datetime serialization', (t) => {
  const dateTime = new Date();
  t.is(dateTime.constructor, Date);
  t.is(typeof serialize(dateTime), 'string');
  t.assert(serialize(dateTime) === dateTime.toISOString());
});

test('"serialize" object with serialize method serialization', (t) => {
  const data = { a: 'b', c: 'd' };
  const object = new ExampleClass('client', ['handler'], ['method'], 'path', data);
  t.assert(serialize(object) === object.serialize());
});
