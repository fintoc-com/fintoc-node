import test from 'ava';

import { Client } from '../../../lib/client';
import { mockAxios, restoreAxios } from '../../mocks/initializers';

import { IncompleteMockManager } from './mocks/incompleteMockManager';

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
});

test('"ManagerMixin" creation calling invalid methods', async (t) => {
  const ctx: any = t.context;

  const manager = new IncompleteMockManager(ctx.path, ctx.client);

  const error = await t.throwsAsync(async () => {
    await manager.all();
  }, { instanceOf: TypeError });

  t.assert(error.message.includes('.all'));
});

test('"ManagerMixin" creation calling valid methods', async (t) => {
  const ctx: any = t.context;

  const manager = new IncompleteMockManager(ctx.path, ctx.client);

  await t.notThrowsAsync(async () => {
    await manager.get('id');
  });
});
