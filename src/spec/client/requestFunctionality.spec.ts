import * as crypto from 'crypto';

import test from 'ava';

import { Client } from '../../lib/client';
import { mockAxios, restore } from '../mocks/initializers';
import { isAsyncGenerator, isDictLike } from '../shared/utils';

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
  ctx.baseURL = 'https://test.com';
  ctx.apiKey = 'super_secret_api_key';
  ctx.userAgent = 'fintoc-node/test';
  ctx.params = { first_param: 'first_value', second_param: 'second_value' };
  ctx.client = new Client({ baseUrl: ctx.baseURL, apiKey: ctx.apiKey, userAgent: ctx.userAgent });
});

test('"Client" paginated request', async (t) => {
  const ctx: any = t.context;

  const data = await ctx.client.request({ path: '/movements', paginated: true });

  t.assert(isAsyncGenerator(data));
});

test('"Client" get request', async (t) => {
  const ctx: any = t.context;

  const data = await ctx.client.request({ path: '/movements/3', method: 'get' });

  t.assert(!isAsyncGenerator(data));
  t.assert(isDictLike(data));
  t.assert(Object.keys(data).length > 0);
});

test('"Client" delete request', async (t) => {
  const ctx: any = t.context;

  const data = await ctx.client.request({ path: '/movements/3', method: 'delete' });

  t.assert(!isAsyncGenerator(data));
  t.assert(isDictLike(data));
  t.assert(Object.keys(data).length === 0);
});

test('"Client" post request without idempotency key adds one automatically', async (t) => {
  const ctx: any = t.context;

  const data = await ctx.client.request({
    path: '/movements',
    method: 'post',
    json: { test: 'data' },
  });

  t.assert(!isAsyncGenerator(data));
  t.assert(isDictLike(data));
  t.assert(typeof data.headers['Idempotency-Key'] === 'string');
  t.assert(data.headers['Idempotency-Key'].length > 0);
});

test('"Client" post request with idempotency key uses provided key', async (t) => {
  const ctx: any = t.context;
  const testIdempotencyKey = 'test-idempotency-key-123';

  const data = await ctx.client.request({
    path: '/movements',
    method: 'post',
    json: { test: 'data' },
    idempotencyKey: testIdempotencyKey,
  });

  t.assert(!isAsyncGenerator(data));
  t.assert(isDictLike(data));
  t.assert(data.headers['Idempotency-Key'] === testIdempotencyKey);
});

test('"Client" extended instance signs post requests with JWS header', async (t) => {
  const ctx: any = t.context;
  const { privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  const signedClient = new Client({
    baseUrl: ctx.baseURL,
    apiKey: ctx.apiKey,
    userAgent: ctx.userAgent,
    jwsPrivateKey: privateKey,
  });
  const extendedClient = signedClient.extend({ params: { link_token: 'lt_test' } });

  const data: any = await extendedClient.request({
    path: '/transfers',
    method: 'post',
    json: { test: 'data' },
  });

  t.assert(!isAsyncGenerator(data));
  t.assert(isDictLike(data));
  t.truthy(data.headers['Fintoc-JWS-Signature']);
});

test.serial('"Client" instances create isolated axios clients with their own defaults', async (t) => {
  const ctx: any = t.context;
  const callsBefore = ctx.axiosMock.callCount;

  const clientA = new Client({
    baseUrl: 'https://tenant-a.test.com',
    apiKey: 'sk_live_tenant_a',
    userAgent: ctx.userAgent,
    params: { link_token: 'lt_tenant_a' },
  });
  const clientB = new Client({
    baseUrl: 'https://tenant-b.test.com',
    apiKey: 'sk_live_tenant_b',
    userAgent: ctx.userAgent,
  });

  const respA: any = await clientA.request({ path: '/accounts', method: 'get' });
  const respB: any = await clientB.request({ path: '/accounts', method: 'get' });

  t.is(ctx.axiosMock.callCount, callsBefore + 2);
  const firstConfig = ctx.axiosMock.getCall(callsBefore).args[0];
  const secondConfig = ctx.axiosMock.getCall(callsBefore + 1).args[0];
  t.is(firstConfig.params, undefined);
  t.is(secondConfig.params, undefined);
  t.is(respA[0].params.link_token, 'lt_tenant_a');
  t.deepEqual(respB[0].params, {});
  t.is(firstConfig.headers.Authorization, 'sk_live_tenant_a');
  t.is(secondConfig.headers.Authorization, 'sk_live_tenant_b');
});

test.serial('"Client" paginated request on extended client omits default params from axios instance config', async (t) => {
  const ctx: any = t.context;
  const callsBefore = ctx.axiosMock.callCount;

  const baseClient = new Client({
    baseUrl: ctx.baseURL,
    apiKey: ctx.apiKey,
    userAgent: ctx.userAgent,
  });
  const extendedClient = baseClient.extend({ params: { link_token: 'lt_paginated' } });
  const pages = await extendedClient.request({ path: '/movements', paginated: true });

  const items: Array<Record<string, any>> = [];
  for await (const item of pages) {
    items.push(item);
  }

  t.is(ctx.axiosMock.callCount, callsBefore + 1);
  t.is(ctx.axiosMock.getCall(callsBefore).args[0].params, undefined);
  t.is(items.length, 100);
  t.is(items[0].params.link_token, 'lt_paginated');
});
