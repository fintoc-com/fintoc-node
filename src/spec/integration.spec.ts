import test from 'ava';

import { Fintoc } from '../lib/core';
import { DisputeDocument } from '../lib/resources/disputeDocument';
import { AccountVerification, TransferBatch } from '../lib/resources/v2';

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
    payment_type: 'bank_transfer',
  };
  const paymentIntent = await ctx.fintoc.paymentIntents.create(paymentData);

  t.is(paymentIntent.method, 'post');
  t.is(paymentIntent.url, 'v1/payment_intents');
  t.is(paymentIntent.json.amount, paymentData.amount);
  t.is(paymentIntent.json.currency, paymentData.currency);
  t.is(paymentIntent.json.payment_type, paymentData.payment_type);
});

test('fintoc.paymentIntents.expire()', async (t) => {
  const ctx: any = t.context;
  const paymentIntentId = 'pi_2x9Q2ufili2A5Jw3ugI3CrdDHtS';
  const expiredPaymentIntent = await ctx.fintoc.paymentIntents.expire(paymentIntentId);

  t.is(expiredPaymentIntent.method, 'post');
  t.is(expiredPaymentIntent.url, `v1/payment_intents/${paymentIntentId}/expire`);
});

test('fintoc.paymentIntents.checkEligibility()', async (t) => {
  const ctx: any = t.context;
  const eligibilityData = {
    amount: 10000,
    currency: 'CLP',
  };
  const result = await ctx.fintoc.paymentIntents.checkEligibility(eligibilityData);

  t.is(result.method, 'post');
  t.is(result.url, 'v1/payment_intents/check_eligibility');
});

test('fintoc.paymentLinks.list()', async (t) => {
  const ctx: any = t.context;
  const paymentLinks = await ctx.fintoc.paymentLinks.list();

  let count = 0;
  for await (const paymentLink of paymentLinks) {
    count += 1;
    t.is(paymentLink.method, 'get');
    t.is(paymentLink.url, 'v1/payment_links');
  }

  t.true(count > 0);
});

test('fintoc.paymentLinks.get()', async (t) => {
  const ctx: any = t.context;
  const paymentLinkId = 'pl_example_id';
  const paymentLink = await ctx.fintoc.paymentLinks.get(paymentLinkId);

  t.is(paymentLink.method, 'get');
  t.is(paymentLink.url, `v1/payment_links/${paymentLinkId}`);
});

test('fintoc.paymentLinks.create()', async (t) => {
  const ctx: any = t.context;
  const paymentLinkData = {
    amount: 5000,
    currency: 'CLP',
    description: 'Payment for services',
  };
  const paymentLink = await ctx.fintoc.paymentLinks.create(paymentLinkData);

  t.is(paymentLink.method, 'post');
  t.is(paymentLink.url, 'v1/payment_links');
  t.is(paymentLink.json.amount, paymentLinkData.amount);
  t.is(paymentLink.json.currency, paymentLinkData.currency);
  t.is(paymentLink.json.description, paymentLinkData.description);
});

