import test from 'ava';

import { Client } from '../../../lib/client';
import { mockAxios, restore } from '../../mocks/initializers';

import { IncompleteMockManager } from './mocks/incompleteMockManager';
import { InvalidMethodsMockManager } from './mocks/invalidMethodsMockManager';

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

test('"ManagerMixin" creation calling invalid "all" method', async (t) => {
  const ctx: any = t.context;

  const manager = new InvalidMethodsMockManager(ctx.path, ctx.client);

  const error = await t.throwsAsync(async () => {
    await manager.all();
  }, { instanceOf: TypeError });

  t.assert(error.message.includes('.all'));
});

test('"ManagerMixin" creation calling invalid "get" method', async (t) => {
  const ctx: any = t.context;

  const manager = new InvalidMethodsMockManager(ctx.path, ctx.client);

  const error = await t.throwsAsync(async () => {
    await manager.get('my_id');
  }, { instanceOf: TypeError });

  t.assert(error.message.includes('.get'));
});

test('"ManagerMixin" creation calling invalid "create" method', async (t) => {
  const ctx: any = t.context;

  const manager = new InvalidMethodsMockManager(ctx.path, ctx.client);

  const error = await t.throwsAsync(async () => {
    await manager.create();
  }, { instanceOf: TypeError });

  t.assert(error.message.includes('.create'));
});

test('"ManagerMixin" creation calling invalid "update" method', async (t) => {
  const ctx: any = t.context;

  const manager = new InvalidMethodsMockManager(ctx.path, ctx.client);

  const error = await t.throwsAsync(async () => {
    await manager.update('my_id');
  }, { instanceOf: TypeError });

  t.assert(error.message.includes('.update'));
});

test('"ManagerMixin" creation calling invalid "delete" method', async (t) => {
  const ctx: any = t.context;

  const manager = new InvalidMethodsMockManager(ctx.path, ctx.client);

  const error = await t.throwsAsync(async () => {
    await manager.delete('my_id');
  }, { instanceOf: TypeError });

  t.assert(error.message.includes('.delete'));
});

test('"ManagerMixin" creation calling valid methods', async (t) => {
  const ctx: any = t.context;

  const manager = new IncompleteMockManager(ctx.path, ctx.client);

  await t.notThrowsAsync(async () => {
    await manager.get('id');
  });
});
