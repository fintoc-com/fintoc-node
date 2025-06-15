import test from 'ava';

import { Fintoc } from '../lib/core';

import { mockAxios, restore } from './mocks/initializers';

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
  const apiKey = 'super_secret_api_key';
  ctx.fintoc = new Fintoc(apiKey);
});

test('fintoc.paymentIntents.all()', async (t) => {
  const ctx: any = t.context;
  const paymentIntents = await ctx.fintoc.paymentIntents.all();

  let count = 0;
  for await (const paymentIntent of paymentIntents) {
    count += 1;
    t.is(paymentIntent.method, 'get');
    t.is(paymentIntent.url, 'payment_intents');
  }

  t.true(count > 0);
});

test('fintoc.paymentIntents.get()', async (t) => {
  const ctx: any = t.context;
  const paymentId = 'payment_id';
  const paymentIntent = await ctx.fintoc.paymentIntents.get(paymentId);

  t.is(paymentIntent.method, 'get');
  t.is(paymentIntent.url, `payment_intents/${paymentId}`);
});

test('fintoc.paymentIntents.create()', async (t) => {
  const ctx: any = t.context;
  const paymentData = {
    amount: 1000,
    currency: 'USD',
    payment_method: 'bank_transfer ',
  };
  const paymentIntent = await ctx.fintoc.paymentIntents.create(paymentData);

  t.is(paymentIntent.method, 'post');
  t.is(paymentIntent.url, 'payment_intents');
  t.is(paymentIntent.json.amount, paymentData.amount);
  t.is(paymentIntent.json.currency, paymentData.currency);
  t.is(paymentIntent.json.payment_method, paymentData.payment_method);
});

test('fintoc.links.all()', async (t) => {
  const ctx: any = t.context;
  const links = await ctx.fintoc.links.all();

  let count = 0;
  for await (const link of links) {
    count += 1;
    t.is(link.method, 'get');
    t.is(link.url, 'links');
  }

  t.true(count > 0);
});

test('fintoc.links.get()', async (t) => {
  const ctx: any = t.context;
  const linkToken = 'link_token_example';
  const link = await ctx.fintoc.links.get(linkToken);

  t.is(link.method, 'get');
  t.is(link.url, `links/${linkToken}`);
});

test('fintoc.links.update()', async (t) => {
  const ctx: any = t.context;
  const linkToken = 'link_token_example';
  const updateData = {
    username: 'updated_username',
  };
  const link = await ctx.fintoc.links.update(linkToken, updateData);

  t.is(link.method, 'patch');
  t.is(link.url, `links/${linkToken}`);
  t.is(link.json.username, updateData.username);
});

test('fintoc.links.delete()', async (t) => {
  const ctx: any = t.context;
  const linkId = 'link_id';
  const deletedIdentifier = await ctx.fintoc.links.delete(linkId);

  t.is(deletedIdentifier, linkId);
});

test('link.accounts.all()', async (t) => {
  const ctx: any = t.context;
  const linkToken = 'link_token_example';
  const link = await ctx.fintoc.links.get(linkToken);

  const accounts = await link.accounts.all();

  t.is(link.accounts._client.params.link_token, linkToken);

  let count = 0;
  for await (const account of accounts) {
    count += 1;
    t.is(account.method, 'get');
    t.is(account.url, 'accounts');
  }

  t.true(count > 0);
});

test('link.accounts.get()', async (t) => {
  const ctx: any = t.context;
  const linkToken = 'link_token_example';
  const link = await ctx.fintoc.links.get(linkToken);

  const accountId = 'account_id';
  const account = await link.accounts.get(accountId);

  t.is(account.method, 'get');
  t.is(account.url, `accounts/${accountId}`);

  t.is(link.accounts._client.params.link_token, linkToken);
  t.is(account._client.params.link_token, linkToken);
});

test('account.movements.all()', async (t) => {
  const ctx: any = t.context;
  const linkToken = 'link_token_example';
  const link = await ctx.fintoc.links.get(linkToken);

  const accountId = 'account_id';
  const account = await link.accounts.get(accountId);

  const movements = await account.movements.all();

  t.is(account.movements._client.params.link_token, linkToken);

  let count = 0;
  for await (const movement of movements) {
    count += 1;
    t.is(movement.method, 'get');
    t.is(movement.url, `accounts/${accountId}/movements`);
    t.is(movement._client.params.link_token, linkToken);
  }

  t.true(count > 0);
});

test('account.movements.get()', async (t) => {
  const ctx: any = t.context;
  const linkToken = 'link_token_example';
  const link = await ctx.fintoc.links.get(linkToken);

  const accountId = 'account_id';
  const account = await link.accounts.get(accountId);

  const movementId = 'movement_id';
  const movement = await account.movements.get(movementId);

  t.is(movement.method, 'get');
  t.is(movement.url, `accounts/${accountId}/movements/${movementId}`);
  t.is(movement._client.params.link_token, linkToken);
});

test('fintoc.webhookEndpoints.all()', async (t) => {
  const ctx: any = t.context;
  const webhookEndpoints = await ctx.fintoc.webhookEndpoints.all();

  let count = 0;
  for await (const webhookEndpoint of webhookEndpoints) {
    count += 1;
    t.is(webhookEndpoint.method, 'get');
    t.is(webhookEndpoint.url, 'webhook_endpoints');
  }

  t.true(count > 0);
});

test('fintoc.webhookEndpoints.get()', async (t) => {
  const ctx: any = t.context;
  const webhookEndpointId = 'we_example_id';
  const webhookEndpoint = await ctx.fintoc.webhookEndpoints.get(webhookEndpointId);

  t.is(webhookEndpoint.method, 'get');
  t.is(webhookEndpoint.url, `webhook_endpoints/${webhookEndpointId}`);
});

test('fintoc.webhookEndpoints.create()', async (t) => {
  const ctx: any = t.context;
  const webhookData = {
    url: 'https://example.com/webhook',
    enabled_events: ['payment_intent.succeeded'],
  };
  const webhookEndpoint = await ctx.fintoc.webhookEndpoints.create(webhookData);

  t.is(webhookEndpoint.method, 'post');
  t.is(webhookEndpoint.url, 'webhook_endpoints');
  t.is(webhookEndpoint.json.url, webhookData.url);
  t.deepEqual(webhookEndpoint.json.enabled_events, webhookData.enabled_events);
});

test('fintoc.webhookEndpoints.update()', async (t) => {
  const ctx: any = t.context;
  const webhookEndpointId = 'we_example_id';
  const updateData = {
    enabled_events: ['payment_intent.failed', 'refund.succeeded'],
  };
  const webhookEndpoint = await ctx.fintoc.webhookEndpoints.update(webhookEndpointId, updateData);

  t.is(webhookEndpoint.method, 'patch');
  t.is(webhookEndpoint.url, `webhook_endpoints/${webhookEndpointId}`);
  t.deepEqual(webhookEndpoint.json.enabled_events, updateData.enabled_events);
});

test('fintoc.webhookEndpoints.delete()', async (t) => {
  const ctx: any = t.context;
  const webhookEndpointId = 'we_example_id';
  const deletedIdentifier = await ctx.fintoc.webhookEndpoints.delete(webhookEndpointId);

  t.is(deletedIdentifier, webhookEndpointId);
});
