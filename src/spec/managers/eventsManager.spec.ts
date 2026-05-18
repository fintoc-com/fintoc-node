import test from 'ava';

import { Client } from '../../lib/client';
import { EventsManager } from '../../lib/managers';
import { Event } from '../../lib/resources/event';
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

  ctx.client = new Client({
    baseUrl: 'https://test.com',
    apiKey: 'super_secret_api_key',
    userAgent: 'fintoc-node/test',
  });
  ctx.path = '/v1/events';
});

test('"EventsManager.trigger" posts to the trigger endpoint with type and overrides', async (t) => {
  const ctx: any = t.context;
  const manager = new EventsManager(ctx.path, ctx.client);

  const event = await manager.trigger({
    type: 'payment_intent.succeeded',
    overrides: { amount: 5000, currency: 'CLP' },
  });

  t.true(event instanceof Event);
  t.is(event.method, 'post');
  t.is(event.url, 'v1/events/trigger');
  t.is(event.json.type, 'payment_intent.succeeded');
  t.is(event.json.overrides.amount, 5000);
  t.is(event.json.overrides.currency, 'CLP');
});

test('"EventsManager.trigger" works without overrides', async (t) => {
  const ctx: any = t.context;
  const manager = new EventsManager(ctx.path, ctx.client);

  const event = await manager.trigger({ type: 'payment_intent.failed' });

  t.true(event instanceof Event);
  t.is(event.method, 'post');
  t.is(event.url, 'v1/events/trigger');
  t.is(event.json.type, 'payment_intent.failed');
});

test('"EventsManager.trigger" supports nested overrides', async (t) => {
  const ctx: any = t.context;
  const manager = new EventsManager(ctx.path, ctx.client);

  const event = await manager.trigger({
    type: 'payment_intent.succeeded',
    overrides: {
      payment_intent: {
        amount: 5000,
        currency: 'CLP',
        metadata: { customer_id: 'cus_123' },
      },
    },
  });

  t.true(event instanceof Event);
  t.is(event.json.overrides.payment_intent.amount, 5000);
  t.is(event.json.overrides.payment_intent.currency, 'CLP');
  t.is(event.json.overrides.payment_intent.metadata.customer_id, 'cus_123');
});
