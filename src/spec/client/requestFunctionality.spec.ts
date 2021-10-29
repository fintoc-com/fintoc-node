import test from 'ava';

import { Client } from '../../lib/client';
import { mockAxios, restore } from '../mocks/initializers';
import { isAsyncGenerator, isDictLike } from '../shared/utils';

test.before((t) => {
  const ctx: any = t.context;
  ctx.axiosMock = mockAxios();
});

test.after((t) => {
  const ctx: any = t.context;
  restore(ctx.axiosMock);
});

test.beforeEach((t) => {
  const ctx: any = t.context;
  ctx.baseURL = 'https://test.com';
  ctx.apiKey = 'super_secret_api_key';
  ctx.userAgent = 'fintoc-node/test';
  ctx.params = { first_param: 'first_value', second_param: 'second_value' };
  ctx.client = new Client({ baseUrl: ctx.baseURL, apiKey: ctx.apiKey, userAgent: ctx.userAgent });
});

test('"Client" paginated request', async (t) => {
  const ctx: any = t.context;

  const data = await ctx.client.request({ path: '/movements', paginated: true });

  t.assert(isAsyncGenerator(data));
});

test('"Client" get request', async (t) => {
  const ctx: any = t.context;

  const data = await ctx.client.request({ path: '/movements/3', method: 'get' });

  t.assert(!isAsyncGenerator(data));
  t.assert(isDictLike(data));
  t.assert(Object.keys(data).length > 0);
});

test('"Client" delete request', async (t) => {
  const ctx: any = t.context;

  const data = await ctx.client.request({ path: '/movements/3', method: 'delete' });

  t.assert(!isAsyncGenerator(data));
  t.assert(isDictLike(data));
  t.assert(Object.keys(data).length === 0);
});
