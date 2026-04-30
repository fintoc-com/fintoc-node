import test from 'ava';

import { Fintoc } from '../lib/core';
import { LinksManager, WebhookEndpointsManager } from '../lib/managers';

test('"Fintoc" object creation', (t) => {
  const apiKey = 'super_secret_api_key';
  const fintoc = new Fintoc(apiKey);
  t.assert(fintoc.links instanceof LinksManager);
  t.assert(fintoc.webhookEndpoints instanceof WebhookEndpointsManager);
});

test('"Fintoc" object creation with custom userAgent', (t) => {
  const apiKey = 'super_secret_api_key';
  const fintoc = new Fintoc(apiKey, undefined, { userAgent: 'fintoc-cli/0.1.0' });
  t.assert(fintoc.links instanceof LinksManager);
  t.assert(fintoc.webhookEndpoints instanceof WebhookEndpointsManager);
  t.is((fintoc.links as any)._client.userAgent, 'fintoc-cli/0.1.0');
});

test('"Fintoc" object creation uses default userAgent when not provided', (t) => {
  const apiKey = 'super_secret_api_key';
  const fintoc = new Fintoc(apiKey);
  t.true((fintoc.links as any)._client.userAgent.startsWith('fintoc-node/'));
});
