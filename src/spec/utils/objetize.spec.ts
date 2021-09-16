import test from 'ava';

import { objetize } from '../../lib/utils';

import { ExampleClass } from './shared/exampleClass';

test.beforeEach((t) => {
  const ctx: any = t.context;
  ctx.client = 'This is a client';
  ctx.data = {
    id: 'obj_3nlaf830FBbfF83',
    name: 'Sample Name',
    number: 47,
  };
});

test('"objetize" string objetization', (t) => {
  const ctx: any = t.context;
  const data = 'This is data';
  const object = objetize(String, ctx.client, data);
  t.assert(typeof object === 'string');
  t.is(object, data);
});

test('"objetize" record objetization', (t) => {
  const ctx: any = t.context;
  const object = objetize(Object, ctx.client, ctx.data);
  t.assert(typeof object === 'object');
  t.is(object, ctx.data);
});

test('"objetize" complete objetization', (t) => {
  const ctx: any = t.context;
  const object = objetize(ExampleClass, ctx.client, ctx.data);
  t.assert(object instanceof ExampleClass);
  t.is(object.data.id, ctx.data.id);
});