test('fintoc.paymentLinks.cancel()', async (t) => {
  const ctx: any = t.context;
  const paymentLinkId = 'pl_example_id';
  const cancelledPaymentLink = await ctx.fintoc.paymentLinks.cancel(paymentLinkId);

  t.is(cancelledPaymentLink.method, 'patch');
  t.is(cancelledPaymentLink.url, `v1/payment_links/${paymentLinkId}/cancel`);
  t.is(cancelledPaymentLink.json.path_, undefined);
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

test('fintoc.webhookEndpoints.test()', async (t) => {
  const ctx: any = t.context;
  const webhookEndpointId = 'we_example_id';
  const eventType = 'payment_intent.succeeded';
  const event = await ctx.fintoc.webhookEndpoints.test(webhookEndpointId, { type: eventType });

  t.is(event.method, 'post');
  t.is(event.url, `v1/webhook_endpoints/${webhookEndpointId}/test`);
  t.is(event.json.type, eventType);
  t.is(event.json.path_, undefined);
});

test('fintoc.events.trigger()', async (t) => {
  const ctx: any = t.context;
  const event = await ctx.fintoc.events.trigger({
    type: 'payment_intent.succeeded',
    overrides: { amount: 1000 },
  });

  t.is(event.method, 'post');
  t.is(event.url, 'v1/events/trigger');
  t.is(event.json.type, 'payment_intent.succeeded');
  t.is(event.json.overrides.amount, 1000);
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
  t.is(refreshIntent.params.link_token, refreshData.link_token);
  t.is(refreshIntent.params.refresh_type, refreshData.refresh_type);
  t.is(refreshIntent.json.link_token, undefined);
  t.true(refreshIntent.headers['Idempotency-Key'] && refreshIntent.headers['Idempotency-Key'].length > 0);
});

test('fintoc.refreshIntents.create() with idempotency key', async (t) => {
  const ctx: any = t.context;
  const refreshIntent = await ctx.fintoc.refreshIntents.create({
    link_token: 'link_token_example',
    result_status: 'succeeded',
    idempotency_key: 'idem_123',
  });

  t.is(refreshIntent.params.result_status, 'succeeded');
  t.is(refreshIntent.params.idempotency_key, undefined);
  t.is(refreshIntent.headers['Idempotency-Key'], 'idem_123');
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

test('fintoc.charges.list()', async (t) => {
  const ctx: any = t.context;
  const charges = await ctx.fintoc.charges.list();

  let count = 0;
  for await (const charge of charges) {
    count += 1;
    t.is(charge.method, 'get');
    t.is(charge.url, 'v1/charges');
  }

  t.true(count > 0);
});

test('fintoc.charges.get()', async (t) => {
  const ctx: any = t.context;
  const chargeId = 'charge_id';
  const charge = await ctx.fintoc.charges.get(chargeId);

  t.is(charge.method, 'get');
  t.is(charge.url, `v1/charges/${chargeId}`);
});

test('fintoc.charges.create()', async (t) => {
  const ctx: any = t.context;
  const chargeData = {
    amount: 1000,
    currency: 'CLP',
    payment_method: 'bank_transfer',
  };
  const charge = await ctx.fintoc.charges.create(chargeData);

  t.is(charge.method, 'post');
  t.is(charge.url, 'v1/charges');
  t.is(charge.json.amount, chargeData.amount);
  t.is(charge.json.currency, chargeData.currency);
  t.is(charge.json.payment_method, chargeData.payment_method);
});

test('fintoc.refunds.list()', async (t) => {
  const ctx: any = t.context;
  const refunds = await ctx.fintoc.refunds.list();

  let count = 0;
  for await (const refund of refunds) {
    count += 1;
    t.is(refund.method, 'get');
    t.is(refund.url, 'v1/refunds');
  }

  t.true(count > 0);
});

test('fintoc.refunds.get()', async (t) => {
  const ctx: any = t.context;
  const refundId = 'ref_QmbpWzP1HOngN3X7';
  const refund = await ctx.fintoc.refunds.get(refundId);

  t.is(refund.method, 'get');
  t.is(refund.url, `v1/refunds/${refundId}`);
});

test('fintoc.refunds.create()', async (t) => {
  const ctx: any = t.context;
  const refundData = {
    resource_type: 'payment_intent',
    resource_id: 'pi_30yWq311fOLrAAKkSH1bvODVLGa',
    amount: 1000,
  };
  const refund = await ctx.fintoc.refunds.create(refundData);

  t.is(refund.method, 'post');
  t.is(refund.url, 'v1/refunds');
  t.is(refund.json.resource_type, refundData.resource_type);
  t.is(refund.json.resource_id, refundData.resource_id);
  t.is(refund.json.amount, refundData.amount);
});

test('fintoc.refunds.cancel()', async (t) => {
  const ctx: any = t.context;
  const refundId = 'ref_QmbpWzP1HOngN3X7';
  const refund = await ctx.fintoc.refunds.cancel(refundId, { idempotency_key: 'idem_123' });

  t.is(refund.method, 'post');
  t.is(refund.url, `v1/refunds/${refundId}/cancel`);
  t.is(refund.json.path_, undefined);
  t.is(refund.json.idempotency_key, undefined);
  t.is(refund.headers['Idempotency-Key'], 'idem_123');
});

test('fintoc.disputes.list()', async (t) => {
  const ctx: any = t.context;
  const disputes = await ctx.fintoc.disputes.list();

  let count = 0;
  for await (const dispute of disputes) {
    count += 1;
    t.is(dispute.method, 'get');
    t.is(dispute.url, 'v1/disputes');
  }

  t.true(count > 0);
});

test('fintoc.disputes.list() with filters', async (t) => {
  const ctx: any = t.context;
  const filters = {
    status: 'open',
    resource_id: 'pi_30yWq311fOLrAAKkSH1bvODVLGa',
  };
  const disputes = await ctx.fintoc.disputes.list(filters);

  let count = 0;
  for await (const dispute of disputes) {
    count += 1;
    t.is(dispute.method, 'get');
    t.is(dispute.url, 'v1/disputes');
    t.is(dispute.params.status, filters.status);
    t.is(dispute.params.resource_id, filters.resource_id);
  }

  t.true(count > 0);
});

test('fintoc.disputes.get()', async (t) => {
  const ctx: any = t.context;
  const disputeId = 'dp_example_id';
  const dispute = await ctx.fintoc.disputes.get(disputeId);

  t.is(dispute.method, 'get');
  t.is(dispute.url, `v1/disputes/${disputeId}`);
});

test('fintoc.disputes.submitForReview()', async (t) => {
  const ctx: any = t.context;
  const disputeId = 'dp_example_id';
  const dispute = await ctx.fintoc.disputes.submitForReview(disputeId);

  t.is(dispute.method, 'post');
  t.is(dispute.url, `v1/disputes/${disputeId}/submit_for_review`);
});

test('fintoc.disputes.createDocument()', async (t) => {
  const ctx: any = t.context;
  const disputeId = 'dp_example_id';
  const document = await ctx.fintoc.disputes.createDocument(disputeId, {
    file: { data: Buffer.from('pdf bytes'), filename: 'evidence.pdf', contentType: 'application/pdf' },
  });

  t.true(document instanceof DisputeDocument);
  t.is(document.method, 'post');
  t.is(document.url, `v1/disputes/${disputeId}/documents`);
  t.true(document.multipart);
  t.deepEqual(document.multipartFields, ['file']);
  t.true(document.headers['Idempotency-Key'] && document.headers['Idempotency-Key'].length > 0);
});

test('fintoc.disputes.createDocument() with a Blob and idempotency key', async (t) => {
  const ctx: any = t.context;
  const document = await ctx.fintoc.disputes.createDocument('dp_example_id', {
    file: { data: new Blob(['pdf bytes']), filename: 'evidence.pdf' },
    idempotency_key: 'idem_123',
  });

  t.true(document instanceof DisputeDocument);
  t.deepEqual(document.multipartFields, ['file']);
  t.is(document.headers['Idempotency-Key'], 'idem_123');
});

test('fintoc.subscriptionIntents.list()', async (t) => {
  const ctx: any = t.context;
  const subscriptionIntents = await ctx.fintoc.subscriptionIntents.list();

  let count = 0;
  for await (const subscriptionIntent of subscriptionIntents) {
    count += 1;
    t.is(subscriptionIntent.method, 'get');
    t.is(subscriptionIntent.url, 'v1/subscription_intents');
  }

  t.true(count > 0);
});

test('fintoc.subscriptionIntents.get()', async (t) => {
  const ctx: any = t.context;
  const subscriptionIntentId = 'subscription_intent_id';
  const subscriptionIntent = await ctx.fintoc.subscriptionIntents.get(subscriptionIntentId);

  t.is(subscriptionIntent.method, 'get');
  t.is(subscriptionIntent.url, `v1/subscription_intents/${subscriptionIntentId}`);
});

test('fintoc.subscriptionIntents.create()', async (t) => {
  const ctx: any = t.context;
  const subscriptionIntentData = {
    amount: 1000,
    currency: 'CLP',
  };
  const subscriptionIntent = await ctx.fintoc.subscriptionIntents.create(subscriptionIntentData);

  t.is(subscriptionIntent.method, 'post');
  t.is(subscriptionIntent.url, 'v1/subscription_intents');
  t.is(subscriptionIntent.json.amount, subscriptionIntentData.amount);
  t.is(subscriptionIntent.json.currency, subscriptionIntentData.currency);
});

test('fintoc.checkoutSessions.create()', async (t) => {
  const ctx: any = t.context;
  const checkoutSessionData = {
    amount: 5000,
    currency: 'CLP',
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  };
  const checkoutSession = await ctx.fintoc.checkoutSessions.create(checkoutSessionData);

  t.is(checkoutSession.method, 'post');
  t.is(checkoutSession.url, 'v1/checkout_sessions');
  t.is(checkoutSession.json.amount, checkoutSessionData.amount);
  t.is(checkoutSession.json.currency, checkoutSessionData.currency);
  t.is(checkoutSession.json.success_url, checkoutSessionData.success_url);
  t.is(checkoutSession.json.cancel_url, checkoutSessionData.cancel_url);
});

test('fintoc.checkoutSessions.get()', async (t) => {
  const ctx: any = t.context;
  const checkoutSessionId = 'checkout_session_id';
  const checkoutSession = await ctx.fintoc.checkoutSessions.get(checkoutSessionId);

  t.is(checkoutSession.method, 'get');
  t.is(checkoutSession.url, `v1/checkout_sessions/${checkoutSessionId}`);
});

test('fintoc.checkoutSessions.expire()', async (t) => {
  const ctx: any = t.context;
  const checkoutSessionId = 'checkout_session_id';
  const checkoutSession = await ctx.fintoc.checkoutSessions.expire(checkoutSessionId);

  t.is(checkoutSession.method, 'post');
  t.is(checkoutSession.url, `v1/checkout_sessions/${checkoutSessionId}/expire`);
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

test('fintoc.v2.accountNumbers.delete()', async (t) => {
  const ctx: any = t.context;
  const accountNumberId = 'acno_Kasf91034gj1AD';
  const deletedIdentifier = await ctx.fintoc.v2.accountNumbers.delete(accountNumberId);

  t.is(deletedIdentifier, accountNumberId);
});

test('fintoc.v2.transfers.return()', async (t) => {
  const ctx: any = t.context;
  const returnData = {
    transfer_id: 'transfer_123',
  };
  const result = await ctx.fintoc.v2.transfers.return(returnData);

  t.is(result.method, 'post');
  t.is(result.url, 'v2/transfers/return');
  t.is(result.json.transfer_id, returnData.transfer_id);
});

test('fintoc.v2.transferBatches.list()', async (t) => {
  const ctx: any = t.context;
  const transferBatches = await ctx.fintoc.v2.transferBatches.list();

  let count = 0;
  for await (const transferBatch of transferBatches) {
    count += 1;
    t.is(transferBatch.method, 'get');
    t.is(transferBatch.url, 'v2/transfer_batches');
  }

  t.true(count > 0);
});

test('fintoc.v2.transferBatches.list() with filters', async (t) => {
  const ctx: any = t.context;
  const filters = {
    status: ['succeeded', 'partially_succeeded'],
    since: '2025-01-01',
    until: '2025-01-31',
  };
  const transferBatches = await ctx.fintoc.v2.transferBatches.list(filters);

  let count = 0;
  for await (const transferBatch of transferBatches) {
    count += 1;
    t.is(transferBatch.method, 'get');
    t.is(transferBatch.url, 'v2/transfer_batches');
    t.deepEqual(transferBatch.params.status, filters.status);
    t.deepEqual(transferBatch.params.since, new Date(filters.since));
    t.deepEqual(transferBatch.params.until, new Date(filters.until));
  }

  t.true(count > 0);
});

test('fintoc.v2.transferBatches.get()', async (t) => {
  const ctx: any = t.context;
  const transferBatchId = 'transfer_batch_id';
  const transferBatch = await ctx.fintoc.v2.transferBatches.get(transferBatchId);

  t.true(transferBatch instanceof TransferBatch);
  t.is(transferBatch.method, 'get');
  t.is(transferBatch.url, `v2/transfer_batches/${transferBatchId}`);
});

test('fintoc.v2.transferBatches.create()', async (t) => {
  const ctx: any = t.context;
  const transferBatchData = {
    description: 'Payroll',
    currency: 'MXN',
    transfers: [
      {
        amount: 10000,
        account_id: 'acc_123',
        counterparty: {
          account_number: '012969100000000026',
        },
      },
    ],
  };
  const transferBatch = await ctx.fintoc.v2.transferBatches.create(transferBatchData);

  t.is(transferBatch.method, 'post');
  t.is(transferBatch.url, 'v2/transfer_batches');
  t.is(transferBatch.json.description, transferBatchData.description);
  t.is(transferBatch.json.currency, transferBatchData.currency);
  t.is(transferBatch.json.transfers[0].amount, transferBatchData.transfers[0].amount);
  t.is(
    transferBatch.json.transfers[0].counterparty.account_number,
    transferBatchData.transfers[0].counterparty.account_number,
  );
  t.true(transferBatch.headers['Idempotency-Key'] && transferBatch.headers['Idempotency-Key'].length > 0);
});

test('fintoc.v2.transferBatches.create() with idempotency key', async (t) => {
  const ctx: any = t.context;
  const transferBatchData = {
    description: 'Payroll',
    currency: 'MXN',
    idempotency_key: 'idempotency_key_123',
    transfers: [
      {
        amount: 10000,
        account_id: 'acc_123',
        counterparty: {
          account_number: '012969100000000026',
        },
      },
    ],
  };
  const transferBatch = await ctx.fintoc.v2.transferBatches.create(transferBatchData);

  t.is(transferBatch.method, 'post');
  t.is(transferBatch.url, 'v2/transfer_batches');
  t.is(transferBatch.headers['Idempotency-Key'], transferBatchData.idempotency_key);
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

test('fintoc.v2.accountVerifications.list()', async (t) => {
  const ctx: any = t.context;
  const accountVerifications = await ctx.fintoc.v2.accountVerifications.list();

  let count = 0;
  for await (const accountVerification of accountVerifications) {
    count += 1;
    t.is(accountVerification.method, 'get');
    t.is(accountVerification.url, 'v2/account_verifications');
  }

  t.true(count > 0);
});

test('fintoc.v2.accountVerifications.get()', async (t) => {
  const ctx: any = t.context;
  const accountVerificationId = 'account_verification_id';
  const accountVerification = await ctx.fintoc.v2.accountVerifications.get(accountVerificationId);

  t.true(accountVerification instanceof AccountVerification);
  t.is(accountVerification.method, 'get');
  t.is(accountVerification.url, `v2/account_verifications/${accountVerificationId}`);
});

test('fintoc.v2.accountVerifications.create()', async (t) => {
  const ctx: any = t.context;
  const accountVerificationData = {
    account_number: 'account_123',
  };
  const accountVerification = await ctx.fintoc.v2.accountVerifications.create(
    accountVerificationData,
  );

  t.is(accountVerification.method, 'post');
  t.is(accountVerification.url, 'v2/account_verifications');
  t.is(accountVerification.json.account_number, accountVerificationData.account_number);
});

test('fintoc.v2.accounts.movements.list()', async (t) => {
  const ctx: any = t.context;
  const accountId = 'account_id';
  const movements = await ctx.fintoc.v2.accounts.movements.list({
    account_id: accountId,
  });

  let count = 0;
  for await (const movement of movements) {
    count += 1;
    t.is(movement.method, 'get');
    t.is(movement.url, `v2/accounts/${accountId}/movements`);
    t.is(movement.params.account_id, accountId);
  }

  t.true(count > 0);
});

test('fintoc.v2.accounts.movements.get()', async (t) => {
  const ctx: any = t.context;
  const accountId = 'account_id';
  const movementId = 'movement_id';
  const movement = await ctx.fintoc.v2.accounts.movements.get(movementId, {
    account_id: accountId,
  });

  t.is(movement.method, 'get');
  t.is(movement.url, `v2/accounts/${accountId}/movements/${movementId}`);
  t.is(movement.params.account_id, accountId);
});

test('fintoc.v2.accounts.accountStatements.list()', async (t) => {
  const ctx: any = t.context;
  const accountId = 'acc_12345';
  const accountStatements = await ctx.fintoc.v2.accounts.accountStatements.list({
    account_id: accountId,
  });

  let count = 0;
  for await (const accountStatement of accountStatements) {
    count += 1;
    t.is(accountStatement.method, 'get');
    t.is(accountStatement.url, `v2/accounts/${accountId}/account_statements`);
    t.is(accountStatement.params.account_id, accountId);
  }

  t.true(count > 0);
});

test('fintoc.v2.accounts.update()', async (t) => {
  const ctx: any = t.context;
  const entityId = 'entity_123';
  const updateData = {
    description: 'Updated account description',
  };
  const account = await ctx.fintoc.v2.accounts.update(entityId, updateData);

  t.is(account.method, 'patch');
  t.is(account.url, `v2/accounts/${entityId}`);
  t.is(account.json.description, updateData.description);
});

test('fintoc.v2.customers.list()', async (t) => {
  const ctx: any = t.context;
  const customers = await ctx.fintoc.v2.customers.list();

  let count = 0;
  for await (const customer of customers) {
    count += 1;
    t.is(customer.method, 'get');
    t.is(customer.url, 'v2/customers');
  }

  t.true(count > 0);
});

test('fintoc.v2.customers.get()', async (t) => {
  const ctx: any = t.context;
  const customerId = 'customer_id';
  const customer = await ctx.fintoc.v2.customers.get(customerId);

  t.is(customer.method, 'get');
  t.is(customer.url, `v2/customers/${customerId}`);
});

test('fintoc.v2.customers.create()', async (t) => {
  const ctx: any = t.context;
  const customerData = {
    name: 'Test Customer',
    email: 'test@example.com',
  };
  const customer = await ctx.fintoc.v2.customers.create(customerData);

  t.is(customer.method, 'post');
  t.is(customer.url, 'v2/customers');
  t.is(customer.json.name, customerData.name);
  t.is(customer.json.email, customerData.email);
});

test('fintoc.v2.checkoutSessions.list()', async (t) => {
  const ctx: any = t.context;
  const checkoutSessions = await ctx.fintoc.v2.checkoutSessions.list();

  let count = 0;
  for await (const checkoutSession of checkoutSessions) {
    count += 1;
    t.is(checkoutSession.method, 'get');
    t.is(checkoutSession.url, 'v2/checkout_sessions');
  }

  t.true(count > 0);
});

test('fintoc.v2.checkoutSessions.get()', async (t) => {
  const ctx: any = t.context;
  const checkoutSessionId = 'checkout_session_id';
  const checkoutSession = await ctx.fintoc.v2.checkoutSessions.get(checkoutSessionId);

  t.is(checkoutSession.method, 'get');
  t.is(checkoutSession.url, `v2/checkout_sessions/${checkoutSessionId}`);
});

test('fintoc.v2.checkoutSessions.create()', async (t) => {
  const ctx: any = t.context;
  const checkoutSessionData = {
    amount: 5000,
    currency: 'CLP',
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  };
  const checkoutSession = await ctx.fintoc.v2.checkoutSessions.create(checkoutSessionData);

  t.is(checkoutSession.method, 'post');
  t.is(checkoutSession.url, 'v2/checkout_sessions');
  t.is(checkoutSession.json.amount, checkoutSessionData.amount);
  t.is(checkoutSession.json.currency, checkoutSessionData.currency);
  t.is(checkoutSession.json.success_url, checkoutSessionData.success_url);
  t.is(checkoutSession.json.cancel_url, checkoutSessionData.cancel_url);
});

test('fintoc.v2.checkoutSessions.expire()', async (t) => {
  const ctx: any = t.context;
  const checkoutSessionId = 'checkout_session_id';
  const checkoutSession = await ctx.fintoc.v2.checkoutSessions.expire(checkoutSessionId);

  t.is(checkoutSession.method, 'post');
  t.is(checkoutSession.url, `v2/checkout_sessions/${checkoutSessionId}/expire`);
});

test('fintoc.v2.invoices.list()', async (t) => {
  const ctx: any = t.context;
  const invoices = await ctx.fintoc.v2.invoices.list();

  let count = 0;
  for await (const invoice of invoices) {
    count += 1;
    t.is(invoice.method, 'get');
    t.is(invoice.url, 'v2/invoices');
  }

  t.true(count > 0);
});

test('fintoc.v2.invoices.get()', async (t) => {
  const ctx: any = t.context;
  const invoiceId = 'invoice_id';
  const invoice = await ctx.fintoc.v2.invoices.get(invoiceId);

  t.is(invoice.method, 'get');
  t.is(invoice.url, `v2/invoices/${invoiceId}`);
});

test('fintoc.v2.invoices.addLines()', async (t) => {
  const ctx: any = t.context;
  const invoiceId = 'invoice_id';
  const lines = [{
    amount: 10000,
    currency: 'CLP',
    period_end: '2024-02-01',
    period_start: '2024-01-01',
    quantity: 1,
  }];
  const invoice = await ctx.fintoc.v2.invoices.addLines(invoiceId, { lines });

  t.is(invoice.method, 'post');
  t.is(invoice.url, `v2/invoices/${invoiceId}/add_lines`);
  t.is(invoice.json.lines[0].amount, lines[0].amount);
  t.is(invoice.json.path_, undefined);
});

test('fintoc.v2.invoices.removeLines()', async (t) => {
  const ctx: any = t.context;
  const invoiceId = 'invoice_id';
  const lines = ['il_line_id'];
  const invoice = await ctx.fintoc.v2.invoices.removeLines(invoiceId, { lines });

  t.is(invoice.method, 'post');
  t.is(invoice.url, `v2/invoices/${invoiceId}/remove_lines`);
});

test('fintoc.v2.invoices.lines.update()', async (t) => {
  const ctx: any = t.context;
  const invoiceId = 'invoice_id';
  const lineId = 'il_line_id';
  const line = await ctx.fintoc.v2.invoices.lines.update(lineId, {
    invoice_id: invoiceId,
    quantity: 2,
  });

  t.is(line.method, 'patch');
  t.is(line.url, `v2/invoices/${invoiceId}/lines/${lineId}`);
  t.is(line.json.quantity, 2);
  t.is(line.json.invoice_id, undefined);
});

test('fintoc.v2.paymentIntents.list()', async (t) => {
  const ctx: any = t.context;
  const paymentIntents = await ctx.fintoc.v2.paymentIntents.list();

  let count = 0;
  for await (const paymentIntent of paymentIntents) {
    count += 1;
    t.is(paymentIntent.method, 'get');
    t.is(paymentIntent.url, 'v2/payment_intents');
  }

  t.true(count > 0);
});

test('fintoc.v2.paymentIntents.get()', async (t) => {
  const ctx: any = t.context;
  const paymentIntentId = 'payment_intent_id';
  const paymentIntent = await ctx.fintoc.v2.paymentIntents.get(paymentIntentId);

  t.is(paymentIntent.method, 'get');
  t.is(paymentIntent.url, `v2/payment_intents/${paymentIntentId}`);
});

test('fintoc.v2.paymentIntents.create()', async (t) => {
  const ctx: any = t.context;
  const paymentIntentData = {
    amount: 5000,
    currency: 'CLP',
    payment_method: 'payment_method_hashid',
  };
  const paymentIntent = await ctx.fintoc.v2.paymentIntents.create(paymentIntentData);

  t.is(paymentIntent.method, 'post');
  t.is(paymentIntent.url, 'v2/payment_intents');
  t.is(paymentIntent.json.amount, paymentIntentData.amount);
  t.is(paymentIntent.json.currency, paymentIntentData.currency);
  t.is(paymentIntent.json.payment_method, paymentIntentData.payment_method);
});

test('fintoc.v2.paymentMethods.list()', async (t) => {
  const ctx: any = t.context;
  const paymentMethods = await ctx.fintoc.v2.paymentMethods.list();

  let count = 0;
  for await (const paymentMethod of paymentMethods) {
    count += 1;
    t.is(paymentMethod.method, 'get');
    t.is(paymentMethod.url, 'v2/payment_methods');
  }

  t.true(count > 0);
});

test('fintoc.v2.paymentMethods.get()', async (t) => {
  const ctx: any = t.context;
  const paymentMethodId = 'payment_method_id';
  const paymentMethod = await ctx.fintoc.v2.paymentMethods.get(paymentMethodId);

  t.is(paymentMethod.method, 'get');
  t.is(paymentMethod.url, `v2/payment_methods/${paymentMethodId}`);
});

test('fintoc.v2.subscriptions.list()', async (t) => {
  const ctx: any = t.context;
  const subscriptions = await ctx.fintoc.v2.subscriptions.list();

  let count = 0;
  for await (const subscription of subscriptions) {
    count += 1;
    t.is(subscription.method, 'get');
    t.is(subscription.url, 'v2/subscriptions');
  }

  t.true(count > 0);
});

test('fintoc.v2.subscriptions.get()', async (t) => {
  const ctx: any = t.context;
  const subscriptionId = 'subscription_id';
  const subscription = await ctx.fintoc.v2.subscriptions.get(subscriptionId);

  t.is(subscription.method, 'get');
  t.is(subscription.url, `v2/subscriptions/${subscriptionId}`);
});

test('fintoc.v2.subscriptions.cancel()', async (t) => {
  const ctx: any = t.context;
  const subscriptionId = 'subscription_id';
  const subscription = await ctx.fintoc.v2.subscriptions.cancel(subscriptionId);

  t.is(subscription.method, 'post');
  t.is(subscription.url, `v2/subscriptions/${subscriptionId}/cancel`);
});

test('fintoc.v2.subscriptions.create()', async (t) => {
  const ctx: any = t.context;
  const subscriptionData = {
    customer: 'cus_id',
    items: [{ price: 'price_id', quantity: 1 }],
  };
  const subscription = await ctx.fintoc.v2.subscriptions.create(subscriptionData);

  t.is(subscription.method, 'post');
  t.is(subscription.url, 'v2/subscriptions');
  t.is(subscription.json.customer, subscriptionData.customer);
});

test('fintoc.v2.subscriptions.update()', async (t) => {
  const ctx: any = t.context;
  const subscriptionId = 'subscription_id';
  const updateData = {
    trial_end: '2024-12-31T00:00:00Z',
  };
  const subscription = await ctx.fintoc.v2.subscriptions.update(subscriptionId, updateData);

  t.is(subscription.method, 'patch');
  t.is(subscription.url, `v2/subscriptions/${subscriptionId}`);
});

test('fintoc.v2.subscriptions.items.create()', async (t) => {
  const ctx: any = t.context;
  const subscriptionId = 'subscription_id';
  const item = await ctx.fintoc.v2.subscriptions.items.create({
    subscription_id: subscriptionId,
    price_data: { product: 'prod_id', amount: 10000, currency: 'CLP' },
    quantity: 1,
  });

  t.is(item.method, 'post');
  t.is(item.url, `v2/subscriptions/${subscriptionId}/items`);
  t.is(item.json.subscription_id, undefined);
  t.is(item.json.path_, undefined);
  t.is(item.json.quantity, 1);
});

test('fintoc.v2.subscriptions.items.update()', async (t) => {
  const ctx: any = t.context;
  const subscriptionId = 'subscription_id';
  const itemId = 'si_item_id';
  const item = await ctx.fintoc.v2.subscriptions.items.update(itemId, {
    subscription_id: subscriptionId,
    quantity: 3,
  });

  t.is(item.method, 'patch');
  t.is(item.url, `v2/subscriptions/${subscriptionId}/items/${itemId}`);
  t.is(item.json.quantity, 3);
  t.is(item.json.subscription_id, undefined);
});

test('fintoc.v2.subscriptions.items.delete()', async (t) => {
  const ctx: any = t.context;
  const subscriptionId = 'subscription_id';
  const itemId = 'si_item_id';
  const deletedIdentifier = await ctx.fintoc.v2.subscriptions.items.delete(itemId, {
    subscription_id: subscriptionId,
  });

  t.is(deletedIdentifier, itemId);
});

test('fintoc.v2.products.list()', async (t) => {
  const ctx: any = t.context;
  const products = await ctx.fintoc.v2.products.list();

  let count = 0;
  for await (const product of products) {
    count += 1;
    t.is(product.method, 'get');
    t.is(product.url, 'v2/products');
  }

  t.true(count > 0);
});

test('fintoc.v2.products.get()', async (t) => {
  const ctx: any = t.context;
  const productId = 'product_id';
  const product = await ctx.fintoc.v2.products.get(productId);

  t.is(product.method, 'get');
  t.is(product.url, `v2/products/${productId}`);
});

test('fintoc.v2.products.create()', async (t) => {
  const ctx: any = t.context;
  const productData = {
    name: 'Test Product',
    currency: 'CLP',
  };
  const product = await ctx.fintoc.v2.products.create(productData);

  t.is(product.method, 'post');
  t.is(product.url, 'v2/products');
  t.is(product.json.name, productData.name);
  t.is(product.json.currency, productData.currency);
});

test('fintoc.v2.entities.onboardings is wired', (t) => {
  const ctx: any = t.context;
  t.truthy(ctx.fintoc.v2.entities.onboardings);
  t.is(typeof ctx.fintoc.v2.entities.onboardings.list, 'function');
  t.is(typeof ctx.fintoc.v2.entities.onboardings.get, 'function');
  t.is(typeof ctx.fintoc.v2.entities.onboardings.create, 'function');
  t.is(typeof ctx.fintoc.v2.entities.onboardings.submit, 'function');
  t.is(typeof ctx.fintoc.v2.entities.onboardings.uploadDocument, 'function');
  t.is(typeof ctx.fintoc.v2.entities.onboardings.uploadShareholderDocument, 'function');
  t.is(typeof ctx.fintoc.v2.entities.onboardings.uploadLegalRepresentativeDocument, 'function');
});

test('fintoc.v2.entities.onboardings.list()', async (t) => {
  const ctx: any = t.context;
  const entityId = 'ent_12345';
  const onboardings = await ctx.fintoc.v2.entities.onboardings.list({
    entity_id: entityId,
  });

  let count = 0;
  for await (const onboarding of onboardings) {
    count += 1;
    t.is(onboarding.method, 'get');
    t.is(onboarding.url, `v2/entities/${entityId}/onboardings`);
    t.is(onboarding.params.entity_id, entityId);
  }

  t.true(count > 0);
});

test('fintoc.v2.entities.onboardings.get()', async (t) => {
  const ctx: any = t.context;
  const entityId = 'ent_12345';
  const onboardingId = 'onb_12345';
  const onboarding = await ctx.fintoc.v2.entities.onboardings.get(onboardingId, {
    entity_id: entityId,
  });

  t.is(onboarding.method, 'get');
  t.is(onboarding.url, `v2/entities/${entityId}/onboardings/${onboardingId}`);
  t.is(onboarding.params.entity_id, entityId);
});

test('fintoc.v2.entities.onboardings.create()', async (t) => {
  const ctx: any = t.context;
  const entityId = 'ent_12345';
  const onboardingData = {
    entity_id: entityId,
    type: 'account_holder',
    data: {
      company_information: { business_activity: 'Servicios financieros' },
      legal_representatives: [
        {
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'jane@acme.com',
          nationality: 'mx',
          identification_number: 'AAAA010101HDFAAA01',
          position: 'Director General',
        },
      ],
      transactional_profile: {
        resource_origins: ['trusts', 'investments'],
        monthly_amount_range: '1_500000',
        monthly_operations_range: '1_15000',
      },
      shareholders: [
        {
          type: 'natural_person',
          name: 'Jane',
          last_name: 'Doe',
          holder_id: 'AAAA010101AAA',
          nationality: 'mx',
          percentage: 100,
        },
      ],
    },
  };
  const onboarding = await ctx.fintoc.v2.entities.onboardings.create(onboardingData);

  t.is(onboarding.method, 'post');
  t.is(onboarding.url, `v2/entities/${entityId}/onboardings`);
  t.is(onboarding.json.entity_id, undefined);
  t.is(onboarding.json.path_, undefined);
  t.is(onboarding.json.type, 'account_holder');
  t.is(onboarding.json.data.company_information.business_activity, 'Servicios financieros');
  t.is(onboarding.json.data.legal_representatives[0].first_name, 'Jane');
  t.deepEqual(
    onboarding.json.data.transactional_profile.resource_origins,
    ['trusts', 'investments'],
  );
});

test('fintoc.v2.entities.onboardings.submit()', async (t) => {
  const ctx: any = t.context;
  const entityId = 'ent_12345';
  const onboardingId = 'onb_12345';
  const onboarding = await ctx.fintoc.v2.entities.onboardings.submit(onboardingId, {
    entity_id: entityId,
  });

  t.is(onboarding.method, 'post');
  t.is(onboarding.url, `v2/entities/${entityId}/onboardings/${onboardingId}/submit`);
  t.is(onboarding.json.entity_id, undefined);
  t.is(onboarding.json.path_, undefined);
});

test('fintoc.v2.entities.onboardings.uploadDocument()', async (t) => {
  const ctx: any = t.context;
  const entityId = 'ent_12345';
  const onboardingId = 'onb_12345';
  const slotKey = 'tax_registration_certificate';
  const file = { data: Buffer.from('fake pdf'), filename: 'cert.pdf', contentType: 'application/pdf' };
  const onboarding = await ctx.fintoc.v2.entities.onboardings.uploadDocument(
    onboardingId,
    slotKey,
    file,
    { entity_id: entityId },
  );

  t.is(onboarding.method, 'put');
  t.is(onboarding.url, `v2/entities/${entityId}/onboardings/${onboardingId}/documents/${slotKey}`);
  t.true(onboarding.multipart);
});

test('fintoc.v2.entities.onboardings.uploadShareholderDocument()', async (t) => {
  const ctx: any = t.context;
  const entityId = 'ent_12345';
  const onboardingId = 'onb_12345';
  const shareholderId = 'onbsh_abcd';
  const file = { data: Buffer.from('fake pdf'), filename: 'id.pdf', contentType: 'application/pdf' };
  const onboarding = await ctx.fintoc.v2.entities.onboardings.uploadShareholderDocument(
    onboardingId,
    shareholderId,
    file,
    { entity_id: entityId },
  );

  t.is(onboarding.method, 'put');
  t.is(
    onboarding.url,
    `v2/entities/${entityId}/onboardings/${onboardingId}/shareholders/${shareholderId}/document`,
  );
  t.true(onboarding.multipart);
});

test('fintoc.v2.entities.onboardings.uploadLegalRepresentativeDocument()', async (t) => {
  const ctx: any = t.context;
  const entityId = 'ent_8anBwgZktbZH6ydyHa6Tm0eM';
  const onboardingId = 'onbprc_0ujsswThIGTUYm2K8FjOOfXtY1K';
  const legalRepresentativeId = 'onblr_0ujsswThIGTUYm2K8FjOOfXtY1K';
  const slotKey = 'identification';
  const file = { data: Buffer.from('fake pdf'), filename: 'id.pdf', contentType: 'application/pdf' };
  const onboarding = await ctx.fintoc.v2.entities.onboardings.uploadLegalRepresentativeDocument(
    onboardingId,
    legalRepresentativeId,
    slotKey,
    file,
    { entity_id: entityId },
  );

  t.is(onboarding.method, 'put');
  t.is(
    onboarding.url,
    `v2/entities/${entityId}/onboardings/${onboardingId}/legal_representatives/${legalRepresentativeId}/documents/${slotKey}`,
  );
  t.true(onboarding.multipart);
});

test('fintoc.apiKeys.list()', async (t) => {
  const ctx: any = t.context;
  const apiKeys = await ctx.fintoc.apiKeys.list();

  let count = 0;
  for await (const apiKey of apiKeys) {
    count += 1;
    t.is(apiKey.method, 'get');
    t.is(apiKey.url, 'v1/api_keys');
  }

  t.true(count > 0);
});

test('fintoc.whoami.get()', async (t) => {
  const ctx: any = t.context;
  const whoami = await ctx.fintoc.whoami.get('whoami');

  t.is(whoami.method, 'get');
  t.is(whoami.url, 'v1/whoami');
});

test('fintoc.charges.update()', async (t) => {
  const ctx: any = t.context;
  const chargeId = 'ch_12345';
  const charge = await ctx.fintoc.charges.update(chargeId, { amount: 2000, currency: 'CLP' });

  t.is(charge.method, 'patch');
  t.is(charge.url, `v1/charges/${chargeId}`);
  t.is(charge.json.amount, 2000);
  t.is(charge.json.currency, 'CLP');
});

test('fintoc.charges.cancel()', async (t) => {
  const ctx: any = t.context;
  const chargeId = 'ch_12345';
  const charge = await ctx.fintoc.charges.cancel(chargeId);

  t.is(charge.method, 'post');
  t.is(charge.url, `v1/charges/${chargeId}/cancel`);
  t.true(charge.headers['Idempotency-Key'] && charge.headers['Idempotency-Key'].length > 0);
});

test('fintoc.charges.cancel() with idempotency key', async (t) => {
  const ctx: any = t.context;
  const chargeId = 'ch_12345';
  const charge = await ctx.fintoc.charges.cancel(chargeId, { idempotency_key: 'idem_123' });

  t.is(charge.url, `v1/charges/${chargeId}/cancel`);
  t.is(charge.headers['Idempotency-Key'], 'idem_123');
});

test('fintoc.charges.cancel() does not send its options in the body', async (t) => {
  const ctx: any = t.context;
  const charge = await ctx.fintoc.charges.cancel('ch_12345', { idempotency_key: 'idem_123' });

  t.is(charge.json.path_, undefined);
  t.is(charge.json.idempotency_key, undefined);
});

test('fintoc.charges.cancel() returns a charge that updates on its own path', async (t) => {
  const ctx: any = t.context;
  const chargeId = 'ch_12345';
  const charge = await ctx.fintoc.charges.cancel(chargeId);
  await charge.update({ amount: 2000 });

  t.is(charge.method, 'patch');
  t.is(charge.url, `v1/charges/${chargeId}`);
  t.is(charge.json.amount, 2000);
});

test('fintoc.refunds.voucherUrl()', async (t) => {
  const ctx: any = t.context;
  const refundId = 'ref_12345';
  const voucher = await ctx.fintoc.refunds.voucherUrl(refundId);

  t.is(voucher.constructor.name, 'GenericFintocResource');
  t.is(voucher.method, 'get');
  t.is(voucher.url, `v1/refunds/${refundId}/voucher_url`);
});

test('fintoc.invoices.get()', async (t) => {
  const ctx: any = t.context;
  const invoiceId = 'in_12345';
  const invoice = await ctx.fintoc.invoices.get(invoiceId, { link_token: 'link_token' });

  t.is(invoice.method, 'get');
  t.is(invoice.url, `v1/invoices/${invoiceId}`);
  t.is(invoice.params.link_token, 'link_token');
});

test('fintoc.links.exchange()', async (t) => {
  const ctx: any = t.context;
  const link = await ctx.fintoc.links.exchange({ exchange_token: 'exchange_token' });

  t.is(link.constructor.name, 'Link');
  t.is(link.method, 'get');
  t.is(link.url, 'v1/links/exchange');
  t.is(link.params.exchange_token, 'exchange_token');
});

test('fintoc.institutions.list()', async (t) => {
  const ctx: any = t.context;
  const institutions = await ctx.fintoc.institutions.list({ country: 'cl' });

  let count = 0;
  for await (const institution of institutions) {
    count += 1;
    t.is(institution.constructor.name, 'Institution');
    t.is(institution.method, 'get');
    t.is(institution.url, 'v1/institutions');
    t.is(institution.params.country, 'cl');
  }

  t.true(count > 0);
});

test('fintoc.linkIntents.create()', async (t) => {
  const ctx: any = t.context;
  const linkIntentData = { country: 'cl', holder_type: 'individual', product: 'movements' };
  const linkIntent = await ctx.fintoc.linkIntents.create(linkIntentData);

  t.is(linkIntent.constructor.name, 'LinkIntent');
  t.is(linkIntent.method, 'post');
  t.is(linkIntent.url, 'v1/link_intents');
  t.is(linkIntent.json.country, linkIntentData.country);
  t.is(linkIntent.json.holder_type, linkIntentData.holder_type);
  t.is(linkIntent.json.product, linkIntentData.product);
  t.true(linkIntent.headers['Idempotency-Key'] && linkIntent.headers['Idempotency-Key'].length > 0);
});

test('fintoc.linkIntents.create() with idempotency key', async (t) => {
  const ctx: any = t.context;
  const linkIntent = await ctx.fintoc.linkIntents.create({
    country: 'cl', holder_type: 'individual', product: 'movements', idempotency_key: 'idem_123',
  });

  t.is(linkIntent.headers['Idempotency-Key'], 'idem_123');
});

test('fintoc.payouts.list()', async (t) => {
  const ctx: any = t.context;
  const payouts = await ctx.fintoc.payouts.list({ status: 'succeeded' });

  let count = 0;
  for await (const payout of payouts) {
    count += 1;
    t.is(payout.constructor.name, 'Payout');
    t.is(payout.method, 'get');
    t.is(payout.url, 'v1/payouts');
    t.is(payout.params.status, 'succeeded');
  }

  t.true(count > 0);
});

test('fintoc.payouts.get()', async (t) => {
  const ctx: any = t.context;
  const payoutId = 'po_12345';
  const payout = await ctx.fintoc.payouts.get(payoutId);

  t.is(payout.constructor.name, 'Payout');
  t.is(payout.method, 'get');
  t.is(payout.url, `v1/payouts/${payoutId}`);
});

test('fintoc.payouts.listResources()', async (t) => {
  const ctx: any = t.context;
  const payoutId = 'po_12345';
  const resources = await ctx.fintoc.payouts.listResources(payoutId, { resource_type: 'refund' });

  let count = 0;
  for await (const resource of resources) {
    count += 1;
    t.is(resource.constructor.name, 'Refund');
    t.is(resource.method, 'get');
    t.is(resource.url, `v1/payouts/${payoutId}/resources`);
    t.is(resource.params.resource_type, 'refund');
  }

  t.true(count > 0);
});

test('fintoc.taxStatements.list()', async (t) => {
  const ctx: any = t.context;
  const taxStatements = await ctx.fintoc.taxStatements.list({ link_token: 'link_token' });

  let count = 0;
  for await (const taxStatement of taxStatements) {
    count += 1;
    t.is(taxStatement.constructor.name, 'TaxStatement');
    t.is(taxStatement.method, 'get');
    t.is(taxStatement.url, 'v1/tax_statements');
    t.is(taxStatement.params.link_token, 'link_token');
  }

  t.true(count > 0);
});

test('fintoc.taxStatements.get()', async (t) => {
  const ctx: any = t.context;
  const taxStatementId = 'ts_12345';
  const taxStatement = await ctx.fintoc.taxStatements.get(taxStatementId, { link_token: 'link_token' });

  t.is(taxStatement.method, 'get');
  t.is(taxStatement.url, `v1/tax_statements/${taxStatementId}`);
  t.is(taxStatement.params.link_token, 'link_token');
});

test('fintoc.v2.invoices.create()', async (t) => {
  const { fintoc } = t.context as { fintoc: Fintoc };
  const invoiceData = {
    customer: 'cus_12345',
    collection_method: 'send_invoice',
    lines: [{ amount: 60000, currency: 'CLP', name: 'Design', quantity: 2 }],
  };
  const invoice = await fintoc.v2.invoices.create(invoiceData);

  t.is(invoice.method, 'post');
  t.is(invoice.url, 'v2/invoices');
  t.is(invoice.json.customer, invoiceData.customer);
  t.is(invoice.json.collection_method, invoiceData.collection_method);
  t.deepEqual(invoice.json.lines[0].serialize(), invoiceData.lines[0]);
  t.true(invoice.headers['Idempotency-Key'] && invoice.headers['Idempotency-Key'].length > 0);
});

test('fintoc.v2.invoices.create() with idempotency key', async (t) => {
  const { fintoc } = t.context as { fintoc: Fintoc };
  const invoice = await fintoc.v2.invoices.create({
    customer: 'cus_12345',
    collection_method: 'send_invoice',
    lines: [{ amount: 60000, currency: 'CLP', name: 'Design', quantity: 2 }],
    idempotency_key: 'idem_123',
  });

  t.is(invoice.headers['Idempotency-Key'], 'idem_123');
});

test('fintoc.v2.invoices.update()', async (t) => {
  const ctx: any = t.context;
  const invoiceId = 'in_12345';
  const invoice = await ctx.fintoc.v2.invoices.update(invoiceId, { metadata: { order: '42' } });

  t.is(invoice.method, 'patch');
  t.is(invoice.url, `v2/invoices/${invoiceId}`);
  t.is(invoice.json.metadata.order, '42');
});

[
  ['finalize', 'finalize'],
  ['markUncollectible', 'mark_uncollectible'],
  ['pay', 'pay'],
  ['void', 'void'],
].forEach(([method, action]) => {
  test(`fintoc.v2.invoices.${method}()`, async (t) => {
    const ctx: any = t.context;
    const invoiceId = 'in_12345';
    const invoice = await ctx.fintoc.v2.invoices[method](invoiceId);

    t.is(invoice.method, 'post');
    t.is(invoice.url, `v2/invoices/${invoiceId}/${action}`);
    t.true(invoice.headers['Idempotency-Key'] && invoice.headers['Idempotency-Key'].length > 0);
  });

  test(`fintoc.v2.invoices.${method}() with idempotency key`, async (t) => {
    const ctx: any = t.context;
    const invoice = await ctx.fintoc.v2.invoices[method]('in_12345', { idempotency_key: 'idem_123' });

    t.is(invoice.headers['Idempotency-Key'], 'idem_123');
  });
});

test('fintoc.v2.invoices.pay() forwards its body', async (t) => {
  const ctx: any = t.context;
  const invoice = await ctx.fintoc.v2.invoices.pay('in_12345', { payment_method: 'pm_12345' });

  t.is(invoice.json.payment_method, 'pm_12345');
});

test('fintoc.v2.invoices.finalize() does not send its options in the body', async (t) => {
  const ctx: any = t.context;
  const invoice = await ctx.fintoc.v2.invoices.finalize('in_12345', { idempotency_key: 'idem_123' });

  t.is(invoice.json.path_, undefined);
  t.is(invoice.json.idempotency_key, undefined);
});

test('fintoc.v2.invoices.finalize() returns an invoice that updates on its own path', async (t) => {
  const ctx: any = t.context;
  const invoiceId = 'in_12345';
  const invoice = await ctx.fintoc.v2.invoices.finalize(invoiceId);
  await invoice.update({ metadata: { order: '42' } });

  t.is(invoice.method, 'patch');
  t.is(invoice.url, `v2/invoices/${invoiceId}`);
  t.is(invoice.json.metadata.order, '42');
});

test('fintoc.v2.paymentIntents.cancel()', async (t) => {
  const ctx: any = t.context;
  const paymentIntentId = 'pi_12345';
  const paymentIntent = await ctx.fintoc.v2.paymentIntents.cancel(paymentIntentId);

  t.is(paymentIntent.method, 'post');
  t.is(paymentIntent.url, `v2/payment_intents/${paymentIntentId}/cancel`);
  t.true(paymentIntent.headers['Idempotency-Key'] && paymentIntent.headers['Idempotency-Key'].length > 0);
});

test('fintoc.v2.paymentIntents.cancel() with idempotency key', async (t) => {
  const ctx: any = t.context;
  const paymentIntent = await ctx.fintoc.v2.paymentIntents.cancel('pi_12345', { idempotency_key: 'idem_123' });

  t.is(paymentIntent.headers['Idempotency-Key'], 'idem_123');
});

test('fintoc.v2.paymentIntents.checkEligibility()', async (t) => {
  const ctx: any = t.context;
  const eligibilityData = {
    amount: 1000,
    currency: 'CLP',
    sender_account: { holder_id: '111111111' },
  };
  const result = await ctx.fintoc.v2.paymentIntents.checkEligibility(eligibilityData);

  t.is(result.constructor.name, 'GenericFintocResource');
  t.is(result.method, 'post');
  t.is(result.url, 'v2/payment_intents/check_eligibility');
  t.is(result.json.amount, eligibilityData.amount);
  t.is(result.json.currency, eligibilityData.currency);
  t.is(result.json.sender_account.holder_id, eligibilityData.sender_account.holder_id);
  t.true(result.headers['Idempotency-Key'] && result.headers['Idempotency-Key'].length > 0);
});

test('fintoc.v2.paymentIntents.checkEligibility() with idempotency key', async (t) => {
  const ctx: any = t.context;
  const result = await ctx.fintoc.v2.paymentIntents.checkEligibility({
    amount: 1000, currency: 'CLP', idempotency_key: 'idem_123',
  });

  t.is(result.headers['Idempotency-Key'], 'idem_123');
  t.is(result.json.idempotency_key, undefined);
});

test('fintoc.v2.paymentIntents.voucherUrl()', async (t) => {
  const ctx: any = t.context;
  const paymentIntentId = 'pi_12345';
  const voucher = await ctx.fintoc.v2.paymentIntents.voucherUrl(paymentIntentId);

  t.is(voucher.method, 'get');
  t.is(voucher.url, `v2/payment_intents/${paymentIntentId}/voucher_url`);
});

test('fintoc.v2.paymentMethods.create()', async (t) => {
  const ctx: any = t.context;
  const file = (filename: string) => ({
    data: Buffer.from('fake pdf'), filename, contentType: 'application/pdf',
  });
  const paymentMethod = await ctx.fintoc.v2.paymentMethods.create({
    type: 'mx_direct_debit',
    customer: 'cus_12345',
    mx_direct_debit: {
      account_number: '000000000000000000',
      account_type: 'clabe',
      interval: 'month',
      max_amount: 100000,
      account_holder: { name: 'Test Customer' },
      consent_documents: {
        contract: file('contract.pdf'),
        selfie: file('selfie.pdf'),
        id_front: file('id_front.pdf'),
        id_back: file('id_back.pdf'),
      },
    },
  });

  t.is(paymentMethod.method, 'post');
  t.is(paymentMethod.url, 'v2/payment_methods');
  t.true(paymentMethod.multipart);
  t.deepEqual(paymentMethod.multipartFields, [
    'type',
    'customer',
    'mx_direct_debit[account_number]',
    'mx_direct_debit[account_type]',
    'mx_direct_debit[interval]',
    'mx_direct_debit[max_amount]',
    'mx_direct_debit[account_holder][name]',
    'mx_direct_debit[consent_documents][contract]',
    'mx_direct_debit[consent_documents][selfie]',
    'mx_direct_debit[consent_documents][id_front]',
    'mx_direct_debit[consent_documents][id_back]',
  ]);
  t.true(paymentMethod.headers['Idempotency-Key'] && paymentMethod.headers['Idempotency-Key'].length > 0);
});

test('fintoc.v2.paymentMethods.create() with idempotency key', async (t) => {
  const ctx: any = t.context;
  const paymentMethod = await ctx.fintoc.v2.paymentMethods.create({
    type: 'mx_direct_debit', customer: 'cus_12345', idempotency_key: 'idem_123',
  });

  t.is(paymentMethod.headers['Idempotency-Key'], 'idem_123');
  t.deepEqual(paymentMethod.multipartFields, ['type', 'customer']);
});

test('fintoc.v2.paymentMethods.cancel()', async (t) => {
  const ctx: any = t.context;
  const paymentMethodId = 'pm_12345';
  const paymentMethod = await ctx.fintoc.v2.paymentMethods.cancel(paymentMethodId);

  t.is(paymentMethod.method, 'post');
  t.is(paymentMethod.url, `v2/payment_methods/${paymentMethodId}/cancel`);
  t.true(paymentMethod.headers['Idempotency-Key'] && paymentMethod.headers['Idempotency-Key'].length > 0);
});

test('fintoc.v2.paymentMethods.cancel() with idempotency key', async (t) => {
  const ctx: any = t.context;
  const paymentMethod = await ctx.fintoc.v2.paymentMethods.cancel('pm_12345', { idempotency_key: 'idem_123' });

  t.is(paymentMethod.headers['Idempotency-Key'], 'idem_123');
});

test('fintoc.v2.paymentMethods.mandateDocument()', async (t) => {
  const ctx: any = t.context;
  const paymentMethodId = 'pm_12345';
  const document = await ctx.fintoc.v2.paymentMethods.mandateDocument(paymentMethodId);

  t.is(document.method, 'get');
  t.is(document.url, `v2/payment_methods/${paymentMethodId}/mandate_document`);
});

test('fintoc.v2.products.update()', async (t) => {
  const ctx: any = t.context;
  const productId = 'prod_12345';
  const product = await ctx.fintoc.v2.products.update(productId, { name: 'New name' });

  t.is(product.method, 'patch');
  t.is(product.url, `v2/products/${productId}`);
  t.is(product.json.name, 'New name');
});

test('fintoc.v2.subscriptions.detachPaymentMethod()', async (t) => {
  const ctx: any = t.context;
  const subscriptionId = 'sub_12345';
  const subscription = await ctx.fintoc.v2.subscriptions.detachPaymentMethod(subscriptionId);

  t.is(subscription.constructor.name, 'Subscription');
  t.is(subscription.method, 'delete');
  t.is(subscription.url, `v2/subscriptions/${subscriptionId}/payment_method`);
});

test('fintoc.v2.transfers.receipt()', async (t) => {
  const ctx: any = t.context;
  const transferId = 'tr_12345';
  const receipt = await ctx.fintoc.v2.transfers.receipt(transferId);

  t.is(receipt.constructor.name, 'TransferReceipt');
  t.is(receipt.method, 'get');
  t.is(receipt.url, `v2/transfers/${transferId}/receipt`);
});

test('fintoc.v2.entities.settlementAccount()', async (t) => {
  const ctx: any = t.context;
  const entityId = 'ent_12345';
  const settlementAccount = await ctx.fintoc.v2.entities.settlementAccount(entityId);

  t.is(settlementAccount.constructor.name, 'SettlementAccount');
  t.is(settlementAccount.method, 'get');
  t.is(settlementAccount.url, `v2/entities/${entityId}/settlement_account`);
});

test('fintoc.v2.entities.create()', async (t) => {
  const ctx: any = t.context;
  const entity = await ctx.fintoc.v2.entities.create({ holder_name: 'Test' });

  t.is(entity.method, 'post');
  t.is(entity.url, 'v2/entities');
});

test('fintoc.v2.entities.onboardings.addDocument()', async (t) => {
  const ctx: any = t.context;
  const entityId = 'ent_12345';
  const onboardingId = 'onb_12345';
  const slotKey = 'incorporation_amendments';
  const file = { data: Buffer.from('fake pdf'), filename: 'cert.pdf', contentType: 'application/pdf' };
  const onboarding = await ctx.fintoc.v2.entities.onboardings.addDocument(
    onboardingId,
    slotKey,
    file,
    { entity_id: entityId },
  );

  t.is(onboarding.method, 'post');
  t.is(onboarding.url, `v2/entities/${entityId}/onboardings/${onboardingId}/documents/${slotKey}`);
  t.true(onboarding.multipart);
  t.deepEqual(onboarding.multipartFields, ['file']);
  t.true(onboarding.headers['Idempotency-Key'] && onboarding.headers['Idempotency-Key'].length > 0);
});

test('fintoc.v2.entities.onboardings.addDocument() preserves the idempotency key on retries', async (t) => {
  const { fintoc } = t.context as { fintoc: Fintoc };
  const file = { data: Buffer.from('fake pdf'), filename: 'amendment.pdf', contentType: 'application/pdf' };

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const onboarding = await fintoc.v2.entities.onboardings.addDocument(
      'onb_12345',
      'incorporation_amendments',
      file,
      { entity_id: 'ent_12345', idempotency_key: 'idem_123' },
    );

    t.is(onboarding.headers['Idempotency-Key'], 'idem_123');
    t.deepEqual(onboarding.multipartFields, ['file']);
  }
});

test('fintoc.v2.entities.onboardings.deleteDocument()', async (t) => {
  const ctx: any = t.context;
  const entityId = 'ent_12345';
  const onboardingId = 'onb_12345';
  const slotKey = 'tax_registration_certificate';
  const documentId = 'onbdoc_12345';
  const onboarding = await ctx.fintoc.v2.entities.onboardings.deleteDocument(
    onboardingId,
    slotKey,
    documentId,
    { entity_id: entityId },
  );

  t.is(onboarding.method, 'delete');
  t.is(
    onboarding.url,
    `v2/entities/${entityId}/onboardings/${onboardingId}/documents/${slotKey}/${documentId}`,
  );
  t.is(onboarding.params.entity_id, undefined);
});

test('fintoc.v2.events.list()', async (t) => {
  const ctx: any = t.context;
  const events = await ctx.fintoc.v2.events.list({ type: 'payment_intent.succeeded' });

  let count = 0;
  for await (const event of events) {
    count += 1;
    t.is(event.method, 'get');
    t.is(event.url, 'v2/events');
    t.is(event.params.type, 'payment_intent.succeeded');
  }

  t.true(count > 0);
});

test('fintoc.v2.events.get()', async (t) => {
  const ctx: any = t.context;
  const eventId = 'evt_12345';
  const event = await ctx.fintoc.v2.events.get(eventId);

  t.is(event.method, 'get');
  t.is(event.url, `v2/events/${eventId}`);
});

test('fintoc.v2.setupIntents.get()', async (t) => {
  const ctx: any = t.context;
  const setupIntentId = 'seti_12345';
  const setupIntent = await ctx.fintoc.v2.setupIntents.get(setupIntentId);

  t.is(setupIntent.constructor.name, 'SetupIntent');
  t.is(setupIntent.method, 'get');
  t.is(setupIntent.url, `v2/setup_intents/${setupIntentId}`);
});
