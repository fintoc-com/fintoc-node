import test from 'ava';

import { objetize } from '../../lib/utils';
import { isDictLike } from '../shared/utils';

import { ExampleClass } from './shared/exampleClass';
import { IncompleteClass } from './shared/incompleteClass';

test.beforeEach((t) => {
  const ctx: any = t.context;
  ctx.client = 'This is a client';
  ctx.data = {
    id: 'obj_3nlaf830FBbfF83',
    name: 'Sample Name',
    number: 47,
  };
});

test('"objetize" string objetization', async (t) => {
  const ctx: any = t.context;
  const data = 'This is data';
  const object = await objetize(String, ctx.client, data);
  t.assert(typeof object === 'string');
  t.is(object, data);
});

test('"objetize" record objetization', async (t) => {
  const ctx: any = t.context;
  const object = await objetize(Object, ctx.client, ctx.data);
  t.assert(isDictLike(object));
  t.is(object, ctx.data);
});

test('"objetize" complete objetization', async (t) => {
  const ctx: any = t.context;
  const object = await objetize(ExampleClass, ctx.client, ctx.data);
  t.assert(object instanceof ExampleClass);
  t.is(object.data.id, ctx.data.id);
});

test('"objetize" un-buildable class objetization', async (t) => {
  const ctx: any = t.context;
  await t.throwsAsync(async () => {
    await objetize(IncompleteClass, ctx.client, ctx.data);
  }, { instanceOf: TypeError });
});
