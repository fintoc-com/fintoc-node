import test from 'ava';

import { Client } from '../../lib/client';
import { objetizeGenerator } from '../../lib/utils';
import { isAsyncGenerator } from '../shared/utils';

import { ExampleClass } from './shared/exampleClass';
import { getGenerator } from './shared/getGenerator';

test.beforeEach((t) => {
  const ctx: any = t.context;
  ctx.client = 'This is a client' as unknown as Client; // Not relevant
});

test('"objetizeGenerator" generator objetization', async (t) => {
  const ctx: any = t.context;
  const generator = getGenerator();
  t.assert(isAsyncGenerator(generator));

  const objetizedGenerator = objetizeGenerator(generator, ExampleClass, ctx.client);

  t.assert(isAsyncGenerator(objetizedGenerator));

  for await (const object of objetizedGenerator) {
    t.assert(object instanceof ExampleClass);
  }
});
