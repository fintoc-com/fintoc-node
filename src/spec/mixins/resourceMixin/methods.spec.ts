import test from 'ava';

import { Client } from '../../../lib/client';
import { mockAxios, restore } from '../../mocks/initializers';

import { ComplexMockResource } from './mocks/complexMockResource';
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
    update: (object: any) => object,
    delete: (identifier: string) => identifier,
  };
});

test('"ResourceMixin" methods empty mock resource delete method', async (t) => {
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

  const identifier = await resource.delete();

  t.not(identifier, data.identifier);
  t.is(identifier, data.id);
});

test('"ResourceMixin" methods complex mock resource delete method', async (t) => {
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
  const resource = await ComplexMockResource._build(
    ctx.client, ctx.handlers, methods, ctx.path, data,
  );

  const identifier = await resource.delete();

  t.not(identifier, data.id);
  t.is(identifier, data.identifier);
});

test('"ResourceMixin" methods empty mock resource update method', async (t) => {
  const ctx: any = t.context;

  const methods = ['update'];
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

  await resource.update();

  t.assert(!resource.url.includes(data.identifier));
  t.assert(resource.url.includes(data.id));
});

test('"ResourceMixin" methods complex mock resource update method', async (t) => {
  const ctx: any = t.context;

  const methods = ['update'];
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
  const resource = await ComplexMockResource._build(
    ctx.client, ctx.handlers, methods, ctx.path, data,
  );

  await resource.update();

  t.assert(!resource.url.includes(data.id));
  t.assert(resource.url.includes(data.identifier));
});
