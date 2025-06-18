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

test('fintoc.paymentIntents.list()', async (t) => {
  const ctx: any = t.context;
  const paymentIntents = await ctx.fintoc.paymentIntents.list();

  let count = 0;
  for await (const paymentIntent of paymentIntents) {
    count += 1;
    t.is(paymentIntent.method, 'get');
    t.is(paymentIntent.url, 'v1/payment_intents');
  }

  t.true(count > 0);
});

test('fintoc.paymentIntents.all() - deprecated', async (t) => {
  const ctx: any = t.context;
  const paymentIntents = await ctx.fintoc.paymentIntents.all();

  let count = 0;
  for await (const paymentIntent of paymentIntents) {
    count += 1;
    t.is(paymentIntent.method, 'get');
    t.is(paymentIntent.url, 'v1/payment_intents');
  }

  t.true(count > 0);
});

test('fintoc.paymentIntents.get()', async (t) => {
  const ctx: any = t.context;
  const paymentId = 'payment_id';
  const paymentIntent = await ctx.fintoc.paymentIntents.get(paymentId);

  t.is(paymentIntent.method, 'get');
  t.is(paymentIntent.url, `v1/payment_intents/${paymentId}`);
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
  t.is(paymentIntent.url, 'v1/payment_intents');
  t.is(paymentIntent.json.amount, paymentData.amount);
  t.is(paymentIntent.json.currency, paymentData.currency);
  t.is(paymentIntent.json.payment_method, paymentData.payment_method);
});

test('fintoc.links.list()', async (t) => {
  const ctx: any = t.context;
  const links = await ctx.fintoc.links.list();

  let count = 0;
  for await (const link of links) {
    count += 1;
    t.is(link.method, 'get');
    t.is(link.url, 'v1/links');
  }

  t.true(count > 0);
});

test('fintoc.links.all() - deprecated', async (t) => {
  const ctx: any = t.context;
  const links = await ctx.fintoc.links.all();

  let count = 0;
  for await (const link of links) {
    count += 1;
    t.is(link.method, 'get');
    t.is(link.url, 'v1/links');
  }

  t.true(count > 0);
});

test('fintoc.links.get()', async (t) => {
  const ctx: any = t.context;
  const linkToken = 'link_token_example';
  const link = await ctx.fintoc.links.get(linkToken);

  t.is(link.method, 'get');
  t.is(link.url, `v1/links/${linkToken}`);
});

test('fintoc.links.update()', async (t) => {
  const ctx: any = t.context;
  const linkToken = 'link_token_example';
  const updateData = {
    username: 'updated_username',
  };
  const link = await ctx.fintoc.links.update(linkToken, updateData);

  t.is(link.method, 'patch');
  t.is(link.url, `v1/links/${linkToken}`);
  t.is(link.json.username, updateData.username);
});

test('fintoc.links.delete()', async (t) => {
  const ctx: any = t.context;
  const linkId = 'link_id';
  const deletedIdentifier = await ctx.fintoc.links.delete(linkId);

  t.is(deletedIdentifier, linkId);
});

test('fintoc.accounts.list()', async (t) => {
  const ctx: any = t.context;
  const accounts = await ctx.fintoc.accounts.list();

  let count = 0;
  for await (const account of accounts) {
    count += 1;
    t.is(account.method, 'get');
    t.is(account.url, 'v1/accounts');
  }

  t.true(count > 0);
});

test('fintoc.accounts.all() - deprecated', async (t) => {
  const ctx: any = t.context;
  const accounts = await ctx.fintoc.accounts.all();

  let count = 0;
  for await (const account of accounts) {
    count += 1;
    t.is(account.method, 'get');
    t.is(account.url, 'v1/accounts');
  }

  t.true(count > 0);
});

test('fintoc.accounts.get()', async (t) => {
  const ctx: any = t.context;
  const accountId = 'account_id';
  const account = await ctx.fintoc.accounts.get(accountId);

  t.is(account.method, 'get');
  t.is(account.url, `v1/accounts/${accountId}`);
});

