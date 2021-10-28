/* eslint-disable no-console */

import test from 'ava';

import { Client } from '../../../lib/client';
import { mockAxios, restore } from '../../mocks/initializers';

import { EmptyMockResource } from './mocks/emptyMockResource';

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
  ctx.path = '/resources';
  ctx.handlers = {
    update: (object: any) => {
      console.log('Calling update...');
      return object;
    },
    delete: (identifier: string) => {
      console.log('Calling delete...');
      return identifier;
    },
  };
});

test('"ResourceMixin" serialization method', async (t) => {
  const ctx: any = t.context;

  const methods = ['delete'];
  const data = {
    id: 'id0',
    identifier: 'identifier0',
    resource: { id: 'id3', identifier: 'identifier3' },
  };
  // @ts-ignore: property is protected
  const resource = await EmptyMockResource._build(
    ctx.client, ctx.handlers, methods, ctx.path, data,
  );

  t.deepEqual(resource.serialize(), data);
});

test('"ResourceMixin" serialization method (array)', async (t) => {
  const ctx: any = t.context;

  const methods = ['delete'];
  const data = {
    id: 'id0',
    identifier: 'identifier0',
    resources: [
      { id: 'id1', identifier: 'identifier1' },
      { id: 'id2', identifier: 'identifier2' },
    ],
    resource: { id: 'id3', identifier: 'identifier3' },
  };
  // @ts-ignore: property is protected
  const resource = await EmptyMockResource._build(
    ctx.client, ctx.handlers, methods, ctx.path, data,
  );

  t.deepEqual(resource.serialize(), data);
});
