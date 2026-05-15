import test from 'ava';

import { Client } from '../../lib/client';
import { WebhookEndpointsManager } from '../../lib/managers';
import { WebhookEndpoint } from '../../lib/resources/webhookEndpoint';
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
  ctx.path = '/v1/webhook_endpoints';
});

test('"WebhookEndpointsManager.test" posts to the test endpoint', async (t) => {
  const ctx: any = t.context;
  const manager = new WebhookEndpointsManager(ctx.path, ctx.client);

  const event = await manager.test('we_123', { type: 'payment_intent.succeeded' });

  t.true(event instanceof WebhookEndpoint);
  t.is(event.id, 'we_123');
  t.is(event.method, 'post');
  t.is(event.url, 'v1/webhook_endpoints/we_123/test');
  t.is(event.json.type, 'payment_intent.succeeded');
});