test('fintoc.accounts.movements.list()', async (t) => {
  const ctx: any = t.context;
  const linkToken = 'link_token_example';
  const accountId = 'account_id';
  const movements = await ctx.fintoc.accounts.movements.list({
    account_id: accountId,
    link_token: linkToken,
  });

  let count = 0;
  for await (const movement of movements) {
    count += 1;
    t.is(movement.method, 'get');
    t.is(movement.url, `v1/accounts/${accountId}/movements`);
    t.is(movement.params.link_token, linkToken);
    t.is(movement.params.account_id, accountId);
  }

  t.true(count > 0);
});

test('fintoc.accounts.movements.all() - deprecated', async (t) => {
  const ctx: any = t.context;
  const linkToken = 'link_token_example';
  const accountId = 'account_id';
  const movements = await ctx.fintoc.accounts.movements.all({
    account_id: accountId,
    link_token: linkToken,
  });

  let count = 0;
  for await (const movement of movements) {
    count += 1;
    t.is(movement.method, 'get');
    t.is(movement.url, `v1/accounts/${accountId}/movements`);
    t.is(movement.params.link_token, linkToken);
    t.is(movement.params.account_id, accountId);
  }

  t.true(count > 0);
});

test('fintoc.accounts.movements.get()', async (t) => {
  const ctx: any = t.context;
  const linkToken = 'link_token_example';
  const accountId = 'account_id';

  const movementId = 'movement_id';
  const movement = await ctx.fintoc.accounts.movements.get(movementId, {
    account_id: accountId,
    link_token: linkToken,
  });

  t.is(movement.method, 'get');
  t.is(movement.url, `v1/accounts/${accountId}/movements/${movementId}`);
  t.is(movement.params.link_token, linkToken);
  t.is(movement.params.account_id, accountId);
});

test('fintoc.webhookEndpoints.list()', async (t) => {
  const ctx: any = t.context;
  const webhookEndpoints = await ctx.fintoc.webhookEndpoints.list();

  let count = 0;
  for await (const webhookEndpoint of webhookEndpoints) {
    count += 1;
    t.is(webhookEndpoint.method, 'get');
    t.is(webhookEndpoint.url, 'v1/webhook_endpoints');
  }

  t.true(count > 0);
});

test('fintoc.webhookEndpoints.all() - deprecated', async (t) => {
  const ctx: any = t.context;
  const webhookEndpoints = await ctx.fintoc.webhookEndpoints.all();

  let count = 0;
  for await (const webhookEndpoint of webhookEndpoints) {
    count += 1;
    t.is(webhookEndpoint.method, 'get');
    t.is(webhookEndpoint.url, 'v1/webhook_endpoints');
  }

  t.true(count > 0);
});

test('fintoc.webhookEndpoints.get()', async (t) => {
  const ctx: any = t.context;
  const webhookEndpointId = 'we_example_id';
  const webhookEndpoint = await ctx.fintoc.webhookEndpoints.get(webhookEndpointId);

  t.is(webhookEndpoint.method, 'get');
  t.is(webhookEndpoint.url, `v1/webhook_endpoints/${webhookEndpointId}`);
});

test('fintoc.webhookEndpoints.create()', async (t) => {
  const ctx: any = t.context;
  const webhookData = {
    url: 'https://example.com/webhook',
    enabled_events: ['payment_intent.succeeded'],
  };
  const webhookEndpoint = await ctx.fintoc.webhookEndpoints.create(webhookData);

  t.is(webhookEndpoint.method, 'post');
  t.is(webhookEndpoint.url, 'v1/webhook_endpoints');
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
  t.is(webhookEndpoint.url, `v1/webhook_endpoints/${webhookEndpointId}`);
  t.deepEqual(webhookEndpoint.json.enabled_events, updateData.enabled_events);
});

test('fintoc.webhookEndpoints.delete()', async (t) => {
  const ctx: any = t.context;
  const webhookEndpointId = 'we_example_id';
  const deletedIdentifier = await ctx.fintoc.webhookEndpoints.delete(webhookEndpointId);

  t.is(deletedIdentifier, webhookEndpointId);
});

test('fintoc.invoices.list()', async (t) => {
  const ctx: any = t.context;
  const invoices = await ctx.fintoc.invoices.list();

  let count = 0;
  for await (const invoice of invoices) {
    count += 1;
    t.is(invoice.method, 'get');
    t.is(invoice.url, 'v1/invoices');
  }

  t.true(count > 0);
});

