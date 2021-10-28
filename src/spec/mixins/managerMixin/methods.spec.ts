import test from 'ava';

import { Client } from '../../../lib/client';
import { ResourceMixin } from '../../../lib/mixins';
import { mockAxios, restoreAxios } from '../../mocks/initializers';
import { isAsyncGenerator } from '../../shared/utils';

import { EmptyMockManager } from './mocks/emptyMockManager';

test.before((t) => {
  const ctx: any = t.context;
  ctx.axiosMock = mockAxios();
});

test.after((t) => {
  const ctx: any = t.context;
  restoreAxios(ctx.axiosMock);
});

test.beforeEach((t) => {
  const ctx: any = t.context;

  ctx.baseUrl = 'https://test.com';
  ctx.apiKey = 'super_secret_api_key';
  ctx.userAgent = 'fintoc-node/test';
  ctx.params = { first_param: 'first_value', second_param: 'second_value' };
  ctx.client = new Client({
    baseUrl: ctx.baseUrl,
    apiKey: ctx.apiKey,
    userAgent: ctx.userAgent,
    params: ctx.params,
  });
  ctx.path = '/resources';
  ctx.manager = new EmptyMockManager(ctx.path, ctx.client);
});

test('"ManagerMixin" methods all lazy method', async (t) => {
  const ctx: any = t.context;

  const objects = await ctx.manager.all();
  t.assert(isAsyncGenerator(objects));

  for await (const object of objects) {
    t.assert(object instanceof ResourceMixin);
  }
});

test('"ManagerMixin" methods all not lazy method', async (t) => {
  const ctx: any = t.context;

  const objects = await ctx.manager.all({ lazy: false });
  t.assert(Array.isArray(objects));

  objects.forEach((object: any) => {
    t.assert(object instanceof ResourceMixin);
  });
});

test('"ManagerMixin" methods get method', async (t) => {
  const ctx: any = t.context;

  const id = 'my_id';

  const object = await ctx.manager.get(id);
  t.assert(object instanceof ResourceMixin);
  t.is(object.method, 'get');
  t.assert(object.url.includes(id));
});

test('"ManagerMixin" methods create method', async (t) => {
  const ctx: any = t.context;

  const object = await ctx.manager.create();
  t.assert(object instanceof ResourceMixin);
  t.is(object.method, 'post');
});

test('"ManagerMixin" methods update method', async (t) => {
  const ctx: any = t.context;

  const object = await ctx.manager.update('my_id');
  t.assert(object instanceof ResourceMixin);
  t.is(object.method, 'patch');
});

test('"ManagerMixin" methods delete method', async (t) => {
  const ctx: any = t.context;

  const id = await ctx.manager.delete('my_id');
  t.is(typeof id, 'string');
});
