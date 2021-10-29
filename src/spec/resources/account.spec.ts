import test from 'ava';

import { Client } from '../../lib/client';
import { ManagerMixin } from '../../lib/mixins';
import { Account } from '../../lib/resources/account';

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
  ctx.path = '/accounts';
  ctx.handlers = {
    update: (object: any) => object,
    delete: (identifier: string) => identifier,
  };
});

test('"Account" resource movements manager', async (t) => {
  const ctx: any = t.context;

  // @ts-ignore: property is protected
  const account = await Account._build(ctx.client, ctx.handlers, [], ctx.path, { id: 'idx' });

  t.assert(account.movements instanceof ManagerMixin);

  await t.throwsAsync(async () => {
    account.movements = null;
  }, { instanceOf: ReferenceError });

  t.not(account.movements, null);
  t.assert(account.movements instanceof ManagerMixin);
});