test('fintoc.invoices.all() - deprecated', async (t) => {
  const ctx: any = t.context;
  const invoices = await ctx.fintoc.invoices.all();

  let count = 0;
  for await (const invoice of invoices) {
    count += 1;
    t.is(invoice.method, 'get');
    t.is(invoice.url, 'v1/invoices');
  }

  t.true(count > 0);
});

test('fintoc.refreshIntents.list()', async (t) => {
  const ctx: any = t.context;
  const refreshIntents = await ctx.fintoc.refreshIntents.list();

  let count = 0;
  for await (const refreshIntent of refreshIntents) {
    count += 1;
    t.is(refreshIntent.method, 'get');
    t.is(refreshIntent.url, 'v1/refresh_intents');
  }

  t.true(count > 0);
});

test('fintoc.refreshIntents.all() - deprecated', async (t) => {
  const ctx: any = t.context;
  const refreshIntents = await ctx.fintoc.refreshIntents.all();

  let count = 0;
  for await (const refreshIntent of refreshIntents) {
    count += 1;
    t.is(refreshIntent.method, 'get');
    t.is(refreshIntent.url, 'v1/refresh_intents');
  }

  t.true(count > 0);
});

test('fintoc.refreshIntents.get()', async (t) => {
  const ctx: any = t.context;
  const refreshIntentId = 'refresh_intent_id';
  const refreshIntent = await ctx.fintoc.refreshIntents.get(refreshIntentId);

  t.is(refreshIntent.method, 'get');
  t.is(refreshIntent.url, `v1/refresh_intents/${refreshIntentId}`);
});

test('fintoc.refreshIntents.create()', async (t) => {
  const ctx: any = t.context;
  const refreshData = {
    link_token: 'link_token_example',
    refresh_type: 'only_last',
  };
  const refreshIntent = await ctx.fintoc.refreshIntents.create(refreshData);

  t.is(refreshIntent.method, 'post');
  t.is(refreshIntent.url, 'v1/refresh_intents');
  t.is(refreshIntent.json.link_token, refreshData.link_token);
  t.is(refreshIntent.json.refresh_type, refreshData.refresh_type);
});

test('fintoc.subscriptions.list()', async (t) => {
  const ctx: any = t.context;
  const subscriptions = await ctx.fintoc.subscriptions.list();

  let count = 0;
  for await (const subscription of subscriptions) {
    count += 1;
    t.is(subscription.method, 'get');
    t.is(subscription.url, 'v1/subscriptions');
  }

  t.true(count > 0);
});

test('fintoc.subscriptions.all() - deprecated', async (t) => {
  const ctx: any = t.context;
  const subscriptions = await ctx.fintoc.subscriptions.all();

  let count = 0;
  for await (const subscription of subscriptions) {
    count += 1;
    t.is(subscription.method, 'get');
    t.is(subscription.url, 'v1/subscriptions');
  }

  t.true(count > 0);
});

test('fintoc.subscriptions.get()', async (t) => {
  const ctx: any = t.context;
  const subscriptionId = 'subscription_id';
  const subscription = await ctx.fintoc.subscriptions.get(subscriptionId);

  t.is(subscription.method, 'get');
  t.is(subscription.url, `v1/subscriptions/${subscriptionId}`);
});

test('fintoc.taxReturns.list()', async (t) => {
  const ctx: any = t.context;
  const taxReturns = await ctx.fintoc.taxReturns.list();

  let count = 0;
  for await (const taxReturn of taxReturns) {
    count += 1;
    t.is(taxReturn.method, 'get');
    t.is(taxReturn.url, 'v1/tax_returns');
  }

  t.true(count > 0);
});

test('fintoc.taxReturns.all() - deprecated', async (t) => {
  const ctx: any = t.context;
  const taxReturns = await ctx.fintoc.taxReturns.all();

  let count = 0;
  for await (const taxReturn of taxReturns) {
    count += 1;
    t.is(taxReturn.method, 'get');
    t.is(taxReturn.url, 'v1/tax_returns');
  }

  t.true(count > 0);
});

