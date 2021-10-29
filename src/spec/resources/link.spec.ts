import test from 'ava';

import { Client } from '../../lib/client';
import { ManagerMixin } from '../../lib/mixins';
import { Link } from '../../lib/resources/link';

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
  ctx.path = '/links';
  ctx.handlers = {
    update: (object: any) => object,
    delete: (identifier: string) => identifier,
  };
});

test('"Link" resource accounts manager', async (t) => {
  const ctx: any = t.context;

  // @ts-ignore: property is protected
  const link = await Link._build(ctx.client, ctx.handlers, [], ctx.path, {});

  t.assert(link.accounts instanceof ManagerMixin);

  await t.throwsAsync(async () => {
    link.accounts = null;
  }, { instanceOf: ReferenceError });

  t.not(link.accounts, null);
  t.assert(link.accounts instanceof ManagerMixin);
});

test('"Link" resource subscriptions manager', async (t) => {
  const ctx: any = t.context;

  // @ts-ignore: property is protected
  const link = await Link._build(ctx.client, ctx.handlers, [], ctx.path, {});

  t.assert(link.subscriptions instanceof ManagerMixin);

  await t.throwsAsync(async () => {
    link.subscriptions = null;
  }, { instanceOf: ReferenceError });

  t.not(link.subscriptions, null);
  t.assert(link.subscriptions instanceof ManagerMixin);
});

test('"Link" resource tax returns manager', async (t) => {
  const ctx: any = t.context;

  // @ts-ignore: property is protected
  const link = await Link._build(ctx.client, ctx.handlers, [], ctx.path, {});

  t.assert(link.taxReturns instanceof ManagerMixin);

  await t.throwsAsync(async () => {
    link.taxReturns = null;
  }, { instanceOf: ReferenceError });

  t.not(link.taxReturns, null);
  t.assert(link.taxReturns instanceof ManagerMixin);
});

test('"Link" resource invoices manager', async (t) => {
  const ctx: any = t.context;

  // @ts-ignore: property is protected
  const link = await Link._build(ctx.client, ctx.handlers, [], ctx.path, {});

  t.assert(link.invoices instanceof ManagerMixin);

  await t.throwsAsync(async () => {
    link.invoices = null;
  }, { instanceOf: ReferenceError });

  t.not(link.invoices, null);
  t.assert(link.invoices instanceof ManagerMixin);
});

test('"Link" resource refresh intents manager', async (t) => {
  const ctx: any = t.context;

  // @ts-ignore: property is protected
  const link = await Link._build(ctx.client, ctx.handlers, [], ctx.path, {});

  t.assert(link.refreshIntents instanceof ManagerMixin);

  await t.throwsAsync(async () => {
    link.refreshIntents = null;
  }, { instanceOf: ReferenceError });

  t.not(link.refreshIntents, null);
  t.assert(link.refreshIntents instanceof ManagerMixin);
});
