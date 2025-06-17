import test from 'ava';

import { Client } from '../../lib/client';

test.beforeEach((t) => {
  const ctx: any = t.context;
  ctx.baseURL = 'https://test.com';
  ctx.apiKey = 'super_secret_api_key';
  ctx.userAgent = 'fintoc-node/test';
  ctx.params = { first_param: 'first_value', second_param: 'second_value' };

  function createClient(params = false) {
    if (!params) {
      return new Client({ baseUrl: ctx.baseURL, apiKey: ctx.apiKey, userAgent: ctx.userAgent });
    }
    return new Client({
      baseUrl: ctx.baseURL, apiKey: ctx.apiKey, userAgent: ctx.userAgent, params: ctx.params,
    });
  }

  ctx.createClient = createClient;
});

test('"Client" creation without parameters', (t) => {
  const ctx: any = t.context;
  const client = ctx.createClient();
  t.assert(client instanceof Client);
  t.assert(client.baseUrl === ctx.baseURL);
  t.assert(client.apiKey === ctx.apiKey);
  t.assert(client.userAgent === ctx.userAgent);
  t.assert(
    client.params
    && Object.keys(client.params).length === 0
    && client.params.constructor === Object,
  );
});

test('"Client" creation with parameters', (t) => {
  const ctx: any = t.context;
  const client = ctx.createClient(true);
  t.assert(client instanceof Client);
  t.assert(client.baseUrl === ctx.baseURL);
  t.assert(client.apiKey === ctx.apiKey);
  t.assert(client.userAgent === ctx.userAgent);
  t.assert(client.params === ctx.params);
});

test('"Client" headers', (t) => {
  const ctx: any = t.context;
  const client = ctx.createClient();
  t.assert(client instanceof Client);
  t.assert(Object.keys(client.headers).length === 3);
  t.assert('Authorization' in client.headers);
  t.assert('User-Agent' in client.headers);
  t.assert(client.headers.Authorization === ctx.apiKey);
  t.assert(client.headers['User-Agent'] === ctx.userAgent);
});

test('"Client" extension', (t) => {
  const ctx: any = t.context;
  const client = ctx.createClient();
  t.assert(client instanceof Client);

  const newURL = 'https://new-test.com';
  const newApiKey = 'new_super_secret_api_key';
  const newClient = client.extend({ baseUrl: newURL, apiKey: newApiKey });
  t.assert(newClient instanceof Client);

  t.assert(newClient !== client);
});

test('"Client" params extension', (t) => {
  const ctx: any = t.context;
  const client = ctx.createClient(true);
  t.assert(client instanceof Client);

  const newParams = { link_token: 'link_token', first_param: 'new_first_value' };
  const newClient = client.extend({ params: newParams });
  t.assert(Object.keys(newClient.params).length === Object.keys(client.params).length + 1);
  t.assert(newClient.params.first_param !== client.params.first_param);
});