test('fintoc.taxReturns.get()', async (t) => {
  const ctx: any = t.context;
  const taxReturnId = 'tax_return_id';
  const taxReturn = await ctx.fintoc.taxReturns.get(taxReturnId);

  t.is(taxReturn.method, 'get');
  t.is(taxReturn.url, `v1/tax_returns/${taxReturnId}`);
});

test('link.accounts.list()', async (t) => {
  const ctx: any = t.context;
  const linkToken = 'link_token_example';
  const link = await ctx.fintoc.links.get(linkToken);

  const accounts = await link.accounts.list();

  t.is(link.accounts._client.params.link_token, linkToken);

  let count = 0;
  for await (const account of accounts) {
    count += 1;
    t.is(account.method, 'get');
    t.is(account.url, 'v1/accounts');
  }

  t.true(count > 0);
});

test('link.accounts.all() - deprecated', async (t) => {
  const ctx: any = t.context;
  const linkToken = 'link_token_example';
  const link = await ctx.fintoc.links.get(linkToken);

  const accounts = await link.accounts.all();

  t.is(link.accounts._client.params.link_token, linkToken);

  let count = 0;
  for await (const account of accounts) {
    count += 1;
    t.is(account.method, 'get');
    t.is(account.url, 'v1/accounts');
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
  t.is(account.url, `v1/accounts/${accountId}`);

  t.is(link.accounts._client.params.link_token, linkToken);
  t.is(account._client.params.link_token, linkToken);
});

test('account.movements.list()', async (t) => {
  const ctx: any = t.context;
  const linkToken = 'link_token_example';
  const link = await ctx.fintoc.links.get(linkToken);

  const accountId = 'account_id';
  const account = await link.accounts.get(accountId);

  const movements = await account.movements.list();

  t.is(account.movements._client.params.link_token, linkToken);

  let count = 0;
  for await (const movement of movements) {
    count += 1;
    t.is(movement.method, 'get');
    t.is(movement.url, `v1/accounts/${accountId}/movements`);
    t.is(movement._client.params.link_token, linkToken);
  }

  t.true(count > 0);
});

test('account.movements.all() - deprecated', async (t) => {
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
    t.is(movement.url, `v1/accounts/${accountId}/movements`);
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
  t.is(movement.url, `v1/accounts/${accountId}/movements/${movementId}`);
  t.is(movement._client.params.link_token, linkToken);
});

test('fintoc.v2.transfers.list()', async (t) => {
  const ctx: any = t.context;
  const transfers = await ctx.fintoc.v2.transfers.list();

  let count = 0;
  for await (const transfer of transfers) {
    count += 1;
    t.is(transfer.method, 'get');
    t.is(transfer.url, 'v2/transfers');
  }

  t.true(count > 0);
});

test('fintoc.v2.transfers.get()', async (t) => {
  const ctx: any = t.context;
  const transferId = 'transfer_id';
  const transfer = await ctx.fintoc.v2.transfers.get(transferId);

  t.is(transfer.method, 'get');
  t.is(transfer.url, `v2/transfers/${transferId}`);
});

test('fintoc.v2.transfers.create()', async (t) => {
  const ctx: any = t.context;
  const transferData = {
    amount: 10000,
    currency: 'MXN',
    counterparty: {
      account_number: '012969100000000026',
    },
  };
  const transfer = await ctx.fintoc.v2.transfers.create(transferData);

  t.is(transfer.method, 'post');
  t.is(transfer.url, 'v2/transfers');
  t.is(transfer.json.amount, transferData.amount);
  t.is(transfer.json.currency, transferData.currency);
  t.is(transfer.json.counterparty.account_number, transferData.counterparty.account_number);
  t.true(transfer.headers['Idempotency-Key'] && transfer.headers['Idempotency-Key'].length > 0);
});

test('fintoc.v2.transfers.create() with idempotency key', async (t) => {
  const ctx: any = t.context;
  const transferData = {
    amount: 10000,
    currency: 'MXN',
    idempotency_key: 'idempotency_key_123',
    counterparty: {
      account_number: '012969100000000026',
    },
  };
  const transfer = await ctx.fintoc.v2.transfers.create(transferData);

  t.is(transfer.method, 'post');
  t.is(transfer.url, 'v2/transfers');
  t.is(transfer.headers['Idempotency-Key'], transferData.idempotency_key);
});

test('fintoc.v2.accounts.list()', async (t) => {
  const ctx: any = t.context;
  const accounts = await ctx.fintoc.v2.accounts.list();

  let count = 0;
  for await (const account of accounts) {
    count += 1;
    t.is(account.method, 'get');
    t.is(account.url, 'v2/accounts');
  }

  t.true(count > 0);
});

test('fintoc.v2.accounts.get()', async (t) => {
  const ctx: any = t.context;
  const accountId = 'account_id';
  const account = await ctx.fintoc.v2.accounts.get(accountId);

  t.is(account.method, 'get');
  t.is(account.url, `v2/accounts/${accountId}`);
});

test('fintoc.v2.accounts.create()', async (t) => {
  const ctx: any = t.context;
  const accountData = {
    description: 'Test Account',
  };
  const account = await ctx.fintoc.v2.accounts.create(accountData);

  t.is(account.method, 'post');
  t.is(account.url, 'v2/accounts');
  t.is(account.json.description, accountData.description);
});

test('fintoc.v2.accountNumbers.list()', async (t) => {
  const ctx: any = t.context;
  const accountNumbers = await ctx.fintoc.v2.accountNumbers.list();

  let count = 0;
  for await (const accountNumber of accountNumbers) {
    count += 1;
    t.is(accountNumber.method, 'get');
    t.is(accountNumber.url, 'v2/account_numbers');
  }

  t.true(count > 0);
});

test('fintoc.v2.accountNumbers.get()', async (t) => {
  const ctx: any = t.context;
  const accountNumberId = 'account_number_id';
  const accountNumber = await ctx.fintoc.v2.accountNumbers.get(accountNumberId);

  t.is(accountNumber.method, 'get');
  t.is(accountNumber.url, `v2/account_numbers/${accountNumberId}`);
});

test('fintoc.v2.accountNumbers.create()', async (t) => {
  const ctx: any = t.context;
  const accountNumberData = {
    account_id: 'account_123',
    description: 'test acc number',
  };
  const accountNumber = await ctx.fintoc.v2.accountNumbers.create(accountNumberData);

  t.is(accountNumber.method, 'post');
  t.is(accountNumber.url, 'v2/account_numbers');
  t.is(accountNumber.json.account_id, accountNumberData.account_id);
  t.is(accountNumber.json.description, accountNumberData.description);
});

test('fintoc.v2.accountNumbers.update()', async (t) => {
  const ctx: any = t.context;
  const accountNumberId = 'account_number_id';
  const updateData = {
    status: 'enabled',
  };
  const accountNumber = await ctx.fintoc.v2.accountNumbers.update(accountNumberId, updateData);

  t.is(accountNumber.method, 'patch');
  t.is(accountNumber.url, `v2/account_numbers/${accountNumberId}`);
  t.is(accountNumber.json.status, updateData.status);
});

test('fintoc.v2.simulate.receiveTransfer()', async (t) => {
  const ctx: any = t.context;
  const transferData = {
    amount: 50000,
    currency: 'MXN',
    account_number_id: 'account_number_123',
  };
  const result = await ctx.fintoc.v2.simulate.receiveTransfer(transferData);

  t.is(result.method, 'post');
  t.is(result.url, 'v2/simulate/receive_transfer');
  t.is(result.json.amount, transferData.amount);
  t.is(result.json.currency, transferData.currency);
  t.is(result.json.account_number_id, transferData.account_number_id);
});

test('fintoc.v2.entities.list()', async (t) => {
  const ctx: any = t.context;
  const entities = await ctx.fintoc.v2.entities.list();

  let count = 0;
  for await (const entity of entities) {
    count += 1;
    t.is(entity.method, 'get');
    t.is(entity.url, 'v2/entities');
  }

  t.true(count > 0);
});

test('fintoc.v2.entities.get()', async (t) => {
  const ctx: any = t.context;
  const entityId = 'entity_id';
  const entity = await ctx.fintoc.v2.entities.get(entityId);

  t.is(entity.method, 'get');
  t.is(entity.url, `v2/entities/${entityId}`);
});
