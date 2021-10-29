import test from 'ava';

import { Fintoc } from '../lib/core';
import { LinksManager, WebhookEndpointsManager } from '../lib/managers';

test('"Fintoc" object creation', (t) => {
  const apiKey = 'super_secret_api_key';
  const fintoc = new Fintoc(apiKey);
  t.assert(fintoc.links instanceof LinksManager);
  t.assert(fintoc.webhookEndpoints instanceof WebhookEndpointsManager);
});
