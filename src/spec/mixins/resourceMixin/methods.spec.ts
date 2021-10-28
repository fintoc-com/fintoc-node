import test from 'ava';

import { Client } from '../../../lib/client';
import { mockAxios, restore } from '../../mocks/initializers';

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
});

test.todo('"ResourceMixin" methods tests');
