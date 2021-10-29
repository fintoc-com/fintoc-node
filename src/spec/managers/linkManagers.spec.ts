import test from 'ava';

import { Client } from '../../lib/client';
import { LinksManager } from '../../lib/managers';
import { mockAxios, restore } from '../mocks/initializers';

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
  ctx.path = '/links';
});

test('"LinksManager" post get handler', async (t) => {
  const ctx: any = t.context;

  const firstManager = new LinksManager(ctx.path, ctx.client);

  const link = await firstManager.get('id');

  const subManager = link.accounts;

  // @ts-ignore: property is protected
  t.not(link._client, firstManager._client);

  // @ts-ignore: property is protected
  t.assert(!('link_token' in firstManager._client.params));

  // @ts-ignore: property is protected
  t.assert('link_token' in subManager._client.params);
});

test('"LinksManager" post update handler', async (t) => {
  const ctx: any = t.context;

  const firstManager = new LinksManager(ctx.path, ctx.client);

  const link = await firstManager.update('id');

  const subManager = link.accounts;

  // @ts-ignore: property is protected
  t.not(link._client, firstManager._client);

  // @ts-ignore: property is protected
  t.assert(!('link_token' in firstManager._client.params));

  // @ts-ignore: property is protected
  t.assert('link_token' in subManager._client.params);
});
