import test from 'ava';

import { Client } from '../../../lib/client';
import { ResourceMixin } from '../../../lib/mixins';
import { GenericFintocResource } from '../../../lib/resources/genericFintocResource';
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
    update: (object: any, identifier: string) => {
      console.log('Calling update...');
      return object;
    },
    delete: (identifier: string) => {
      console.log('Calling delete...');
      return identifier;
    },
  };
});

test('"ResourceMixin" creation empty mock resource', async (t) => {
  const ctx: any = t.context;

  const methods: string[] = [];
  const data = {
    id: 'id0',
    identifier: 'identifier0',
    resources: [
      { id: 'id1', identifier: 'identifier1' },
      { id: 'id2', identifier: 'identifier2' },
    ],
    resource: { id: 'id3', identifier: 'identifier3' },
  };
  const resource = await EmptyMockResource._build(
    ctx.client, ctx.handlers, methods, ctx.path, data,
  );

  t.assert(resource instanceof ResourceMixin);
  // t.assert(resource.resource instanceof GenericFintocResource);
  // t.is(resource.resource.id, data.resource.id);
  // t.assert(Array.isArray(resource.resources));
  // resource.resources.forEach((subResource: any) => {
  //   t.assert(subResource instanceof GenericFintocResource);
  // });
});
