/* eslint-disable no-console */

import test from 'ava';

import { Client } from '../../../lib/client';
import { mockAxios, mockConsoleLog, restore } from '../../mocks/initializers';

import { ComplexMockManager } from './mocks/complexMockManager';

test.before((t) => {
  const ctx: any = t.context;
  ctx.axiosMock = mockAxios();
  ctx.consoleLogMock = mockConsoleLog();
});

test.after((t) => {
  const ctx: any = t.context;
  restore(ctx.axiosMock);
  restore(ctx.consoleLogMock);
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
  ctx.manager = new ComplexMockManager(ctx.path, ctx.client);
});

test.serial('"ManagerMixin" handlers all handler', async (t) => {
  const ctx: any = t.context;

  await ctx.manager.all();

  // @ts-ignore: property does not exist
  t.assert(console.log.getCall(0).args[0].includes('list'));
});

test.serial('"ManagerMixin" handlers get handler', async (t) => {
  const ctx: any = t.context;

  await ctx.manager.get('my_id');

  // @ts-ignore: property does not exist
  t.assert(console.log.getCall(1).args[0].includes('get'));
});

test.serial('"ManagerMixin" handlers create handler', async (t) => {
  const ctx: any = t.context;

  await ctx.manager.create();

  // @ts-ignore: property does not exist
  t.assert(console.log.getCall(2).args[0].includes('create'));
});

test.serial('"ManagerMixin" handlers update handler', async (t) => {
  const ctx: any = t.context;

  await ctx.manager.update('my_id');

  // Update handler only calls update, not get first
  // @ts-ignore: property does not exist
  t.assert(console.log.getCall(3).args[0].includes('update'));
});

test.serial('"ManagerMixin" handlers delete handler', async (t) => {
  const ctx: any = t.context;

  await ctx.manager.delete('my_id');

  // Delete handler only calls delete, not get first
  // @ts-ignore: property does not exist
  t.assert(console.log.getCall(4).args[0].includes('delete'));
});
